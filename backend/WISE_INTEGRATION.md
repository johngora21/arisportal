# Wise API Integration Guide

## Overview

This integration allows ArisPortal to support both **ClickPesa** (local Tanzania payments) and **Wise** (international remittances) without conflicts. The system automatically routes payments to the appropriate provider based on destination country and currency.

## Architecture

### Payment Provider Abstraction

The system uses a unified payment service that routes to the appropriate provider:

- **ClickPesa**: Local Tanzania payments (TZS, mobile money, BillPay)
- **Wise**: International remittances (USD, EUR, GBP, etc.)

### Key Components

1. **PaymentProviderInterface** (`services/payment_provider.py`)
   - Abstract base class for all payment providers
   - Defines common methods: `create_transfer()`, `get_transfer_status()`, `get_balance()`, `validate_recipient()`

2. **ClickPesaService** (`services/clickpesa_service.py`)
   - Wraps existing ClickPesa API calls
   - Handles BillPay control numbers and local payments

3. **WiseService** (`services/wise_service.py`)
   - Handles international remittances via Wise API
   - Supports multi-currency transfers, exchange rates, balance queries

4. **UnifiedPaymentService** (`services/unified_payment_service.py`)
   - Routes payments to appropriate provider
   - Auto-selects provider based on destination/country
   - Provides unified interface for both providers

5. **Remittance Model** (`models/remittance.py`)
   - Tracks remittances with provider information
   - Stores both ClickPesa and Wise transaction details

6. **Wise Router** (`routers/wise.py`)
   - REST API endpoints for remittances
   - Handles webhooks from Wise

## How It Works

### Automatic Provider Selection

The system automatically selects the provider based on:

1. **Destination Country**: 
   - Tanzania (TZ) → ClickPesa
   - Other countries → Wise

2. **Currency**:
   - TZS → ClickPesa
   - Other currencies → Wise

3. **Explicit Selection**: You can explicitly specify a provider

### No Conflicts

- **Separate Endpoints**: 
  - ClickPesa: `/api/v1/cards/*` (existing)
  - Wise: `/api/v1/remittances/*` (new)

- **Separate Models**:
  - ClickPesa: `CardTransaction` model
  - Wise: `Remittance` model

- **Separate Services**: Each provider has its own service class

- **Unified Interface**: Both providers implement the same interface, but are used for different purposes

## Setup

### 1. Environment Variables

Add to your `.env` file:

```env
# Wise API Configuration
WISE_API_TOKEN=your_wise_api_token
WISE_API_URL=https://api.wise.com
WISE_SANDBOX=true  # Set to false for production

# ClickPesa (already configured)
CLICKPESA_API_KEY=your_clickpesa_api_key
CLICKPESA_CLIENT_ID=your_clickpesa_client_id
```

### 2. Database Migration

The `Remittance` model will be automatically created when you start the server (SQLAlchemy auto-create).

### 3. Wise API Setup

1. Create a Wise Business account
2. Generate API token from Wise Dashboard
3. Start with sandbox mode for testing
4. Switch to production when ready

## Usage

### Create a Remittance

```bash
POST /api/v1/remittances/
Content-Type: application/json

{
  "amount": 1000.00,
  "currency": "USD",
  "recipient_name": "John Doe",
  "recipient_account": "1234567890",
  "recipient_country": "US",
  "recipient_currency": "USD",
  "recipient_email": "john@example.com",
  "recipient_iban": "GB82WEST12345698765432",
  "recipient_swift": "WESTGB22",
  "reference": "REF-12345",
  "purpose": "remittance"
}
```

### Get Remittance Status

```bash
GET /api/v1/remittances/{remittance_id}
```

### Get Exchange Rate

```bash
GET /api/v1/remittances/exchange-rate/USD/KES
```

### Get Supported Currencies

```bash
GET /api/v1/remittances/currencies/WISE
GET /api/v1/remittances/currencies/CLICKPESA
```

## Provider Selection Examples

### Example 1: International Remittance (Wise)
```json
{
  "amount": 1000,
  "currency": "USD",
  "recipient_country": "US",
  "recipient_account": "1234567890"
}
```
→ **Automatically uses Wise**

### Example 2: Local Tanzania Payment (ClickPesa)
```json
{
  "amount": 50000,
  "currency": "TZS",
  "recipient_country": "TZ",
  "recipient_phone": "+255712345678"
}
```
→ **Automatically uses ClickPesa**

### Example 3: Explicit Provider Selection
```json
{
  "amount": 1000,
  "currency": "USD",
  "recipient_country": "KE",
  "provider": "WISE"
}
```
→ **Uses Wise explicitly**

## Webhooks

### Wise Webhook

Wise will send status updates to:
```
POST /api/v1/remittances/webhook/wise
```

Configure this URL in your Wise dashboard under Webhooks.

### ClickPesa Webhook

ClickPesa webhooks continue to work as before:
```
POST /api/v1/cards/webhook/payment
```

## Benefits

1. **No Conflicts**: Separate endpoints, models, and services
2. **Automatic Routing**: System selects the right provider automatically
3. **Unified Interface**: Same API pattern for both providers
4. **Flexible**: Can explicitly select provider if needed
5. **Extensible**: Easy to add more payment providers in the future

## Testing

1. **Sandbox Mode**: Start with `WISE_SANDBOX=true`
2. **Test Remittances**: Create test remittances via API
3. **Check Status**: Verify status updates via webhooks
4. **Production**: Switch to production when ready

## Error Handling

- Invalid recipient details → 400 Bad Request
- Provider API errors → 500 Internal Server Error
- Invalid provider selection → 400 Bad Request
- Missing credentials → 500 Internal Server Error

## Future Enhancements

- Add more payment providers (Stripe, PayPal, etc.)
- Add provider failover mechanism
- Add transaction reconciliation
- Add multi-currency wallet support
- Add provider cost comparison

