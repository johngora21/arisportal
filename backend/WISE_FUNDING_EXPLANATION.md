# Wise Funding/Top-Up Methods - How It Works

## Key Difference: Wise vs ClickPesa

### ClickPesa (Your Current System):
```
✅ Has a "Top-Up" System (BillPay)
├── Customer pays → BillPay Control Number
├── Money goes into business card balance
├── Balance accumulates over time
└── Business uses balance for payments
```

### Wise (Different Model):
```
❌ NO "Top-Up" System
├── Transfers are funded on-demand
├── No pre-funded balance (unless you use Wise Balance)
└── Each transfer needs to be funded separately
```

## Wise Funding Methods (According to Documentation)

### 1. **Direct Bank Transfer (Push)** ⭐ Most Common

**How it works:**
- Customer/business sends money directly to Wise's bank account
- **Must include transfer ID in payment reference** (format: `T{transfer_id}`)
- Example: Transfer ID `80106743` → Reference: `T80106743`

**Flow:**
```
1. Create Wise transfer (status: incoming_payment_waiting)
2. Get transfer ID from Wise (e.g., 80106743)
3. Provide customer with:
   - Wise's bank account details
   - Payment reference: T80106743
4. Customer sends money to Wise's account
5. Wise matches payment to transfer via reference
6. Transfer moves to "processing" status
```

**For Your System:**
```
Business wants to send $500 USD internationally:
1. Create Wise transfer → Get transfer ID
2. Business needs to fund it:
   Option A: Business sends money directly to Wise (with transfer ID reference)
   Option B: Use existing TZS balance → Convert and fund transfer
```

### 2. **Direct Debit Bank Transfer (Pull)**

**How it works:**
- Wise pulls funds directly from customer's bank account
- Requires setting up direct debit agreement
- Only available to select partners
- Need to contact Wise team for access

**For Your System:**
- Would need Wise partnership approval
- Customer gives permission for Wise to pull funds
- Good for recurring payments

### 3. **Fund From Wise Balance** 💰 Recommended for Your Use Case

**How it works:**
- Customer/business maintains a balance in Wise account
- Transfer is funded automatically from Wise balance
- Balance must be in same currency as transfer
- No cross-currency funding from balance

**Flow:**
```
1. Business adds funds to Wise account (one-time or recurring)
2. Wise balance increases (e.g., $1000 USD)
3. Create transfer for $500 USD
4. Transfer automatically funded from balance
5. Wise balance decreases to $500 USD
```

**For Your System - Recommended Approach:**
```
Step 1: Top-Up Wise Balance (One-Time Setup)
├── Business sends money to Wise account
├── Wise balance created (e.g., $5000 USD)
└── Balance held in Wise account

Step 2: Use Balance for Transfers
├── Business wants to send $500 USD
├── Create Wise transfer
├── Automatically funded from Wise balance
└── Balance decreases to $4500 USD

Step 3: Replenish Balance (When Needed)
├── Business sends more money to Wise
└── Balance increases again
```

### 4. **Bulk Settlement** (For Partners)

**How it works:**
- Prefunded model for faster transfers
- Partner maintains a balance with Wise
- Multiple transfers funded from partner's balance
- Settled later via bulk payment
- Need to contact Wise for partnership

**For Your System:**
- Would require Wise partnership
- Good for high-volume transactions
- Faster processing

## Recommended Integration for Your System

### **Option 1: Hybrid Model (ClickPesa + Wise Balance)** ⭐ Best

**Flow:**
```
1. Money Collection (ClickPesa) - Existing
   ├── Customer pays business → TZS collected
   ├── Business card balance increases
   └── All in TZS

2. Convert to Wise Balance (When Needed)
   ├── Business wants to send internationally
   ├── Convert TZS → USD (or other currency)
   ├── Add to Wise balance
   └── Use Wise balance for transfers

3. Create International Transfer
   ├── Create Wise transfer
   ├── Automatically funded from Wise balance
   └── Send to international recipient
```

**Implementation:**
```python
# Step 1: Business collects TZS via ClickPesa (existing)
POST /api/v1/cards/{card_id}/create-customer-payment
→ Customer pays 1,000,000 TZS
→ Card balance: +1,000,000 TZS

# Step 2: Convert TZS to Wise Balance
POST /api/v1/remittances/convert-to-wise-balance
{
  "card_id": 123,
  "amount_tzs": 1,000,000,
  "target_currency": "USD"
}
→ Convert 1,000,000 TZS → ~$400 USD
→ Add $400 to Wise balance
→ Card balance: -1,000,000 TZS

# Step 3: Create Transfer from Wise Balance
POST /api/v1/remittances/
{
  "amount": 400,
  "currency": "USD",
  "fund_from": "wise_balance",
  "recipient_country": "US",
  ...
}
→ Transfer funded from Wise balance
→ Wise balance: -$400 USD
```

### **Option 2: Direct Bank Transfer Model**

**Flow:**
```
1. Create Wise Transfer
   ├── Get transfer ID
   └── Status: incoming_payment_waiting

2. Business Funds Transfer
   ├── Business sends money to Wise's bank account
   ├── Includes transfer ID in reference (T{transfer_id})
   └── Wise matches and processes

3. Transfer Completes
   ├── Wise receives payment
   ├── Transfer moves to "processing"
   └── Money sent to recipient
```

**Implementation:**
```python
# Step 1: Create transfer (unfunded)
POST /api/v1/remittances/
{
  "amount": 400,
  "currency": "USD",
  "fund_from": "direct_transfer",
  ...
}
→ Returns transfer_id and Wise bank details
→ Status: incoming_payment_waiting

# Step 2: Business funds transfer
GET /api/v1/remittances/{remittance_id}/funding-instructions
→ Returns:
  - Wise bank account details
  - Payment reference: T80106743
  - Amount to send

# Step 3: Business sends money to Wise
→ Manual bank transfer with reference T80106743

# Step 4: Wise webhook updates status
→ Status: processing → completed
```

## Wise Balance Management

### **Creating Wise Balance:**

Wise supports multi-currency accounts where you can hold balances. To add funds:

1. **Via API:** Use Wise's balance top-up endpoints (if available)
2. **Via Bank Transfer:** Send money to Wise account details
3. **Via Direct Debit:** Set up automatic top-ups

### **Balance Structure:**

```
Wise Account:
├── USD Balance: $5000
├── EUR Balance: €3000
├── GBP Balance: £2000
└── Other currencies...

Transfer Requirements:
- USD transfer → Must fund from USD balance
- EUR transfer → Must fund from EUR balance
- No cross-currency funding from balance
```

## Integration Recommendation for ArisPortal

### **Recommended Flow:**

```
┌─────────────────────────────────────────────────────────┐
│           ARISPORTAL PAYMENT FLOW                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  STEP 1: Collect Money (ClickPesa) ✅                  │
│  ├── Customer pays business → TZS                      │
│  ├── Card balance increases                            │
│  └── All existing code works                           │
│                                                         │
│  STEP 2: Convert to Wise Balance (New) 🆕              │
│  ├── Business wants international capability           │
│  ├── Convert TZS → USD/EUR/GBP                        │
│  ├── Add to Wise multi-currency balance               │
│  └── Deduct from card balance                          │
│                                                         │
│  STEP 3: Send International Transfer (Wise) 🆕         │
│  ├── Create Wise transfer                              │
│  ├── Fund from Wise balance (automatic)                │
│  ├── Send to international recipient                   │
│  └── Track in Remittance model                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### **API Endpoints Needed:**

```python
# 1. Convert TZS to Wise Balance
POST /api/v1/remittances/convert-to-wise-balance
{
  "card_id": 123,
  "amount_tzs": 1000000,
  "target_currency": "USD"
}
→ Converts TZS → USD
→ Adds to Wise balance
→ Deducts from card balance

# 2. Get Wise Balance
GET /api/v1/remittances/wise-balance
→ Returns balances in all currencies

# 3. Create Transfer from Balance
POST /api/v1/remittances/
{
  "amount": 400,
  "currency": "USD",
  "fund_from": "wise_balance",
  "recipient_country": "US",
  ...
}
→ Creates transfer
→ Funds from Wise balance
→ Sends to recipient
```

## Key Points

### **Wise Doesn't Have "Top-Up" Like ClickPesa:**
- ❌ No BillPay control numbers
- ❌ No "pay and credit balance" system
- ✅ Transfers funded on-demand
- ✅ Or use Wise Balance (recommended)

### **For Your System:**
1. **Keep ClickPesa for collection** (TZS, local)
2. **Use Wise Balance for international** (convert TZS → foreign currency)
3. **Fund transfers from balance** (automatic)
4. **Replenish balance as needed** (convert more TZS)

### **Benefits:**
- ✅ Leverages existing ClickPesa infrastructure
- ✅ Adds international capability
- ✅ Wise Balance provides flexibility
- ✅ Automatic funding from balance
- ✅ No manual bank transfers needed

## Next Steps

1. **Implement Wise Balance Management:**
   - Add balance top-up endpoint
   - Convert TZS → Foreign currency
   - Track Wise balances in database

2. **Update Remittance Flow:**
   - Add "fund_from" option (wise_balance vs direct_transfer)
   - Auto-fund from balance if available
   - Provide funding instructions if needed

3. **Add Balance Tracking:**
   - Track Wise balances per business
   - Show balance in dashboard
   - Alert when balance is low

4. **Currency Conversion:**
   - Use Wise exchange rates
   - Convert TZS → Target currency
   - Show conversion rates to users

