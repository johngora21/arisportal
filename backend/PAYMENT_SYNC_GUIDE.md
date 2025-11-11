# Payment Sync Guide

## Current Status

✅ **Card Ledger System**: Implemented
✅ **Webhook Endpoint**: `/api/v1/cards/webhook/payment`
✅ **Sync Endpoint**: `/api/v1/cards/sync-payments`
✅ **Manual Entry Endpoint**: `/api/v1/cards/manual-payment-entry`

## Your Cards

Based on database check:
- **Card 6 (Matterverse)**: Control Number: `927273358943`
- **Card 5 (School Fees)**: Control Number: `927261962838`
- **Card 4 (Home Bills)**: Control Number: `927249175170`
- **Card 3 (Jason Debris)**: Control Number: `927176378192`
- **Card 2 (My Shop)**: Control Number: `CARD90323607...`

## How to Sync Payments

### Option 1: Use Frontend "Sync Payments" Button (Recommended)

1. Go to the Cards page in the frontend
2. Click the **"Sync Payments"** button (green button next to "Add Card")
3. The system will:
   - Query ClickPesa API for each card's control number
   - Create CREDIT ledger entries for payments with status "SUCCESS" or "SETTLED"
   - Update card balances automatically
   - Show a success message with number of payments synced

### Option 2: Manual Payment Entry (If API Sync Fails)

If the ClickPesa API doesn't support querying payments, you can manually create ledger entries:

**Endpoint**: `POST /api/v1/cards/manual-payment-entry`

**Request Body**:
```json
{
  "control_number": "927273358943",
  "amount": 100.00,
  "order_id": "92727335-8943",
  "status": "SUCCESS"
}
```

**Example for Matterverse card**:
```bash
curl -X POST http://localhost:8000/api/v1/cards/manual-payment-entry \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "control_number": "927273358943",
    "amount": 100.00,
    "order_id": "92727335-8943",
    "status": "SUCCESS"
  }'
```

### Option 3: Configure ClickPesa Webhook (For Future Payments)

**Webhook URL**: `http://your-server.com/api/v1/cards/webhook/payment`

1. Log in to ClickPesa Dashboard
2. Go to Settings → Webhooks
3. Add webhook URL: `http://your-server.com/api/v1/cards/webhook/payment`
4. Select events: Payment Success, Payment Settled
5. Save

**Going forward**, all new payments will sync automatically via webhook - no manual action needed!

## How Balances Work

- **Balance Calculation**: Balances are calculated from ledger entries (CREDITS - DEBITS)
- **Not Direct Updates**: We don't directly update `cards.balance` - it's calculated from `card_ledger_entries`
- **Audit Trail**: Every payment creates a ledger entry with full details
- **No Duplicates**: System checks for existing entries to prevent duplicate credits

## Troubleshooting

### If balances remain 0 after syncing:

1. **Check ClickPesa Dashboard**:
   - Verify payments have status "SUCCESS" or "SETTLED"
   - Note the Order ID (e.g., "92727335-8943")
   - Extract control number (remove dashes: "927273358943")

2. **Check Webhook Logs**:
   - Look for webhook calls in backend logs: `🔔 ClickPesa Webhook Received`
   - Verify webhook is receiving payment notifications

3. **Verify Control Numbers**:
   - Control numbers must match exactly (normalized, no dashes/spaces)
   - Check card control numbers match payment control numbers

4. **Manual Entry**:
   - Use manual entry endpoint if API sync doesn't work
   - Provide exact control number and amount from ClickPesa dashboard

## Testing

To test the system:

1. **Create a test payment** in ClickPesa dashboard
2. **Wait for webhook** (or trigger manually)
3. **Check ledger entries**:
   ```sql
   SELECT * FROM card_ledger_entries ORDER BY created_at DESC;
   ```
4. **Check card balance**:
   ```sql
   SELECT id, cardholder_name, balance FROM cards;
   ```

## API Endpoints

### Sync Payments
```
POST /api/v1/cards/sync-payments
Authorization: Bearer <token>
Body: {} (empty to sync all cards)
```

### Manual Payment Entry
```
POST /api/v1/cards/manual-payment-entry
Authorization: Bearer <token>
Body: {
  "control_number": "927273358943",
  "amount": 100.00,
  "order_id": "92727335-8943",
  "status": "SUCCESS"
}
```

### Webhook (ClickPesa calls this)
```
POST /api/v1/cards/webhook/payment
Content-Type: application/json
Body: { ClickPesa webhook data }
```

## Next Steps

1. ✅ **Click "Sync Payments"** button in frontend to sync existing payments
2. ✅ **Configure ClickPesa webhook** for automatic syncing going forward
3. ✅ **Verify balances** update correctly after syncing
4. ✅ **Test with a new payment** to ensure webhook works

