# ClickPesa + Wise Integration Analysis

## Your Existing ClickPesa Infrastructure

### 1. **Payment Collection System** (BillPay)

**What You Have:**
- **Customer BillPay Control Numbers**: Generate unique control numbers for each payment
- **Shared BillPay Namba**: Single merchant number (`CLICKPESA_BILLPAY_NAMBA`) for all businesses
- **Payment Collection Flow**:
  1. Business creates payment request → Generate BillPay control number
  2. Customer pays using control number + merchant number
  3. ClickPesa webhook notifies your system
  4. System credits business card balance

**Components:**
- `routers/clickpesa.py`: Token generation
- `routers/cards.py`: Card management + BillPay payment creation
- `models/card.py`: Card and CardTransaction models
- Webhook: `/api/v1/cards/webhook/payment`

**Key Features:**
- ✅ Customer payment collection (BillPay)
- ✅ Balance tracking per business card
- ✅ Transaction history
- ✅ Webhook-based status updates
- ✅ Multiple businesses in shared pool

### 2. **Business Card System**

**What You Have:**
- **Virtual Cards**: Each business has a virtual card
- **Balance Management**: Track balance per business card
- **Customer Payments**: Customers pay to business cards via BillPay
- **Transaction Types**: 
  - `customer_payment`: Money coming in from customers
  - `deposit`: Top-ups
  - `withdrawal`: Payouts

**Model Structure:**
```python
Card:
  - user_id (business owner)
  - balance (current balance in TZS)
  - card_type, last_four, etc.

CardTransaction:
  - customer_billpay_control_number
  - payment_reference
  - amount, currency (TZS)
  - status (pending, completed, failed)
  - clickpesa_transaction_id
  - blockchain_hash (for audit)
```

### 3. **Blockchain Integration**

**What You Have:**
- **Audit Trail**: Blockchain records for all transactions
- **Integrity Verification**: Verify transaction hasn't been tampered
- **Pool Balance Tracking**: Track balance distribution across businesses
- **Security**: Immutable records of all ClickPesa transactions

**Purpose:**
- Security and audit only (NOT for payment processing)
- ClickPesa handles actual money movement
- Blockchain provides verification layer

### 4. **Shared Pool Architecture**

**What You Have:**
- Multiple businesses share a single ClickPesa merchant account
- Each business has a virtual card with individual balance
- BillPay control numbers identify which business to credit
- Blockchain ensures balance integrity across the pool

## How Wise Fits Into Your Architecture

### **Current Flow (ClickPesa Only):**

```
Customer Payment Flow:
1. Business creates payment request
2. Generate ClickPesa BillPay control number
3. Customer pays via mobile money/bank (TZS)
4. ClickPesa webhook → Credit business card
5. Business balance increases (TZS)

Outbound Payments:
- Currently: Manual or via ClickPesa (Tanzania only)
- Limitation: Can only send TZS within Tanzania
```

### **Enhanced Flow (ClickPesa + Wise):**

```
Inbound Payments (Collection):
✅ ClickPesa (TZS, Tanzania) - NO CHANGE
   - Customer pays → BillPay control number
   - Money collected in TZS
   - Business card balance increases

Outbound Payments (Remittances):
🆕 Wise (International) - NEW CAPABILITY
   - Business wants to send money internationally
   - Convert TZS balance → USD/EUR/GBP via Wise
   - Send to international recipient
   - Track in Remittance model

Hybrid Use Case:
1. Business collects TZS via ClickPesa (existing)
2. Business wants to pay international supplier
3. System uses Wise to convert TZS → USD and send
4. Deduct from business card balance (TZS)
5. Create Wise remittance record
```

## Integration Strategy

### **Option 1: Complementary Systems (Recommended)**

**ClickPesa = Money IN (Collection)**
- ✅ Keep all existing ClickPesa infrastructure
- ✅ Continue collecting TZS payments
- ✅ No changes to BillPay flow
- ✅ No changes to webhook handling

**Wise = Money OUT (Remittances)**
- 🆕 New capability for international payments
- 🆕 Convert TZS balance to foreign currency
- 🆕 Send to international recipients
- 🆕 Track separately in Remittance model

**Flow:**
```
1. Customer pays business (ClickPesa) → TZS balance increases
2. Business wants to pay supplier in USD
3. System creates Wise remittance:
   - Convert TZS → USD (via Wise exchange rate)
   - Create Wise transfer
   - Deduct TZS from business card balance
   - Record in Remittance table
4. Wise sends money to international recipient
5. Webhook updates Remittance status
```

### **Option 2: Unified Balance System**

**Enhanced Card Model:**
```python
Card:
  - balance_tzs (TZS balance from ClickPesa)
  - balance_usd (USD balance from Wise, if needed)
  - balance_eur (EUR balance, if needed)
  - total_balance (converted to base currency)
```

**Benefits:**
- Single view of all balances
- Can convert between currencies
- Can use ClickPesa money for Wise transfers

### **Option 3: Escrow Integration**

**Your Escrow System:**
- Currently: Escrow holds funds in TZS
- Enhancement: Add international payout capability

**Flow:**
```
1. Escrow created (payer pays in TZS via ClickPesa)
2. Escrow holds TZS funds
3. When escrow completes:
   - If payee is in Tanzania → ClickPesa payout (TZS)
   - If payee is international → Wise remittance (convert TZS → foreign currency)
```

## Recommended Architecture

### **1. Keep ClickPesa for Collection (No Changes)**

```python
# Existing - NO CHANGES
POST /api/v1/cards/{card_id}/create-customer-payment
  → Creates BillPay control number
  → Customer pays in TZS
  → Webhook credits card balance

GET /api/v1/cards/{card_id}/transactions
  → Shows all ClickPesa transactions
```

### **2. Add Wise for Remittances (New)**

```python
# New - International Remittances
POST /api/v1/remittances/
  → Create international transfer
  → Convert TZS balance to foreign currency
  → Send via Wise
  → Deduct from card balance

GET /api/v1/remittances/
  → Show all international transfers
```

### **3. Unified Transaction View**

```python
# Enhanced - Show all transactions
GET /api/v1/cards/{card_id}/all-transactions
  → ClickPesa transactions (TZS, local)
  → Wise remittances (international)
  → Combined view with currency conversion
```

## Implementation Plan

### **Phase 1: Keep ClickPesa As-Is**
- ✅ No changes to existing ClickPesa code
- ✅ BillPay collection continues working
- ✅ Webhooks continue working
- ✅ Card balances continue tracking

### **Phase 2: Add Wise Remittances**
- 🆕 Add Wise remittance endpoints
- 🆕 Create Remittance model
- 🆕 Integrate Wise API
- 🆕 Handle Wise webhooks

### **Phase 3: Connect the Two**
- 🔗 Allow businesses to use ClickPesa balance for Wise transfers
- 🔗 Convert TZS → Foreign currency via Wise
- 🔗 Deduct from card balance when creating remittance
- 🔗 Track currency conversions

### **Phase 4: Enhanced Features**
- 💡 Multi-currency card balances
- 💡 Exchange rate caching
- 💡 Remittance templates
- 💡 Bulk remittances

## Data Flow Example

### **Scenario: Business collects TZS, pays international supplier**

```
Step 1: Customer Payment (ClickPesa) - EXISTING
├── Customer pays 1,000,000 TZS via BillPay
├── ClickPesa webhook received
├── Card balance: +1,000,000 TZS
└── CardTransaction created (customer_payment)

Step 2: International Remittance (Wise) - NEW
├── Business wants to pay $500 USD to supplier
├── System creates Wise quote: 1,000,000 TZS → $500 USD
├── System creates Wise transfer
├── Card balance: -1,000,000 TZS
├── Remittance created (status: pending)
└── Wise processes transfer

Step 3: Wise Webhook
├── Wise sends status update
├── Remittance status: completed
└── Supplier receives $500 USD
```

## Key Benefits

### **1. No Disruption to Existing System**
- ✅ All ClickPesa code remains unchanged
- ✅ All existing endpoints work as before
- ✅ All webhooks continue working
- ✅ All card balances continue tracking

### **2. New Capabilities**
- 🆕 International remittances
- 🆕 Multi-currency support
- 🆕 Global payment reach
- 🆕 Better exchange rates

### **3. Unified Experience**
- 💡 Single dashboard for all transactions
- 💡 ClickPesa (in) + Wise (out)
- 💡 Balance conversion
- 💡 Transaction history

### **4. Scalability**
- 📈 Can add more payment providers
- 📈 Can support more currencies
- 📈 Can handle more transaction types
- 📈 Can expand to more countries

## Database Schema

### **Existing (ClickPesa):**
```sql
cards:
  - id, user_id, balance (TZS), ...

card_transactions:
  - id, card_id, amount (TZS), 
  - customer_billpay_control_number,
  - clickpesa_transaction_id, ...
```

### **New (Wise):**
```sql
remittances:
  - id, remittance_id,
  - provider (WISE/CLICKPESA),
  - amount, currency,
  - recipient_country,
  - provider_transfer_id, ...
```

### **Connection:**
```python
# Link remittance to card (if funded from card balance)
remittances:
  - card_id (optional, if funded from card)
  - source_balance_deduction (TZS amount deducted)
```

## API Endpoints Summary

### **ClickPesa (Existing - No Changes):**
```
POST   /api/v1/cards/{card_id}/create-customer-payment
POST   /api/v1/cards/webhook/payment
GET    /api/v1/cards/{card_id}/transactions
GET    /api/v1/cards/
```

### **Wise (New):**
```
POST   /api/v1/remittances/
GET    /api/v1/remittances/
GET    /api/v1/remittances/{remittance_id}
GET    /api/v1/remittances/exchange-rate/{from}/{to}
POST   /api/v1/remittances/webhook/wise
```

### **Unified (Enhanced):**
```
GET    /api/v1/cards/{card_id}/all-transactions
       → Combines ClickPesa + Wise transactions

POST   /api/v1/cards/{card_id}/create-remittance
       → Create remittance from card balance
```

## Conclusion

**Wise integration complements your ClickPesa infrastructure:**

1. **ClickPesa** = Money IN (Collection in TZS)
2. **Wise** = Money OUT (International remittances)
3. **No Conflicts** = Separate models, endpoints, webhooks
4. **Unified View** = Combined transaction history
5. **Enhanced Capabilities** = International payments without losing local collection

**Your existing ClickPesa infrastructure remains untouched and continues working exactly as before. Wise adds new capabilities for international remittances.**

