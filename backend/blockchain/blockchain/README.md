# Real Estate Blockchain System

A comprehensive blockchain infrastructure for real estate tokenization, fractional ownership, and automated payment distribution using OpenZeppelin contracts.

## 🏗️ Architecture Overview

This system consists of four main smart contracts that work together to provide:

- **Digital Title Deeds** (ERC-721 NFTs)
- **Tokenized Property Shares** (ERC-20 tokens)
- **Automatic Payment Distribution** to stakeholders
- **Escrow System** for secure transactions

## 📋 Smart Contracts

### 1. PropertyTitleDeed.sol
- **Purpose**: ERC-721 NFT contract for digital title deeds
- **Features**:
  - Unique NFT for each property
  - Property information stored on-chain
  - Ownership transfer tracking
  - Metadata URI support

### 2. PropertyShares.sol
- **Purpose**: ERC-20 token contract for fractionalized property ownership
- **Features**:
  - Multiple investors per property
  - Share price management
  - Buy/sell functionality
  - Circulating supply tracking

### 3. PropertyPaymentSplitter.sol
- **Purpose**: Automatic payment distribution to stakeholders
- **Features**:
  - Predefined stakeholder percentages
  - Automatic fund distribution
  - Role-based stakeholder management
  - Payment tracking

### 4. PropertyEscrow.sol
- **Purpose**: Main contract managing property transactions
- **Features**:
  - Escrow system for secure transactions
  - Integration of all contracts
  - Payment confirmation workflow
  - Property registration management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Hardhat

### Installation

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy contracts
npm run deploy
```

### Local Development

```bash
# Start local blockchain
npm run node

# Deploy to local network
npm run deploy:local
```

## 💡 Usage Examples

### 1. Register a Property

```javascript
// Register property with all contracts
await escrowContract.registerProperty(
    "PROP-001",                    // Property ID
    "Dar es Salaam, Tanzania",     // Location
    ethers.parseEther("1000000"), // Total value
    1000,                         // Total shares
    ethers.parseEther("1000"),     // Share price
    "https://api.example.com/metadata/property-001", // Token URI
    [governmentAddress, sellerAddress], // Stakeholders
    [1000, 9000],                  // Percentages (10%, 90%)
    ["Government", "Seller"],      // Roles
    sellerAddress                  // Initial owner
);
```

### 2. Purchase Property Shares

```javascript
// Buy 100 shares
const sharesToBuy = 100;
const totalCost = sharesToBuy * sharePrice;

await sharesContract.purchaseShares(
    "PROP-001",
    sharesToBuy,
    { value: totalCost }
);
```

### 3. Create Escrow for Property Purchase

```javascript
// Create escrow
const escrowId = await escrowContract.createEscrow(
    "PROP-001",           // Property ID
    buyerAddress,         // Buyer
    100,                  // Shares to buy
    deadlineTimestamp,     // Deadline
    "PAY-REF-001"         // Payment reference
);

// Confirm payment and complete escrow
await escrowContract.confirmPaymentAndCompleteEscrow(escrowId);
```

### 4. Distribute Payments to Stakeholders

```javascript
// Distribute payment automatically
await paymentSplitterContract.distributePropertyPayment(
    "PROP-001",
    { value: paymentAmount }
);
```

## 🔧 Configuration

### Hardhat Configuration

The system supports multiple networks:

- **Hardhat**: Local development
- **Localhost**: Local blockchain node
- **Polygon**: Polygon mainnet/testnet
- **Ethereum**: Ethereum mainnet/testnet

### Environment Variables

Create a `.env` file:

```env
PRIVATE_KEY=your_private_key_here
POLYGON_RPC_URL=https://polygon-rpc.com
ETHERSCAN_API_KEY=your_etherscan_api_key
```

## 📊 Stakeholder Distribution

The system supports automatic payment distribution to stakeholders:

| Stakeholder | Role | Default Share |
|-------------|------|---------------|
| Government | Tax/Fee | 10% |
| Broker | Commission | 5% |
| Seller | Property Owner | 80% |
| Platform | Service Fee | 5% |

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm run test
```

Tests cover:
- Property registration
- Share trading
- Payment distribution
- Escrow functionality
- Contract integration

## 🔒 Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Ownable**: Access control for admin functions
- **OpenZeppelin**: Battle-tested contract libraries
- **Input Validation**: Comprehensive parameter validation
- **Emergency Functions**: Emergency withdrawal capabilities

## 🌐 Integration with Backend

The contracts are designed to integrate with the FastAPI backend:

1. **Property Registration**: Backend calls `registerProperty()`
2. **Payment Confirmation**: Backend confirms traditional payments
3. **Escrow Management**: Backend manages escrow lifecycle
4. **Stakeholder Distribution**: Automatic distribution on payment

## 📈 Future Enhancements

- **Multi-signature Support**: Enhanced security for large transactions
- **Oracle Integration**: Real-time property valuation
- **Cross-chain Support**: Multi-blockchain compatibility
- **Governance Tokens**: Community voting on property decisions
- **Insurance Integration**: Automated insurance claims

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the future of real estate investment**
