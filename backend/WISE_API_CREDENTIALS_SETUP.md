# Wise API Credentials Setup

## Required Credentials

Wise uses **Bearer Token authentication** (not API key/secret key). You need:

1. **WISE_API_TOKEN** - Your personal or business API token
2. **WISE_SANDBOX** - Set to `true` for testing, `false` for production
3. **WISE_API_URL** - Optional (auto-set based on SANDBOX mode)

## How to Get Wise API Token

### Step 1: Create Wise Account

1. Go to [Wise.com](https://wise.com)
2. Sign up for a business account (required for API access)
3. Complete KYC verification

### Step 2: Get API Token

1. Log in to your Wise account
2. Go to **Settings** → **API tokens** (or visit: https://wise.com/user/account/api-tokens)
3. Click **Create a token**
4. Give it a name (e.g., "ArisPortal Integration")
5. Select scopes/permissions:
   - **Transfers** - Create and manage transfers
   - **Balances** - View balances
   - **Profiles** - Access profile information
6. Copy the token (you'll only see it once!)

### Step 3: Configure Environment Variables

Add to your `.env` file:

```env
# Wise API Credentials
WISE_API_TOKEN=your_wise_api_token_here
WISE_SANDBOX=true  # Set to false for production
WISE_API_URL=https://api.sandbox.transferwise.tech  # Auto-set if not specified
```

### Step 4: Sandbox vs Production

#### Sandbox (Testing)
```env
WISE_SANDBOX=true
WISE_API_URL=https://api.sandbox.transferwise.tech
```

- Use for testing and development
- No real money involved
- Limited functionality
- Faster setup

#### Production
```env
WISE_SANDBOX=false
WISE_API_URL=https://api.transferwise.com
```

- Real money transfers
- Full functionality
- Requires business verification
- May require Wise partnership approval

## Authentication

Wise uses **Bearer Token** authentication:

```
Authorization: Bearer <your_api_token>
```

The token is included in the `Authorization` header of every API request.

## Token Types

### Personal Token
- For personal accounts
- Limited to personal transfers
- Not recommended for business use

### Business Token
- For business accounts
- Required for production use
- Supports business transfers
- Better for integration

## Security Best Practices

1. **Never commit tokens to Git**
   - Add `.env` to `.gitignore`
   - Use environment variables
   - Use secret management in production

2. **Rotate tokens regularly**
   - Create new tokens periodically
   - Revoke old tokens
   - Monitor token usage

3. **Use sandbox for testing**
   - Test in sandbox first
   - Verify functionality
   - Only use production for real transfers

4. **Limit token permissions**
   - Only grant necessary permissions
   - Use principle of least privilege
   - Review permissions regularly

## Testing Your Credentials

### Test API Connection

```python
from services.wise_service import WiseService

try:
    wise_service = WiseService()
    profiles = wise_service._get_profile_id()
    print(f"✅ Wise API connected! Profile ID: {profiles}")
except Exception as e:
    print(f"❌ Error: {str(e)}")
```

### Test Endpoint

You can test the connection via the API:

```bash
curl -X GET https://api.sandbox.transferwise.tech/v1/profiles \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Error: "WISE_API_TOKEN is not set"
- Check your `.env` file exists
- Verify `WISE_API_TOKEN` is set
- Restart your application

### Error: "Unauthorized" or "401"
- Token is invalid or expired
- Check token is correct
- Regenerate token if needed

### Error: "No Wise profiles found"
- Account not verified
- Business account not set up
- Contact Wise support

### Error: "Forbidden" or "403"
- Token doesn't have required permissions
- Check token scopes
- Regenerate token with correct permissions

## Getting Help

- **Wise API Documentation**: https://api-docs.wise.com
- **Wise Support**: support@wise.com
- **Wise Developer Portal**: https://wise.com/developer

## Next Steps

1. ✅ Get Wise API token
2. ✅ Add to `.env` file
3. ✅ Test connection
4. ✅ Create test transfer
5. ✅ Verify webhook setup
6. ✅ Deploy to production

## Important Notes

- **Wise requires business account** for API access
- **Sandbox is free** to test
- **Production may require approval** from Wise
- **API tokens are sensitive** - keep them secure
- **Tokens can be revoked** - have backup plan

