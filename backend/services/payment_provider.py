"""
Payment Provider Abstraction
Provides a unified interface for multiple payment providers (ClickPesa, Wise, etc.)
"""
from abc import ABC, abstractmethod
from typing import Dict, Optional, List
from enum import Enum

class PaymentProvider(str, Enum):
    """Supported payment providers"""
    CLICKPESA = "CLICKPESA"  # Local Tanzania payments
    WISE = "WISE"  # International remittances

class PaymentProviderInterface(ABC):
    """Abstract base class for payment providers"""
    
    @abstractmethod
    def create_transfer(self, amount: float, currency: str, recipient: Dict, reference: str) -> Dict:
        """Create a payment/transfer"""
        pass
    
    @abstractmethod
    def get_transfer_status(self, transfer_id: str) -> Dict:
        """Get status of a transfer"""
        pass
    
    @abstractmethod
    def get_balance(self, currency: Optional[str] = None) -> Dict:
        """Get account balance"""
        pass
    
    @abstractmethod
    def validate_recipient(self, recipient: Dict) -> bool:
        """Validate recipient details"""
        pass

