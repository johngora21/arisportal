"""
ClickPesa Service Wrapper
Wraps ClickPesa API calls in the PaymentProviderInterface
"""
from typing import Dict, Optional
from services.payment_provider import PaymentProviderInterface
from routers.clickpesa import get_clickpesa_token
import httpx
import time

# ClickPesa bank metadata (BIC codes and defaults)
BANKS_METADATA = {
    "crdb": {"bic": "CORUTZTZ", "name": "CRDB Bank", "transfer_type": "ACH"},
    "nmb": {"bic": "NMBBTZTZ", "name": "NMB Bank", "transfer_type": "ACH"},
    "equity": {"bic": "EQBLTZTZ", "name": "Equity Bank Tanzania", "transfer_type": "ACH"},
    "absa": {"bic": "BARCTZTZ", "name": "Absa Bank Tanzania", "transfer_type": "ACH"},
    "stanbic": {"bic": "SBICTZTX", "name": "Stanbic Bank Tanzania", "transfer_type": "ACH"},
    "exim": {"bic": "EXIMTZTZ", "name": "Exim Bank Tanzania", "transfer_type": "ACH"},
    "diamond": {"bic": "DTKETZTZ", "name": "Diamond Trust Bank", "transfer_type": "ACH"},
    "kcb": {"bic": "KCBLTZTZ", "name": "KCB Bank Tanzania", "transfer_type": "ACH"},
    "national": {"bic": "NCBKTZTZ", "name": "National Bank of Commerce", "transfer_type": "ACH"},
    "barclays": {"bic": "BARCTZTZ", "name": "Barclays Bank Tanzania", "transfer_type": "ACH"},
}

MNO_CHANNEL_MAP = {
    'vodacom': 'MPESA_TZ',
    'airtel': 'AIRTEL_TZ',
    'tigo': 'TIGO_TZ',
    'halotel': 'HALOPESA_TZ',
    'ttcl': 'TTCL_TZ',
}


class ClickPesaService(PaymentProviderInterface):
    """ClickPesa API wrapper for local Tanzania payments"""

    BANKS_METADATA = BANKS_METADATA
    MNO_CHANNEL_MAP = MNO_CHANNEL_MAP

    def __init__(self):
        self.base_url = "https://api.clickpesa.com"

    @staticmethod
    def normalize_msisdn(phone_number: str) -> str:
        """Normalise Tanzanian MSISDN to 255XXXXXXXXX format."""
        if not phone_number:
            raise ValueError("Phone number is required")

        formatted = phone_number.strip().replace('+', '').replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
        if formatted.startswith('255') and len(formatted) >= 12:
            return formatted
        if formatted.startswith('0') and len(formatted) >= 10:
            return '255' + formatted[1:]
        if formatted.isdigit() and len(formatted) == 9:
            return '255' + formatted
        if formatted.isdigit() and len(formatted) == 12:
            return formatted
        raise ValueError(f"Invalid Tanzanian phone number format: {phone_number}")

    @staticmethod
    def normalize_bank_key(bank_key: str) -> str:
        if not bank_key:
            raise ValueError("Bank key is required")
        normalized = bank_key.strip().lower()
        if normalized not in BANKS_METADATA:
            raise ValueError(f"Unsupported bank '{bank_key}'. Supported values: {', '.join(BANKS_METADATA.keys())}")
        return normalized

    def create_transfer(self, amount: float, currency: str, recipient: Dict, reference: str) -> Dict:
        """
        Create a payment via ClickPesa BillPay
        
        Args:
            amount: Payment amount
            currency: Currency (TZS for Tanzania)
            recipient: Recipient details {
                'name': str,
                'phone': str,
                'email': Optional[str]
            }
            reference: Transaction reference
            
        Returns:
            Payment details including control number
        """
        try:
            print(f"⏱️ [ClickPesa] Starting token request at {time.time()}")
            token = get_clickpesa_token()
            print(f"⏱️ [ClickPesa] Token received at {time.time()}")
            
            billpay_request = {
                "customerName": recipient.get('name'),
                "billDescription": recipient.get('description', 'Payment'),
                "billPaymentMode": "ALLOW_PARTIAL_AND_OVER_PAYMENT",
                "billAmount": amount,
                "billReference": reference
            }
            
            if recipient.get('phone'):
                billpay_request["customerPhone"] = recipient['phone']
            if recipient.get('email'):
                billpay_request["customerEmail"] = recipient['email']
            
            # ClickPesa API uses the token directly (no Bearer prefix based on other usage in codebase)
            print(f"🔐 Calling ClickPesa API: {self.base_url}/third-parties/billpay/create-customer-control-number")
            print(f"📋 Request payload: {billpay_request}")
            print(f"🔑 Using token: {token[:20]}..." if token else "❌ No token!")
            print(f"⏱️ [ClickPesa] Starting API call at {time.time()}")
            
            try:
                response = httpx.post(
                    f"{self.base_url}/third-parties/billpay/create-customer-control-number",
                    headers={
                        'Authorization': token,  # ClickPesa uses token directly, not Bearer token
                        'Content-Type': 'application/json'
                    },
                    json=billpay_request,
                    timeout=15.0  # 15 second timeout - fail fast if ClickPesa is slow
                )
                print(f"⏱️ [ClickPesa] API call completed at {time.time()}")
            except httpx.TimeoutException as timeout_error:
                print(f"❌ [ClickPesa] API call TIMED OUT after 15 seconds")
                raise Exception(f"ClickPesa API request timed out after 15 seconds. The API may be slow or unavailable. Please try again later.")
            except httpx.ConnectError as connect_error:
                print(f"❌ [ClickPesa] Connection error: {connect_error}")
                raise Exception(f"Failed to connect to ClickPesa API. Please check your internet connection and try again.")
            except httpx.RequestError as request_error:
                print(f"❌ [ClickPesa] Request error: {request_error}")
                raise Exception(f"ClickPesa API request failed: {str(request_error)}")
            
            # Log response status and body for debugging
            print(f"📡 ClickPesa API Response Status: {response.status_code}")
            print(f"📡 ClickPesa API Response Headers: {dict(response.headers)}")
            
            try:
                response.raise_for_status()
                billpay_response = response.json()
                print(f"📦 ClickPesa API Response Body: {billpay_response}")
            except httpx.HTTPStatusError as e:
                # Try to get error details from response
                error_body = {}
                try:
                    error_body = e.response.json()
                except:
                    error_body = {'text': e.response.text}
                
                error_msg = f"ClickPesa API returned {e.response.status_code}: {error_body}"
                print(f"❌ {error_msg}")
                raise Exception(error_msg)
            
            # Extract control number from response - check various possible field names
            # IMPORTANT: Print the FULL response to see what ClickPesa actually returns
            print(f"🔍 FULL ClickPesa Response Keys: {list(billpay_response.keys())}")
            print(f"🔍 FULL ClickPesa Response: {billpay_response}")
            
            control_number = (
                billpay_response.get('billPayNumber') or
                billpay_response.get('controlNumber') or
                billpay_response.get('billPayControlNumber') or
                billpay_response.get('control_number') or
                billpay_response.get('orderControlNumber') or
                billpay_response.get('data', {}).get('billPayNumber') or
                billpay_response.get('data', {}).get('controlNumber') or
                billpay_response.get('data', {}).get('control_number') or
                billpay_response.get('result', {}).get('billPayNumber') or
                billpay_response.get('result', {}).get('controlNumber') or
                billpay_response.get('response', {}).get('billPayNumber')
            )
            
            if not control_number:
                error_msg = f"ClickPesa API response did not contain a control number. Full response: {billpay_response}"
                print(f"❌ {error_msg}")
                print(f"❌ Available keys in response: {list(billpay_response.keys())}")
                raise Exception(error_msg)
            
            print(f"✅ ClickPesa control number extracted: {control_number}")
            
            return {
                'transfer_id': control_number,
                'status': 'pending',
                'reference': reference,
                'amount': amount,
                'currency': currency,
                'recipient': recipient.get('name'),
                'provider': 'CLICKPESA',
                'control_number': control_number,
                'billPayNumber': control_number  # Also include this for backward compatibility
            }
        except Exception as e:
            error_msg = f"ClickPesa API error: {str(e)}"
            print(f"❌ {error_msg}")
            raise Exception(error_msg)
    
    def initiate_ussd_push(self, amount: float, currency: str, phone_number: str, order_reference: str, checksum: Optional[str] = None) -> Dict:
        """
        Initiate a USSD push payment request via ClickPesa.
        This sends a payment request directly to the customer's phone.
        
        Args:
            amount: Payment amount
            currency: Currency (TZS for Tanzania)
            phone_number: Customer phone number (format: 255712345678, no + sign)
            order_reference: Unique order reference
            checksum: Optional checksum for security
            
        Returns:
            USSD push transaction details including id and status
        """
        try:
            token = get_clickpesa_token()
            
            payload = {
                "amount": str(amount),
                "currency": currency,
                "orderReference": order_reference,
                "phoneNumber": phone_number
            }
            
            if checksum:
                payload["checksum"] = checksum
            
            response = httpx.post(
                f"{self.base_url}/third-parties/payments/initiate-ussd-push-request",
                headers={
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=10.0
            )
            response.raise_for_status()
            ussd_response = response.json()
            
            return {
                'id': ussd_response.get('id'),
                'status': ussd_response.get('status', 'PROCESSING'),
                'channel': ussd_response.get('channel'),
                'order_reference': ussd_response.get('orderReference'),
                'collected_amount': ussd_response.get('collectedAmount'),
                'collected_currency': ussd_response.get('collectedCurrency'),
                'created_at': ussd_response.get('createdAt'),
                'provider': 'CLICKPESA',
                'type': 'USSD_PUSH'
            }
        except Exception as e:
            raise Exception(f"ClickPesa USSD push error: {str(e)}")
    
    def preview_ussd_push(self, amount: float, currency: str, phone_number: str, order_reference: str, fetch_sender_details: bool = False, checksum: Optional[str] = None) -> Dict:
        """
        Preview USSD push payment request to see available payment methods.
        
        Args:
            amount: Payment amount
            currency: Currency (TZS for Tanzania)
            phone_number: Customer phone number (format: 255712345678, no + sign)
            order_reference: Unique order reference
            fetch_sender_details: If true, fetch sender details
            checksum: Optional checksum for security
            
        Returns:
            Preview response with available payment methods
        """
        try:
            token = get_clickpesa_token()
            
            payload = {
                "amount": str(amount),
                "currency": currency,
                "orderReference": order_reference,
                "phoneNumber": phone_number,
                "fetchSenderDetails": fetch_sender_details
            }
            
            if checksum:
                payload["checksum"] = checksum
            
            response = httpx.post(
                f"{self.base_url}/third-parties/payments/preview-ussd-push-request",
                headers={
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise Exception(f"ClickPesa USSD push preview error: {str(e)}")
    
    def initiate_card_payment(self, amount: float, currency: str, order_reference: str, customer_id: Optional[str] = None, customer_details: Optional[Dict] = None, checksum: Optional[str] = None) -> Dict:
        """
        Initiate a card payment via ClickPesa
        
        Args:
            amount: Payment amount
            currency: Currency (USD or TZS)
            order_reference: Unique order reference
            customer_id: Optional customer ID if customer exists in ClickPesa
            customer_details: Optional customer details if creating new customer
            checksum: Optional checksum for security
            
        Returns:
            Card payment details including payment link
        """
        try:
            token = get_clickpesa_token()
            
            payload = {
                "amount": str(amount),
                "currency": currency,
                "orderReference": order_reference
            }
            
            # Add customer - either ID or details
            if customer_id:
                payload["customer"] = {"id": customer_id}
            elif customer_details:
                payload["customer"] = customer_details
            else:
                # Default customer if none provided
                payload["customer"] = {"id": "default"}
            
            if checksum:
                payload["checksum"] = checksum
            
            response = httpx.post(
                f"{self.base_url}/third-parties/payments/initiate-card-payment",
                headers={
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            card_response = response.json()
            
            return {
                'card_payment_link': card_response.get('cardPaymentLink'),
                'client_id': card_response.get('clientId'),
                'order_reference': order_reference,
                'amount': amount,
                'currency': currency,
                'provider': 'CLICKPESA',
                'type': 'CARD_PAYMENT'
            }
        except Exception as e:
            raise Exception(f"ClickPesa card payment error: {str(e)}")
    
    def preview_card_payment(self, amount: float, currency: str, order_reference: str, checksum: Optional[str] = None) -> Dict:
        """
        Preview card payment to see available payment methods
        
        Args:
            amount: Payment amount
            currency: Currency (USD or TZS)
            order_reference: Unique order reference
            checksum: Optional checksum for security
            
        Returns:
            Preview response with available card payment methods
        """
        try:
            token = get_clickpesa_token()
            
            payload = {
                "amount": str(amount),
                "currency": currency,
                "orderReference": order_reference
            }
            
            if checksum:
                payload["checksum"] = checksum
            
            response = httpx.post(
                f"{self.base_url}/third-parties/payments/preview-card-payment",
                headers={
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise Exception(f"ClickPesa card payment preview error: {str(e)}")
    
    def get_transfer_status(self, transfer_id: str) -> Dict:
        """Get status of a ClickPesa transaction"""
        # ClickPesa status is typically handled via webhook
        # This would require querying your database for the transaction
        return {
            'transfer_id': transfer_id,
            'status': 'pending',
            'provider': 'CLICKPESA',
            'note': 'Status is updated via webhook'
        }
    
    def get_balance(self, currency: Optional[str] = None) -> Dict:
        """Get ClickPesa balance (if API supports it)"""
        # ClickPesa may not have a direct balance API
        # This would need to be implemented based on your account structure
        return {
            'currency': currency or 'TZS',
            'balance': 0.0,
            'provider': 'CLICKPESA',
            'note': 'Balance tracking via transactions'
        }
    
    def validate_recipient(self, recipient: Dict) -> bool:
        """Validate recipient details for ClickPesa"""
        required_fields = ['name', 'phone']
        return all(field in recipient for field in required_fields)

    def disburse_mobile_money(self, amount: float, currency: str, *, phone: str, recipient_name: str, mno_id: str, reference: str, description: Optional[str] = None) -> Dict:
        """
        Disburse funds from ClickPesa pool to a Tanzanian mobile wallet.

        Args:
            amount: Amount to send
            currency: Currency code, e.g., 'TZS'
            phone: MSISDN (e.g., 2557XXXXXXXX)
            recipient_name: Recipient display name
            mno_id: One of 'vodacom' | 'airtel' | 'tigo' | 'halotel' | 'ttcl'
            reference: Unique payout reference
            description: Optional description

        Returns: Provider response dict (includes provider reference/status)
        """
        channel = self.MNO_CHANNEL_MAP.get(mno_id)
        if not channel:
            raise Exception(f"Unsupported MNO: {mno_id}")

        token = get_clickpesa_token()
        normalized_phone = self.normalize_msisdn(phone)

        payload = {
            "paymentMode": "MOBILE_MONEY",
            "channel": channel,
            "amount": amount,
            "currency": currency,
            "customerName": recipient_name,
            "customerPhone": normalized_phone,
            "externalReference": reference,
            "description": description or f"Payout to {recipient_name}"
        }

        try:
            print(f"[ClickPesa DISBURSE] POST payload={payload}")
            auth_header = token if isinstance(token, str) and token.lower().startswith('bearer ') else f"Bearer {token}"
            res = httpx.post(
                f"{self.base_url}/third-parties/payments/disbursements",
                headers={
                    'Authorization': auth_header,
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=20.0
            )
            res.raise_for_status()
            try:
                body = res.json()
            except Exception:
                body = {"raw": res.text}
            print(f"[ClickPesa DISBURSE] status_code={res.status_code} body={body}")
            return {
                'status': body.get('status') or 'PROCESSING',
                'provider': 'CLICKPESA',
                'provider_reference': body.get('reference') or body.get('transactionId') or reference,
                'request': payload,
                'response': body
            }
        except httpx.HTTPStatusError as e:
            try:
                err = e.response.json()
            except Exception:
                err = {'message': str(e)}
            print(f"[ClickPesa DISBURSE][ERROR] {err}")
            raise Exception(f"ClickPesa disbursement failed: {err}")

    def create_mobile_money_payout(self, *, amount: float, currency: str, phone_number: str, order_reference: str, checksum: Optional[str] = None) -> Dict:
        """
        Preferred: Create Mobile Money Payout via ClickPesa payouts API.
        Mirrors docs: POST /third-parties/payouts/create-mobile-money-payout
        """
        token = get_clickpesa_token()
        payload = {
            "amount": amount,
            "phoneNumber": self.normalize_msisdn(phone_number),
            "currency": currency,
            "orderReference": order_reference,
        }
        if checksum:
            payload["checksum"] = checksum

        try:
            print(f"[ClickPesa PAYOUT] POST payload={payload}")
            auth_header = token if isinstance(token, str) and token.lower().startswith('bearer ') else f"Bearer {token}"
            res = httpx.post(
                f"{self.base_url}/third-parties/payouts/create-mobile-money-payout",
                headers={
                    'Authorization': auth_header,
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=20.0
            )
            res.raise_for_status()
            try:
                body = res.json()
            except Exception:
                body = {"raw": res.text}
            print(f"[ClickPesa PAYOUT] status_code={res.status_code} body={body}")
            return body
        except httpx.HTTPStatusError as e:
            try:
                err = e.response.json()
            except Exception:
                err = {'message': str(e)}
            print(f"[ClickPesa PAYOUT][ERROR] {err}")
            raise Exception(f"ClickPesa payout failed: {err}")

    def create_bank_payout(
        self,
        *,
        amount: float,
        account_number: str,
        account_name: str,
        currency: str,
        order_reference: str,
        bic: str,
        transfer_type: str = "ACH",
        account_currency: str = "TZS",
        checksum: Optional[str] = None,
    ) -> Dict:
        """
        Create a bank payout via ClickPesa payouts API.
        Mirrors docs: POST /third-parties/payouts/create-bank-payout
        """
        token = get_clickpesa_token()
        payload = {
            "amount": amount,
            "accountNumber": account_number,
            "accountName": account_name,
            "currency": currency,
            "accountCurrency": account_currency,
            "orderReference": order_reference,
            "bic": bic,
            "transferType": transfer_type,
        }
        if checksum:
            payload["checksum"] = checksum

        try:
            print(f"[ClickPesa BANK PAYOUT] POST payload={payload}")
            auth_header = token if isinstance(token, str) and token.lower().startswith('bearer ') else f"Bearer {token}"
            res = httpx.post(
                f"{self.base_url}/third-parties/payouts/create-bank-payout",
                headers={
                    'Authorization': auth_header,
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=20.0
            )
            res.raise_for_status()
            try:
                body = res.json()
            except Exception:
                body = {"raw": res.text}
            print(f"[ClickPesa BANK PAYOUT] status_code={res.status_code} body={body}")
            return body
        except httpx.HTTPStatusError as e:
            try:
                err = e.response.json()
            except Exception:
                err = {'message': str(e)}
            print(f"[ClickPesa BANK PAYOUT][ERROR] {err}")
            raise Exception(f"ClickPesa bank payout failed: {err}")

    def get_mobile_money_payout(self, payout_id: str, *, timeout_seconds: float = 20.0) -> Dict:
        """Fetch payout details by ClickPesa payout ID"""
        token = get_clickpesa_token()
        auth_header = token if isinstance(token, str) and token.lower().startswith('bearer ') else f"Bearer {token}"
        try:
            res = httpx.get(
                f"{self.base_url}/third-parties/payouts/{payout_id}",
                headers={
                    'Authorization': auth_header,
                    'Content-Type': 'application/json'
                },
                timeout=timeout_seconds
            )
            res.raise_for_status()
            try:
                body = res.json()
            except Exception:
                body = {"raw": res.text}
            print(f"[ClickPesa PAYOUT STATUS] status_code={res.status_code} body={body}")
            return body
        except httpx.HTTPStatusError as e:
            try:
                err = e.response.json()
            except Exception:
                err = {'message': str(e)}
            print(f"[ClickPesa PAYOUT STATUS][ERROR] {err}")
            raise Exception(f"ClickPesa payout status failed: {err}")

    def get_banks_list(self) -> Dict:
        """
        Fetch the list of supported banks from ClickPesa.
        Returns list of banks with their BIC codes and other details.
        """
        token = get_clickpesa_token()
        auth_header = token if isinstance(token, str) and token.lower().startswith('bearer ') else f"Bearer {token}"
        try:
            res = httpx.get(
                f"{self.base_url}/third-parties/list/banks",
                headers={
                    'Authorization': auth_header,
                    'Content-Type': 'application/json'
                },
                timeout=20.0
            )
            res.raise_for_status()
            try:
                body = res.json()
            except Exception:
                body = {"raw": res.text}
            print(f"[ClickPesa BANKS] status_code={res.status_code} body={body}")
            return body
        except httpx.HTTPStatusError as e:
            try:
                err = e.response.json()
            except Exception:
                err = {'message': str(e)}
            print(f"[ClickPesa BANKS][ERROR] {err}")
            raise Exception(f"ClickPesa banks list failed: {err}")

    def poll_mobile_money_payout_success(self, payout_id: str, *, max_attempts: int = 5, interval_seconds: float = 2.0) -> Dict:
        """
        Poll ClickPesa payout status endpoint until SUCCESS/REVERSED or attempts exhausted.
        Returns the last payload received.
        """
        last_payload: Dict = {}
        for attempt in range(max_attempts):
            try:
                payload = self.get_mobile_money_payout(payout_id)
                last_payload = payload
                status = (payload.get('status') or "").upper()
                print(f"[ClickPesa PAYOUT POLL] attempt={attempt+1} status={status}")
                if status in ["SUCCESS", "REVERSED"]:
                    return payload
            except Exception as exc:
                print(f"[ClickPesa PAYOUT POLL][WARN] attempt={attempt+1} error={exc}")
                last_payload = {"status": "ERROR", "error": str(exc)}
            time.sleep(interval_seconds)
        return last_payload

    def create_bank_payout(
        self,
        *,
        amount: float,
        currency: str,
        bank_key: str,
        account_number: str,
        account_name: str,
        order_reference: str,
        branch_code: Optional[str] = None,
        description: Optional[str] = None
    ) -> Dict:
        """Create a bank (ACH) payout via ClickPesa."""
        normalized_key = self.normalize_bank_key(bank_key)
        bank_info = self.BANKS_METADATA[normalized_key]
        token = get_clickpesa_token()
        auth_header = token if isinstance(token, str) and token.lower().startswith('bearer ') else f"Bearer {token}"

        payload = {
            "amount": amount,
            "currency": currency,
            "orderReference": order_reference,
            "bankAccountNumber": account_number,
            "bankAccountName": account_name,
            "bankName": bank_info["name"],
            "transferType": bank_info["transfer_type"],
            "swiftCode": bank_info["bic"],
        }
        if branch_code:
            payload["bankBranchCode"] = branch_code
        if description:
            payload["description"] = description

        try:
            print(f"[ClickPesa BANK PAYOUT] POST payload={payload}")
            res = httpx.post(
                f"{self.base_url}/third-parties/payouts/create-bank-payout",
                headers={
                    'Authorization': auth_header,
                    'Content-Type': 'application/json'
                },
                json=payload,
                timeout=20.0
            )
            res.raise_for_status()
            try:
                body = res.json()
            except Exception:
                body = {"raw": res.text}
            print(f"[ClickPesa BANK PAYOUT] status_code={res.status_code} body={body}")
            return body
        except httpx.HTTPStatusError as e:
            try:
                err = e.response.json()
            except Exception:
                err = {'message': str(e)}
            print(f"[ClickPesa BANK PAYOUT][ERROR] {err}")
            raise Exception(f"ClickPesa bank payout failed: {err}")

