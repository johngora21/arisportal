"""
ClickPesa Fee Calculation Service
Calculates fees based on ClickPesa's fee structure for different payment methods.
"""
from typing import Dict, Optional
from enum import Enum


class PaymentMethod(str, Enum):
    """Payment method types"""
    MOBILE_MONEY_BILLPAY = "mobile_money_billpay"  # M-Pesa, Airtel Money, Tigo Pesa, HaloPesa BillPay
    CRDB_BILLPAY = "crdb_billpay"  # CRDB Sim Banking, Internet Banking, Wakala, Branch
    MOBILE_MONEY_USSD = "mobile_money_ussd"  # USSD push payments
    CARD = "card"  # Mastercard/Visa/UnionPay
    MOBILE_MONEY_PAYOUT = "mobile_money_payout"  # Payouts to mobile money
    BANK_EFT_ACH = "bank_eft_ach"  # Bank EFT/ACH payouts
    BANK_TISS_TZS = "bank_tiss_tzs"  # Bank TISS payouts (TZS)
    BANK_TISS_USD = "bank_tiss_usd"  # Bank TISS payouts (USD)


# Mobile Money USSD Fee Structure (charged to customer)
MOBILE_MONEY_USSD_FEES = [
    (500, 999, 54),
    (1000, 1999, 92),
    (2000, 2999, 124),
    (3000, 3999, 230),
    (4000, 4999, 380),
    (5000, 9999, 580),
    (10000, 19999, 920),
    (20000, 39999, 1150),
    (40000, 49999, 1572),
    (50000, 99999, 2136),
    (100000, 199999, 3240),
    (200000, 299999, 3660),
    (300000, 399999, 4080),
    (400000, 499999, 4340),
    (500000, 599999, 4820),
    (600000, 799999, 5230),
    (800000, 999999, 6146),
    (1000000, 1999999, 7210),
    (2000000, 3000000, 7960),
]

# Mobile Money Payout Fee Structure
MOBILE_MONEY_PAYOUT_FEES = [
    (100, 999, 52),
    (1000, 1999, 72),
    (2000, 2999, 104),
    (3000, 3999, 116),
    (4000, 4999, 168),
    (5000, 6999, 234),
    (7000, 7999, 360),
    (8000, 9999, 430),
    (10000, 14999, 642),
    (15000, 19999, 680),
    (20000, 29999, 700),
    (30000, 39999, 980),
    (40000, 49999, 1038),
    (50000, 99999, 1460),
    (100000, 199999, 1868),
    (200000, 299999, 2220),
    (300000, 399999, 3180),
    (400000, 499999, 3764),
    (500000, 599999, 4672),
    (600000, 699999, 5712),
    (700000, 799999, 6560),
    (800000, 899999, 7800),
    (900000, 1000000, 8508),
    (1000001, 3000000, 9346),
    (3000001, 5000000, 9890),
]


def calculate_mobile_money_ussd_fee(amount: float) -> float:
    """Calculate Mobile Money USSD fee based on amount tier"""
    for min_amount, max_amount, fee in MOBILE_MONEY_USSD_FEES:
        if min_amount <= amount <= max_amount:
            return float(fee)
    # If amount exceeds max, use the highest fee
    return float(MOBILE_MONEY_USSD_FEES[-1][2])


def calculate_mobile_money_payout_fee(amount: float) -> float:
    """Calculate Mobile Money Payout fee based on amount tier"""
    for min_amount, max_amount, fee in MOBILE_MONEY_PAYOUT_FEES:
        if min_amount <= amount <= max_amount:
            return float(fee)
    # If amount exceeds max, use the highest fee
    return float(MOBILE_MONEY_PAYOUT_FEES[-1][2])


def calculate_clickpesa_fee(
    amount: float,
    payment_method: PaymentMethod,
    currency: str = "TZS"
) -> Dict[str, float]:
    """
    Calculate ClickPesa fee for a given amount and payment method.
    
    Args:
        amount: Transaction amount
        payment_method: Type of payment method
        currency: Currency code (TZS or USD)
    
    Returns:
        Dictionary with:
        - 'clickpesa_fee': The ClickPesa fee
        - 'platform_fee': 1% platform fee (on base amount)
        - 'total_fee': Sum of ClickPesa fee + platform fee
        - 'total_amount': Base amount + total fees
    """
    clickpesa_fee = 0.0
    
    if payment_method == PaymentMethod.MOBILE_MONEY_BILLPAY:
        # 1% fee, min 500, max 5,000,000
        if 500 <= amount <= 5000000:
            clickpesa_fee = amount * 0.01
        elif amount < 500:
            clickpesa_fee = 0  # Below minimum
        else:
            clickpesa_fee = 5000000 * 0.01  # Max fee at max amount
    
    elif payment_method == PaymentMethod.CRDB_BILLPAY:
        # 1% fee, min 1000, max 100,000,000
        if 1000 <= amount <= 100000000:
            clickpesa_fee = amount * 0.01
        elif amount < 1000:
            clickpesa_fee = 0  # Below minimum
        else:
            clickpesa_fee = 100000000 * 0.01  # Max fee at max amount
    
    elif payment_method == PaymentMethod.MOBILE_MONEY_USSD:
        # Tiered fee structure
        clickpesa_fee = calculate_mobile_money_ussd_fee(amount)
    
    elif payment_method == PaymentMethod.CARD:
        # 4.85% of amount
        clickpesa_fee = amount * 0.0485
    
    elif payment_method == PaymentMethod.MOBILE_MONEY_PAYOUT:
        # Tiered fee structure
        clickpesa_fee = calculate_mobile_money_payout_fee(amount)
    
    elif payment_method == PaymentMethod.BANK_EFT_ACH:
        # Flat fee: 2360 TZS
        clickpesa_fee = 2360.0
    
    elif payment_method == PaymentMethod.BANK_TISS_TZS:
        # Flat fee: 10,000 TZS
        if currency == "TZS":
            clickpesa_fee = 10000.0
        else:
            clickpesa_fee = 0
    
    elif payment_method == PaymentMethod.BANK_TISS_USD:
        # Flat fee: 7.5 USD
        if currency == "USD":
            clickpesa_fee = 7.5
        else:
            clickpesa_fee = 0
    
    # Calculate 1% platform fee on base amount
    platform_fee = amount * 0.01
    
    # Total fees
    total_fee = clickpesa_fee + platform_fee
    
    # Total amount (base + fees)
    total_amount = amount + total_fee
    
    return {
        'clickpesa_fee': round(clickpesa_fee, 2),
        'platform_fee': round(platform_fee, 2),
        'total_fee': round(total_fee, 2),
        'total_amount': round(total_amount, 2),
        'base_amount': round(amount, 2)
    }


def calculate_bulk_payout_fees(
    amounts: list[float],
    payment_method: PaymentMethod,
    currency: str = "TZS"
) -> Dict[str, float]:
    """
    Calculate total fees for multiple payouts.
    
    Args:
        amounts: List of payout amounts
        payment_method: Type of payment method
        currency: Currency code
    
    Returns:
        Dictionary with total fees breakdown
    """
    total_clickpesa_fees = 0.0
    total_base_amount = sum(amounts)
    
    # Calculate fee for each payout
    for amount in amounts:
        fee_result = calculate_clickpesa_fee(amount, payment_method, currency)
        total_clickpesa_fees += fee_result['clickpesa_fee']
    
    # Platform fee is 1% of total base amount
    total_platform_fee = total_base_amount * 0.01
    
    # Total fees
    total_fees = total_clickpesa_fees + total_platform_fee
    
    # Total amount (base + fees)
    total_amount = total_base_amount + total_fees
    
    return {
        'num_payouts': len(amounts),
        'total_base_amount': round(total_base_amount, 2),
        'total_clickpesa_fees': round(total_clickpesa_fees, 2),
        'total_platform_fee': round(total_platform_fee, 2),
        'total_fees': round(total_fees, 2),
        'total_amount': round(total_amount, 2)
    }

