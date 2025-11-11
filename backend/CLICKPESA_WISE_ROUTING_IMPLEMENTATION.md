# ClickPesa + Wise Routing Implementation

## Overview

This implementation enables customers to send international remittances using a simple control number (familiar to African users) while routing payments to Wise for currency conversion and international transfer.

## Flow

### 1. Remittance Creation

**Endpoint:** `POST /api/v1/remittances/`

**Process:**
1. Customer requests to send money internationally (e.g., $500 USD)
2. System creates Wise transfer with:
   - Source currency: TZS (customer pays in TZS)
   - Target currency: Recipient currency (e.g., USD)
   - Target amount: Amount recipient should receive
3. Wise calculates how much TZS is needed (including fees)
4. System generates ClickPesa BillPay control number for TZS amount
5. Control number is linked to Wise transfer ID in database

**Response includes:**
- `clickpesa_control_number`: Control number for customer to pay
- `clickpesa_billpay_namba`: Merchant number (shared BillPay number)
- `tzs_amount`: Amount in TZS customer needs to pay
- `message`: Instructions for customer

### 2. Customer Payment

**Customer Experience:**
- Receives simple control number (e.g., "12345678")
- Pays via mobile money/bank using control number + merchant number
- Familiar payment process (no transfer IDs, no complexity)

### 3. Payment Routing

**Webhook:** `POST /api/v1/cards/webhook/payment`

**Process:**
1. ClickPesa webhook receives payment notification
2. System identifies if payment is for remittance (by control number)
3. If remittance:
   - Updates remittance status to PROCESSING
   - Routes payment to Wise (see Funding Options below)
4. If card transaction:
   - Credits business card balance (existing flow)

### 4. Wise Transfer Funding

**Current Implementation:**
- Payment is received and remittance status updated
- TODO: Implement actual funding to Wise

**Funding Options:**

#### Option 1: Wise Balance (Recommended)
1. Maintain Wise multi-currency balance
2. When payment received, add TZS to Wise balance
3. Wise automatically converts TZS → Target currency
4. Fund transfer from Wise balance
5. Transfer completes

**Implementation:**
```python
# Add to Wise balance (requires Wise balance API)
wise_service.add_to_balance(amount_tzs, 'TZS')

# Fund transfer from balance
funding_result = wise_service.fund_transfer_from_balance(transfer_id)
```

#### Option 2: Direct Bank Transfer
1. When payment received, get Wise bank account details
2. Send money to Wise's bank account with reference `T{transfer_id}`
3. Wise matches payment to transfer
4. Transfer completes

**Implementation:**
```python
# Get Wise bank account details
bank_details = wise_service.get_bank_account_details(transfer_id)

# Send money to Wise bank account
# Reference must be: T{transfer_id}
# This requires integration with bank transfer API or manual process
```

## Database Schema

### Remittance Model

**Fields:**
- `remittance_id`: Unique remittance ID (REM-XXXXXXXX)
- `provider`: WISE or CLICKPESA
- `provider_transfer_id`: Wise transfer ID
- `provider_control_number`: ClickPesa control number (for Wise remittances)
- `amount`: Source amount (TZS for Wise remittances)
- `currency`: Source currency (TZS)
- `recipient_amount`: Target amount (what recipient receives)
- `recipient_currency`: Target currency
- `status`: PENDING, PROCESSING, COMPLETED, FAILED
- `exchange_rate`: Exchange rate used
- `fee`: Wise fee

## API Endpoints

### Create Remittance

**POST** `/api/v1/remittances/`

**Request:**
```json
{
  "amount": 500,
  "currency": "USD",
  "recipient_name": "John Doe",
  "recipient_account": "1234567890",
  "recipient_country": "US",
  "recipient_currency": "USD",
  "recipient_email": "john@example.com",
  "recipient_phone": "+1234567890",
  "recipient_address": "123 Main St",
  "recipient_city": "New York",
  "recipient_postal_code": "10001",
  "recipient_routing_number": "021000021",
  "purpose": "remittance",
  "source_of_funds": "other"
}
```

**Response (Wise):**
```json
{
  "id": 1,
  "remittance_id": "REM-ABCD1234",
  "provider": "WISE",
  "amount": 1200000,
  "currency": "TZS",
  "recipient_name": "John Doe",
  "recipient_country": "US",
  "status": "PENDING",
  "reference": "REF-REM-ABCD1234",
  "provider_transfer_id": "80106743",
  "clickpesa_control_number": "12345678",
  "clickpesa_billpay_namba": "1234",
  "tzs_amount": 1200000,
  "message": "Pay 1200000 TZS using control number 12345678 and merchant number 1234",
  "created_at": "2024-01-01T12:00:00Z"
}
```

### Get Remittance Status

**GET** `/api/v1/remittances/{remittance_id}`

### Get Exchange Rate

**GET** `/api/v1/remittances/exchange-rate/{source_currency}/{target_currency}`

## Environment Variables

**⚠️ REQUIRED: You MUST set up Wise API credentials before using this integration.**

```env
# Wise API (REQUIRED)
WISE_API_TOKEN=your_wise_api_token  # Get from https://wise.com/user/account/api-tokens
WISE_SANDBOX=true  # Set to false for production
WISE_API_URL=https://api.sandbox.transferwise.tech  # Auto-set if not specified

# ClickPesa API (REQUIRED)
CLICKPESA_API_KEY=your_clickpesa_api_key
CLICKPESA_CLIENT_ID=your_clickpesa_client_id
CLICKPESA_BILLPAY_NAMBA=1234  # Shared merchant number
```

### How to Get Wise API Token

1. Create a Wise business account at [wise.com](https://wise.com)
2. Go to Settings → API tokens: https://wise.com/user/account/api-tokens
3. Create a new token with permissions:
   - Transfers
   - Balances
   - Profiles
4. Copy the token and add to `.env` file

**See `WISE_API_CREDENTIALS_SETUP.md` for detailed instructions.**

## Key Features

1. **Simple Payment Experience**: Customers use familiar control numbers
2. **Automatic Currency Conversion**: Wise handles all currency conversions
3. **Transparent Pricing**: Exchange rate and fees shown upfront
4. **Unified Interface**: Single API for both ClickPesa (domestic) and Wise (international)
5. **Automatic Routing**: Payments automatically routed to appropriate provider

## Next Steps

1. **Implement Wise Balance Funding**: Add funds to Wise balance when payment received
2. **Add Wise Webhook Handler**: Handle Wise transfer status updates
3. **Add Error Handling**: Handle failed payments, refunds, etc.
4. **Add Notifications**: Notify customers of transfer status
5. **Add Admin Dashboard**: Monitor remittances, balances, etc.

## Testing

### Sandbox Testing

1. Use Wise sandbox environment
2. Create test remittances
3. Simulate ClickPesa webhook payments
4. Verify Wise transfer creation and funding

### Production Deployment

1. Obtain Wise production API credentials
2. Set up Wise multi-currency balance
3. Configure webhook URLs
4. Test with small amounts first
5. Monitor transactions closely

## Notes

- Wise handles all currency conversions automatically
- Control numbers are simple and familiar to African users
- Payments are automatically routed to Wise when received
- Transfer IDs are hidden from end users (abstracted by control numbers)
- System maintains audit trail of all transactions

