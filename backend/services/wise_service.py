"""
Wise API Service
Handles international remittances through Wise Platform API
"""
import os
import httpx
from typing import Dict, Optional, List
from dotenv import load_dotenv
from services.payment_provider import PaymentProviderInterface

load_dotenv()

WISE_API_TOKEN = os.getenv('WISE_API_TOKEN')
WISE_API_URL = os.getenv('WISE_API_URL', 'https://api.sandbox.transferwise.tech' if os.getenv('WISE_SANDBOX', 'true').lower() == 'true' else 'https://api.transferwise.com')
WISE_SANDBOX = os.getenv('WISE_SANDBOX', 'true').lower() == 'true'

class WiseService(PaymentProviderInterface):
    """Wise API integration for international remittances"""
    
    def __init__(self):
        if not WISE_API_TOKEN:
            raise ValueError(
                "WISE_API_TOKEN is not set. Please set it in your .env file. "
                "Get your API token from: https://wise.com/user/account/api-tokens"
            )
        self.api_token = WISE_API_TOKEN
        self.base_url = WISE_API_URL
        self.sandbox = WISE_SANDBOX
        self.headers = {
            'Authorization': f'Bearer {self.api_token}',
            'Content-Type': 'application/json'
        }
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Dict:
        """Make HTTP request to Wise API"""
        url = f"{self.base_url}{endpoint}"
        try:
            response = httpx.request(
                method=method,
                url=url,
                headers=self.headers,
                json=data,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            raise Exception(f"Wise API error: {str(e)}")
    
    def _get_profile_id(self) -> int:
        """Get the first available profile ID"""
        profiles = self._make_request('GET', '/v1/profiles')
        if not profiles:
            raise Exception("No Wise profiles found")
        return profiles[0]['id']
    
    def create_transfer(self, amount: float, currency: str, recipient: Dict, reference: str, use_target_amount: bool = False) -> Dict:
        """
        Create an international transfer via Wise
        
        Args:
            amount: Transfer amount in source currency
            currency: Source currency code (TZS, USD, EUR, GBP, etc.)
            recipient: Recipient details {
                'name': str,
                'account_number': str,
                'routing_number': Optional[str],
                'iban': Optional[str],
                'swift': Optional[str],
                'country': str (ISO country code),
                'currency': str (target currency),
                'city': Optional[str],
                'address': Optional[str],
                'postal_code': Optional[str],
                'purpose': Optional[str],
                'source_of_funds': Optional[str],
                'legal_type': Optional[str] (PRIVATE or BUSINESS)
            }
            reference: Transaction reference
            
        Returns:
            Transfer details including transfer_id, quote_id, recipient_account_id
        """
        profile_id = self._get_profile_id()
        target_currency = recipient.get('currency', currency)
        
        # Step 1: Create quote (v3 API)
        quote_data = {
            'sourceCurrency': currency,
            'targetCurrency': target_currency,
            'payOut': 'BANK_TRANSFER',  # Default payout method
            'preferredPayIn': 'BANK_TRANSFER'  # We'll fund via bank transfer
        }
        
        # Use targetAmount if customer wants to send specific amount to recipient
        # Otherwise use sourceAmount (what customer is sending)
        if use_target_amount:
            quote_data['targetAmount'] = amount
        else:
            quote_data['sourceAmount'] = amount
            
        quote = self._make_request('POST', f'/v3/profiles/{profile_id}/quotes', quote_data)
        quote_uuid = quote['id']
        
        # Step 2: Create recipient account (v1 API)
        recipient_account_data = {
            'currency': target_currency,
            'type': self._get_recipient_type(target_currency, recipient.get('country')),
            'profile': profile_id,
            'accountHolderName': recipient['name'],
            'ownedByCustomer': False,
            'details': {
                'legalType': recipient.get('legal_type', 'PRIVATE'),
                'accountNumber': recipient.get('account_number'),
                'routingNumber': recipient.get('routing_number'),
                'iban': recipient.get('iban'),
                'swiftCode': recipient.get('swift'),
                'sortCode': recipient.get('sort_code'),
                'dateOfBirth': recipient.get('date_of_birth')
            }
        }
        
        # Add address if required (for USD, PHP, THB, TRY, or if source is USD/AUD)
        # Address should be at the top level, not inside details
        if target_currency in ['USD', 'PHP', 'THB', 'TRY'] or currency in ['USD', 'AUD']:
            if recipient.get('address') or recipient.get('city') or recipient.get('country'):
                recipient_account_data['details']['address'] = {}
                if recipient.get('country'):
                    recipient_account_data['details']['address']['country'] = recipient.get('country')
                if recipient.get('city'):
                    recipient_account_data['details']['address']['city'] = recipient.get('city')
                if recipient.get('postal_code'):
                    recipient_account_data['details']['address']['postCode'] = recipient.get('postal_code')
                if recipient.get('address'):
                    recipient_account_data['details']['address']['firstLine'] = recipient.get('address')
                if recipient.get('state_code'):
                    recipient_account_data['details']['address']['stateCode'] = recipient.get('state_code')
        
        recipient_account = self._make_request('POST', '/v1/accounts', recipient_account_data)
        recipient_account_id = recipient_account['id']
        
        # Step 3: Update quote with recipient (optional, but can affect pricing)
        try:
            self._make_request('PATCH', f'/v3/profiles/{profile_id}/quotes/{quote_uuid}', {
                'targetAccount': recipient_account_id
            })
        except Exception:
            # If update fails, continue - quote can still be used
            pass
        
        # Step 4: Create transfer (v1 API)
        transfer_data = {
            'targetAccount': recipient_account_id,
            'quoteUuid': quote_uuid,
            'customerTransactionId': reference,
            'details': {
                'reference': reference
            }
        }
        
        # Add conditionally required fields
        if recipient.get('purpose'):
            transfer_data['details']['transferPurpose'] = recipient['purpose']
        if recipient.get('source_of_funds'):
            transfer_data['details']['sourceOfFunds'] = recipient['source_of_funds']
        
        transfer = self._make_request('POST', '/v1/transfers', transfer_data)
        
        # Get source and target amounts from quote
        # When using targetAmount, quote will calculate sourceAmount
        # When using sourceAmount, quote will calculate targetAmount
        source_amount = quote.get('sourceAmount')
        target_amount = quote.get('targetAmount')
        
        # If amounts not in quote, try to get from payment options
        if not source_amount or not target_amount:
            payment_options = quote.get('paymentOptions', [])
            if payment_options:
                first_option = payment_options[0]
                if not source_amount:
                    source_amount = first_option.get('sourceAmount')
                if not target_amount:
                    target_amount = first_option.get('targetAmount')
        
        # Fallback to transfer values or provided amount
        if not source_amount:
            source_amount = transfer.get('sourceValue') or amount
        if not target_amount:
            target_amount = transfer.get('targetValue')
        
        return {
            'transfer_id': str(transfer['id']),
            'quote_uuid': quote_uuid,
            'recipient_account_id': recipient_account_id,
            'status': transfer.get('status'),
            'reference': reference,
            'amount': source_amount,  # Amount customer needs to send (source)
            'source_amount': source_amount,
            'currency': currency,
            'target_currency': target_currency,
            'target_amount': target_amount or quote.get('targetAmount'),
            'rate': quote.get('rate'),
            'fee': self._calculate_fee(quote),
            'recipient': recipient['name'],
            'provider': 'WISE',
            'payinSessionId': transfer.get('payinSessionId')
        }
    
    def _get_recipient_type(self, currency: str, country: str) -> str:
        """Determine recipient account type based on currency"""
        currency_type_map = {
            'GBP': 'sort_code',
            'EUR': 'iban',
            'USD': 'aba',
            'CAD': 'canadian',
            'AUD': 'bsb',
            'NZD': 'account_number',
            'SGD': 'account_number',
            'HKD': 'account_number',
            'JPY': 'account_number',
            'CNY': 'account_number',
            'INR': 'ifsc',
            'BRL': 'account_number',
            'MXN': 'clabe',
            'ZAR': 'account_number',
            'NGN': 'account_number',
            'KES': 'account_number',
            'UGX': 'account_number',
            'RWF': 'account_number',
            'TZS': 'account_number'
        }
        
        # Check for IBAN currencies
        iban_currencies = ['EUR', 'BGN', 'CHF', 'DKK', 'GEL', 'GBP', 'NOK', 'PKR', 'PLN', 'RON', 'SEK']
        if currency in iban_currencies:
            return 'iban'
        
        return currency_type_map.get(currency, 'account_number')
    
    def _calculate_fee(self, quote: Dict) -> float:
        """Calculate total fee from quote"""
        payment_options = quote.get('paymentOptions', [])
        if payment_options:
            # Get the first payment option fee
            fee_info = payment_options[0].get('fee', {})
            return fee_info.get('total', 0.0)
        return 0.0
    
    def get_transfer_status(self, transfer_id: str) -> Dict:
        """Get status of a Wise transfer"""
        transfer = self._make_request('GET', f'/v1/transfers/{transfer_id}')
        return {
            'transfer_id': transfer_id,
            'status': transfer.get('status'),
            'amount': transfer.get('sourceValue'),
            'currency': transfer.get('sourceCurrency'),
            'recipient_amount': transfer.get('targetValue'),
            'recipient_currency': transfer.get('targetCurrency'),
            'rate': transfer.get('rate'),
            'fee': transfer.get('totalFees'),
            'created_at': transfer.get('created'),
            'updated_at': transfer.get('updated')
        }
    
    def get_balance(self, currency: Optional[str] = None) -> Dict:
        """Get Wise account balance"""
        profiles = self._make_request('GET', '/v1/profiles')
        if not profiles:
            raise Exception("No Wise profiles found")
        profile_id = profiles[0]['id']
        
        endpoint = f'/v3/profiles/{profile_id}/balances'
        if currency:
            endpoint += f'?currency={currency}'
        
        balances = self._make_request('GET', endpoint)
        return {
            'profile_id': profile_id,
            'balances': balances,
            'currency': currency
        }
    
    def validate_recipient(self, recipient: Dict) -> bool:
        """Validate recipient details for Wise transfer"""
        required_fields = ['name', 'account_number', 'country']
        return all(field in recipient for field in required_fields)
    
    def get_supported_currencies(self) -> List[str]:
        """Get list of supported currencies for transfers"""
        # Common currencies supported by Wise
        return ['USD', 'EUR', 'GBP', 'KES', 'UGX', 'RWF', 'ZAR', 'TZS', 'AED', 'INR', 'CNY']
    
    def get_exchange_rate(self, source_currency: str, target_currency: str, amount: Optional[float] = None) -> Dict:
        """Get current exchange rate"""
        profile_id = self._get_profile_id()
        source_amount = amount if amount else 1.0
        
        quote_data = {
            'sourceCurrency': source_currency,
            'targetCurrency': target_currency,
            'sourceAmount': source_amount
        }
        quote = self._make_request('POST', f'/v3/profiles/{profile_id}/quotes', quote_data)
        
        # Calculate fee from payment options
        fee = self._calculate_fee(quote)
        
        return {
            'source_currency': source_currency,
            'target_currency': target_currency,
            'rate': quote.get('rate'),
            'fee': fee,
            'source_amount': quote.get('sourceAmount'),
            'target_amount': quote.get('targetAmount')
        }
    
    def get_funding_instructions(self, transfer_id: str) -> Dict:
        """
        Get bank account details for funding a transfer externally
        
        This provides the bank account details where the customer should send money
        to fund the transfer. The payment reference must include the transfer ID
        prefixed with 'T' (e.g., T80106743)
        
        Args:
            transfer_id: The Wise transfer ID
            
        Returns:
            Bank account details and payment instructions
        """
        try:
            # Get transfer details
            transfer = self._make_request('GET', f'/v1/transfers/{transfer_id}')
            
            # Get bank account details for funding
            # Wise provides this in the transfer object or via separate endpoint
            # The exact endpoint may vary, but typically it's in the transfer response
            
            # Extract funding details from transfer
            source_currency = transfer.get('sourceCurrency')
            source_value = transfer.get('sourceValue')
            
            # Get bank account details for the source currency
            # This might require a separate API call depending on Wise's API structure
            # For now, we'll return the transfer details with payment reference format
            
            return {
                'transfer_id': transfer_id,
                'payment_reference': f"T{transfer_id}",  # Must include 'T' prefix
                'amount': source_value,
                'currency': source_currency,
                'status': transfer.get('status'),
                'instructions': f"Send {source_value} {source_currency} to Wise's bank account with reference: T{transfer_id}",
                'note': "Include the transfer ID prefixed with 'T' in the payment reference field when sending money"
            }
        except Exception as e:
            raise Exception(f"Failed to get funding instructions: {str(e)}")
    
    def get_bank_account_details(self, transfer_id: str) -> Dict:
        """
        Get Wise's bank account details for funding a specific transfer
        
        This endpoint provides the actual bank account number, routing number,
        SWIFT code, etc. that the customer should use to send money
        
        Args:
            transfer_id: The Wise transfer ID
            
        Returns:
            Bank account details for funding
        """
        try:
            # Get transfer details
            transfer = self._make_request('GET', f'/v1/transfers/{transfer_id}')
            
            # Get funding account details
            # Note: This endpoint may vary - check Wise docs for correct endpoint
            try:
                funding_details = self._make_request('GET', f'/v1/transfers/{transfer_id}/funding')
            except Exception:
                # If funding endpoint doesn't exist, try alternative approach
                # Check transfer for payinSessionId which may contain funding info
                payin_session_id = transfer.get('payinSessionId')
                if payin_session_id:
                    # Some Wise implementations provide funding via payin session
                    funding_details = {}
                else:
                    funding_details = {}
            
            return {
                'transfer_id': transfer_id,
                'payment_reference': f"T{transfer_id}",
                'bank_account': funding_details.get('account'),
                'bank_name': funding_details.get('bankName'),
                'account_number': funding_details.get('accountNumber'),
                'routing_number': funding_details.get('routingNumber'),
                'swift_code': funding_details.get('swiftCode'),
                'iban': funding_details.get('iban'),
                'bank_address': funding_details.get('bankAddress'),
                'amount': transfer.get('sourceValue'),
                'currency': transfer.get('sourceCurrency'),
                'instructions': funding_details.get('instructions', []),
                'important_note': f"CRITICAL: Include 'T{transfer_id}' in the payment reference field",
                'payinSessionId': transfer.get('payinSessionId')
            }
        except Exception as e:
            # If funding endpoint doesn't exist, return basic instructions
            transfer = self._make_request('GET', f'/v1/transfers/{transfer_id}')
            return {
                'transfer_id': transfer_id,
                'payment_reference': f"T{transfer_id}",
                'amount': transfer.get('sourceValue'),
                'currency': transfer.get('sourceCurrency'),
                'status': transfer.get('status'),
                'instructions': f"Contact Wise support or check Wise dashboard for bank account details. Use reference: T{transfer_id}",
                'note': "Bank account details may need to be retrieved from Wise dashboard or via separate API endpoint",
                'payinSessionId': transfer.get('payinSessionId')
            }
    
    def fund_transfer_from_balance(self, transfer_id: str, profile_id: Optional[int] = None) -> Dict:
        """
        Fund a transfer from Wise balance
        
        Args:
            transfer_id: The Wise transfer ID
            profile_id: Optional profile ID (will fetch if not provided)
            
        Returns:
            Funding result with status
        """
        if not profile_id:
            profile_id = self._get_profile_id()
        
        try:
            payment_data = {
                'type': 'BALANCE'
            }
            result = self._make_request('POST', f'/v3/profiles/{profile_id}/transfers/{transfer_id}/payments', payment_data)
            return {
                'status': result.get('status'),
                'type': result.get('type'),
                'error_code': result.get('errorCode'),
                'success': result.get('status') == 'COMPLETED'
            }
        except Exception as e:
            return {
                'status': 'REJECTED',
                'error': str(e),
                'success': False
            }

