# Escrow Web3 Setup Guide

This guide explains how to configure Web3/blockchain integration for escrow release tracking.

## Overview

When escrow funds are released via ClickPesa (bank or MNO payout), the system can optionally record the release transaction on a blockchain for audit and transparency purposes. This is **optional** - the escrow system works without blockchain, but enabling it provides immutable audit trails.

## Environment Variables

Add these to your `.env` file in the `backend/` directory:

```bash
# Blockchain/Web3 Configuration for Escrow Release Tracking
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
CHAIN_ID=80001
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
WALLET_PRIVATE_KEY=your_wallet_private_key_here
# Optional: override path to EscrowContract ABI (defaults to backend/blockchain/blockchain/artifacts/...)
ESCROW_CONTRACT_ABI_PATH=/absolute/path/to/EscrowContract.json
```

### Configuration Details

#### BLOCKCHAIN_RPC_URL
- **Testnet (Recommended for development)**: `https://rpc-mumbai.maticvigil.com` (Polygon Mumbai)
- **Mainnet (Production)**: `https://polygon-rpc.com` (Polygon Mainnet)
- **Other options**: Any Ethereum-compatible RPC endpoint

#### CHAIN_ID
- **Polygon Mumbai (Testnet)**: `80001`
- **Polygon Mainnet**: `137`
- **Ethereum Mainnet**: `1`
- **Ethereum Sepolia (Testnet)**: `11155111`

#### CONTRACT_ADDRESS
- The address of your deployed escrow smart contract
- If not set, Web3 will connect but won't record releases on-chain
- **Format**: `0x` followed by 40 hex characters (e.g., `0x1234567890abcdef1234567890abcdef12345678`)

#### WALLET_PRIVATE_KEY
- Private key of the wallet that will sign release transactions
- **⚠️ SECURITY WARNING**: Never commit this to version control!
- **Format**: `0x` followed by 64 hex characters
- This wallet must have ETH/MATIC for gas fees

## Setup Steps

### 1. Install Web3 Dependencies

```bash
cd backend
pip install web3
```

### 2. Create/Update .env File

```bash
# Copy the example (if it exists) or create new
cp .env.example .env

# Edit .env and add the blockchain configuration
nano .env  # or use your preferred editor
```

### 3. Get Testnet MATIC (for Polygon Mumbai)

If using Polygon Mumbai testnet, get free testnet MATIC from:
- [Polygon Faucet](https://faucet.polygon.technology/)
- [QuickNode Faucet](https://faucet.quicknode.com/polygon/mumbai)

### 4. Deploy Smart Contract (Optional)

If you want to record releases on-chain, deploy the escrow smart contract:

```bash
cd backend/blockchain/blockchain
npm install
npx hardhat compile
npx hardhat deploy --network mumbai
```

Copy the deployed contract address to `CONTRACT_ADDRESS` in your `.env`. If you are using a custom build location for the compiled artifact, set `ESCROW_CONTRACT_ABI_PATH` to point at the generated `EscrowContract.json` file.

### 5. Run Database Migration

```bash
cd backend
python add_escrow_payout_columns.py
```

This adds the necessary columns to the `escrows` table for tracking payout and blockchain release information.

### 6. Restart Backend

```bash
# Stop the current backend if running
# Then restart
cd backend
PYTHONPATH=backend uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

## Verification

### Check Web3 Connection

When the backend starts, you should see one of these messages:

- ✅ **Success**: `✅ Web3 connected to blockchain (Chain ID: 80001)`
- ⚠️ **Partial**: `⚠️ Web3 connected but CONTRACT_ADDRESS or WALLET_PRIVATE_KEY not set`
- ⚠️ **Mock Mode**: `⚠️ BLOCKCHAIN_RPC_URL not set - running in mock mode`

### Test Escrow Release

1. Create an escrow (escrow IDs such as `ESC-001` will automatically be normalised to the numeric `1` for the smart contract call)
2. Set payout method (bank or MNO)
3. Release the escrow funds
4. Check the escrow details - you should see:
   - `payout_status`: Status from ClickPesa
   - `payout_reference`: ClickPesa transaction reference
   - `released_via_web3`: `true` if blockchain recording succeeded
   - `release_transaction_hash`: Blockchain transaction hash (if recorded)
   - `release_block_number`: Block number (if recorded)

## Current Status

**⚠️ Note**: The `release_payment()` function in `backend/services/escrow_smart_contract.py` currently returns a placeholder response. To enable actual on-chain recording:

1. Deploy the escrow smart contract
2. Ensure the contract ABI is available on disk (optionally set `ESCROW_CONTRACT_ABI_PATH`)
3. Provide `BLOCKCHAIN_RPC_URL`, `CONTRACT_ADDRESS`, `WALLET_PRIVATE_KEY`, and `CHAIN_ID`
4. The backend now signs and submits the release transaction and waits for confirmation automatically.

The infrastructure is in place - you just need to implement the contract interaction logic.

## Troubleshooting

### "web3 provider not configured"
- Check that `BLOCKCHAIN_RPC_URL` is set in `.env`
- Verify `CONTRACT_ADDRESS`, `WALLET_PRIVATE_KEY`, and `ESCROW_CONTRACT_ABI_PATH` are set (or that the default ABI path exists)
- Ensure the RPC URL is accessible and the wallet has funds

### "CONTRACT_ADDRESS or WALLET_PRIVATE_KEY not set"
- Set both variables in `.env`
- Restart the backend after updating `.env`

### "Web3 connection failed"
- Verify the RPC URL is correct
- Check if the RPC endpoint is accessible
- Try a different RPC provider

### Transaction fails
- Ensure the wallet has sufficient ETH/MATIC for gas
- Verify the contract address is correct and checksum formatted
- Check that the contract is deployed, the ABI matches, and the escrow ID exists on-chain

## Security Best Practices

1. **Never commit `.env` to version control**
2. **Use testnet for development** (Polygon Mumbai is configured out of the box)
3. **Use a dedicated wallet for escrow releases** (not your main wallet)
4. **Keep private keys secure** - consider using a hardware wallet or key management service
5. **Monitor gas prices** - high gas costs can make on-chain recording expensive
6. **Set up alerts** for failed transactions and monitor the returned transaction hash

## Optional: Disable Web3

If you don't want blockchain integration, simply don't set `BLOCKCHAIN_RPC_URL`. The system will work normally, but `released_via_web3` will always be `false` and no blockchain transactions will be recorded.

