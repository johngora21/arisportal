# Quick Environment Setup Reference

## Required Environment Variables for Escrow Payout & Web3

Add these to your `backend/.env` file:

```bash
# ============================================
# ESCROW PAYOUT & WEB3 CONFIGURATION
# ============================================

# Blockchain RPC URL (required for Web3 release tracking)
# Testnet (development): https://rpc-mumbai.maticvigil.com
# Mainnet (production): https://polygon-rpc.com
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com

# Chain ID
# Polygon Mumbai: 80001
# Polygon Mainnet: 137
CHAIN_ID=80001

# Smart Contract Address (optional - for on-chain release recording)
# Set this after deploying your escrow smart contract
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# Wallet Private Key (optional - for signing release transactions)
# ⚠️ NEVER commit this to version control!
# Must have ETH/MATIC for gas fees
WALLET_PRIVATE_KEY=your_wallet_private_key_here
# Optional override if your ABI lives elsewhere
ESCROW_CONTRACT_ABI_PATH=/absolute/path/to/EscrowContract.json
```

## Quick Setup Steps

1. **Run Database Migration**:
   ```bash
   cd backend
   python add_escrow_payout_columns.py
   ```

2. **Update .env file** with the variables above

3. **Restart backend** to load new environment variables

4. **Verify Web3 connection** - check backend logs for:
   - ✅ `Web3 connected to blockchain` (success)
   - ⚠️ `Web3 connected but CONTRACT_ADDRESS or WALLET_PRIVATE_KEY not set` (partial)
   - ⚠️ `BLOCKCHAIN_RPC_URL not set` (mock mode)
   - ⚠️ `Escrow contract ABI not found` (set `ESCROW_CONTRACT_ABI_PATH`)

## Notes

- **Web3 is optional** - the escrow system works without blockchain
- **Without Web3**: Payouts work, but `released_via_web3` will be `false`
- **With Web3**: Releases can be recorded on-chain for audit trail
- Escrow IDs such as `ESC-001` are automatically normalised to numeric `1` before the on-chain call
- Ensure the wallet has enough gas to cover transaction costs

See `ESCROW_WEB3_SETUP.md` for detailed setup instructions.

