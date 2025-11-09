"""
Unified Payment Service
Routes payments to the appropriate provider (ClickPesa or Wise) based on use case
"""
from typing import Dict, Optional
from services.payment_provider import PaymentProvider, PaymentProviderInterface
from services.clickpesa_service import ClickPesaService
from services.wise_service import WiseService

class UnifiedPaymentService:
    """Unified service that routes to appropriate payment provider"""
    
    def __init__(self):
        self.clickpesa = ClickPesaService()
        try:
            self.wise = WiseService()
        except ValueError as e:
            print(f"⚠️ Warning: Wise service not available: {e}")
            self.wise = None
        self._providers = {
            PaymentProvider.CLICKPESA: self.clickpesa,
        }
        if self.wise:
            self._providers[PaymentProvider.WISE] = self.wise
    
    def _select_provider(self, 
                        destination_country: Optional[str] = None,
                        currency: Optional[str] = None,
                        provider: Optional[PaymentProvider] = None) -> PaymentProviderInterface:
        """
        Select appropriate payment provider based on criteria
        
        Args:
            destination_country: Country code (TZ for Tanzania, etc.)
            currency: Currency code
            provider: Explicit provider selection
            
        Returns:
            PaymentProviderInterface instance
        """
        # Explicit provider selection takes precedence
        if provider:
            return self._providers[provider]
        
        # Auto-select based on destination
        # Tanzania = ClickPesa, International = Wise
        if destination_country and destination_country.upper() == 'TZ':
            return self.clickpesa
        
        # Default to Wise for international, ClickPesa for local
        if currency and currency.upper() == 'TZS':
            return self.clickpesa
        
        # Default to Wise for international remittances
        return self.wise
    
    def create_remittance(self,
                         amount: float,
                         currency: str,
                         recipient: Dict,
                         reference: str,
                         destination_country: Optional[str] = None,
                         provider: Optional[PaymentProvider] = None) -> Dict:
        """
        Create a remittance/payment using appropriate provider
        
        Args:
            amount: Payment amount
            currency: Currency code
            recipient: Recipient details
            reference: Transaction reference
            destination_country: Destination country code
            provider: Explicit provider selection (optional)
            
        Returns:
            Transfer details
        """
        # Select provider
        payment_provider = self._select_provider(
            destination_country=destination_country,
            currency=currency,
            provider=provider
        )
        
        # Validate recipient
        if not payment_provider.validate_recipient(recipient):
            raise ValueError("Invalid recipient details")
        
        # Create transfer
        result = payment_provider.create_transfer(
            amount=amount,
            currency=currency,
            recipient=recipient,
            reference=reference
        )
        
        # Add provider info
        result['selected_provider'] = PaymentProvider.CLICKPESA if payment_provider == self.clickpesa else PaymentProvider.WISE
        
        return result
    
    def get_transfer_status(self,
                           transfer_id: str,
                           provider: PaymentProvider) -> Dict:
        """Get transfer status from specified provider"""
        payment_provider = self._providers[provider]
        return payment_provider.get_transfer_status(transfer_id)
    
    def get_balance(self,
                   provider: PaymentProvider,
                   currency: Optional[str] = None) -> Dict:
        """Get balance from specified provider"""
        payment_provider = self._providers[provider]
        return payment_provider.get_balance(currency)
    
    def get_exchange_rate(self,
                         source_currency: str,
                         target_currency: str) -> Dict:
        """Get exchange rate from Wise"""
        return self.wise.get_exchange_rate(source_currency, target_currency)
    
    def get_supported_currencies(self, provider: PaymentProvider) -> list:
        """Get supported currencies for a provider"""
        if provider == PaymentProvider.WISE:
            return self.wise.get_supported_currencies()
        elif provider == PaymentProvider.CLICKPESA:
            return ['TZS']  # ClickPesa primarily supports TZS
        return []

