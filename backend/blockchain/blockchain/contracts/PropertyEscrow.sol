// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PropertyTitleDeed.sol";
import "./PropertyShares.sol";
import "./PropertyPaymentSplitter.sol";

/**
 * @title PropertyEscrow
 * @dev Main contract managing property transactions, escrow, and ownership
 * Integrates all property-related contracts for seamless operation
 */
contract PropertyEscrow is Ownable, ReentrancyGuard {
    
    // Escrow information
    struct EscrowInfo {
        string propertyId;           // Property identifier
        address buyer;              // Buyer address
        address seller;             // Seller address
        uint256 totalAmount;        // Total transaction amount
        uint256 sharesAmount;       // Number of shares being transferred
        uint256 createdAt;          // Escrow creation timestamp
        uint256 deadline;           // Escrow deadline
        bool isActive;             // Whether escrow is active
        bool isCompleted;          // Whether escrow is completed
        string paymentReference;    // Payment reference from traditional payment
    }
    
    // Contract references
    PropertyTitleDeed public titleDeedContract;
    PropertyShares public sharesContract;
    PropertyPaymentSplitter public paymentSplitterContract;
    
    // Mapping from escrow ID to escrow information
    mapping(bytes32 => EscrowInfo) public escrows;
    
    // Mapping from property ID to active escrow ID
    mapping(string => bytes32) public propertyEscrows;
    
    // Escrow counter for unique IDs
    uint256 private _escrowCounter;
    
    // Events
    event EscrowCreated(
        bytes32 indexed escrowId,
        string indexed propertyId,
        address indexed buyer,
        address seller,
        uint256 totalAmount,
        uint256 sharesAmount,
        uint256 deadline
    );
    
    event EscrowCompleted(
        bytes32 indexed escrowId,
        string indexed propertyId,
        address indexed buyer,
        uint256 totalAmount
    );
    
    event EscrowCancelled(
        bytes32 indexed escrowId,
        string indexed propertyId,
        address indexed buyer
    );
    
    event PaymentConfirmed(
        bytes32 indexed escrowId,
        string indexed propertyId,
        string paymentReference
    );
    
    constructor(
        address _titleDeedContract,
        address _sharesContract,
        address _paymentSplitterContract
    ) Ownable(msg.sender) {
        titleDeedContract = PropertyTitleDeed(_titleDeedContract);
        sharesContract = PropertyShares(_sharesContract);
        paymentSplitterContract = PropertyPaymentSplitter(_paymentSplitterContract);
    }
    
    /**
     * @dev Create escrow for property purchase
     * @param propertyId Property identifier
     * @param buyer Buyer address
     * @param sharesAmount Number of shares to purchase
     * @param deadline Escrow deadline timestamp
     * @param paymentReference Payment reference from traditional payment
     */
    function createEscrow(
        string memory propertyId,
        address buyer,
        uint256 sharesAmount,
        uint256 deadline,
        string memory paymentReference
    ) external onlyOwner returns (bytes32) {
        require(buyer != address(0), "Invalid buyer address");
        require(sharesAmount > 0, "Shares amount must be greater than 0");
        require(deadline > block.timestamp, "Deadline must be in the future");
        require(propertyEscrows[propertyId] == bytes32(0), "Property already has active escrow");
        
        // Get property share information
        PropertyShares.PropertyShare memory share = sharesContract.getPropertyShares(propertyId);
        require(share.totalShares > 0, "Property shares do not exist");
        require(share.isActive, "Property shares are not active");
        require(sharesAmount <= share.totalShares, "Not enough shares available");
        
        uint256 totalAmount = sharesAmount * share.sharePrice;
        
        // Generate unique escrow ID
        bytes32 escrowId = keccak256(abi.encodePacked(
            propertyId,
            buyer,
            sharesAmount,
            block.timestamp,
            _escrowCounter
        ));
        _escrowCounter++;
        
        // Create escrow
        escrows[escrowId] = EscrowInfo({
            propertyId: propertyId,
            buyer: buyer,
            seller: share.propertyOwner,
            totalAmount: totalAmount,
            sharesAmount: sharesAmount,
            createdAt: block.timestamp,
            deadline: deadline,
            isActive: true,
            isCompleted: false,
            paymentReference: paymentReference
        });
        
        propertyEscrows[propertyId] = escrowId;
        
        emit EscrowCreated(
            escrowId,
            propertyId,
            buyer,
            share.propertyOwner,
            totalAmount,
            sharesAmount,
            deadline
        );
        
        return escrowId;
    }
    
    /**
     * @dev Confirm payment and complete escrow
     * @param escrowId Escrow identifier
     */
    function confirmPaymentAndCompleteEscrow(bytes32 escrowId) external onlyOwner {
        EscrowInfo storage escrow = escrows[escrowId];
        require(escrow.isActive, "Escrow is not active");
        require(!escrow.isCompleted, "Escrow already completed");
        require(block.timestamp <= escrow.deadline, "Escrow deadline passed");
        
        // Mark escrow as completed
        escrow.isCompleted = true;
        escrow.isActive = false;
        
        // Mint shares to buyer
        sharesContract.purchaseShares(escrow.propertyId, escrow.sharesAmount);
        
        // Transfer title deed if buyer purchases all shares
        PropertyShares.PropertyShare memory share = sharesContract.getPropertyShares(escrow.propertyId);
        if (escrow.sharesAmount == share.totalShares) {
            // Get token ID for the property
            uint256 tokenId = titleDeedContract.propertyIdToTokenId(escrow.propertyId);
            if (tokenId > 0) {
                // Transfer title deed to buyer
                titleDeedContract.transferFrom(escrow.seller, escrow.buyer, tokenId);
            }
        }
        
        // Clear property escrow mapping
        delete propertyEscrows[escrow.propertyId];
        
        emit EscrowCompleted(escrowId, escrow.propertyId, escrow.buyer, escrow.totalAmount);
    }
    
    /**
     * @dev Cancel escrow
     * @param escrowId Escrow identifier
     */
    function cancelEscrow(bytes32 escrowId) external {
        EscrowInfo storage escrow = escrows[escrowId];
        require(escrow.isActive, "Escrow is not active");
        require(
            msg.sender == escrow.buyer || 
            msg.sender == escrow.seller || 
            msg.sender == owner(),
            "Not authorized to cancel escrow"
        );
        
        escrow.isActive = false;
        
        // Clear property escrow mapping
        delete propertyEscrows[escrow.propertyId];
        
        emit EscrowCancelled(escrowId, escrow.propertyId, escrow.buyer);
    }
    
    /**
     * @dev Update payment reference
     * @param escrowId Escrow identifier
     * @param paymentReference New payment reference
     */
    function updatePaymentReference(bytes32 escrowId, string memory paymentReference) external onlyOwner {
        EscrowInfo storage escrow = escrows[escrowId];
        require(escrow.isActive, "Escrow is not active");
        
        escrow.paymentReference = paymentReference;
        
        emit PaymentConfirmed(escrowId, escrow.propertyId, paymentReference);
    }
    
    /**
     * @dev Get escrow information
     * @param escrowId Escrow identifier
     * @return EscrowInfo struct containing escrow details
     */
    function getEscrowInfo(bytes32 escrowId) external view returns (EscrowInfo memory) {
        return escrows[escrowId];
    }
    
    /**
     * @dev Get active escrow for a property
     * @param propertyId Property identifier
     * @return bytes32 Active escrow ID (0 if none)
     */
    function getActiveEscrow(string memory propertyId) external view returns (bytes32) {
        return propertyEscrows[propertyId];
    }
    
    /**
     * @dev Check if property has active escrow
     * @param propertyId Property identifier
     * @return bool True if property has active escrow
     */
    function hasActiveEscrow(string memory propertyId) external view returns (bool) {
        bytes32 escrowId = propertyEscrows[propertyId];
        return escrowId != bytes32(0) && escrows[escrowId].isActive;
    }
    
    /**
     * @dev Get escrow status
     * @param escrowId Escrow identifier
     * @return isActive Whether escrow is active
     * @return isCompleted Whether escrow is completed
     * @return deadline Escrow deadline timestamp
     */
    function getEscrowStatus(bytes32 escrowId) external view returns (bool isActive, bool isCompleted, uint256 deadline) {
        EscrowInfo memory escrow = escrows[escrowId];
        return (escrow.isActive, escrow.isCompleted, escrow.deadline);
    }
    
    /**
     * @dev Register a new property with all contracts
     * @param propertyId Property identifier
     * @param location Property location
     * @param totalValue Total property value
     * @param totalShares Total number of shares
     * @param sharePrice Price per share
     * @param tokenURI NFT metadata URI
     * @param stakeholders Array of stakeholder addresses
     * @param percentages Array of stakeholder percentages
     * @param roles Array of stakeholder roles
     * @param initialOwner Initial property owner
     */
    function registerProperty(
        string memory propertyId,
        string memory location,
        uint256 totalValue,
        uint256 totalShares,
        uint256 sharePrice,
        string memory tokenURI,
        address[] memory stakeholders,
        uint256[] memory percentages,
        string[] memory roles,
        address initialOwner
    ) external onlyOwner {
        // Register title deed
        titleDeedContract.registerProperty(
            propertyId,
            location,
            totalValue,
            totalShares,
            tokenURI,
            initialOwner
        );
        
        // Create property shares
        sharesContract.createPropertyShares(
            propertyId,
            totalShares,
            sharePrice,
            initialOwner
        );
        
        // Set stakeholders for payment distribution
        paymentSplitterContract.setPropertyStakeholders(
            propertyId,
            stakeholders,
            percentages,
            roles
        );
    }
    
    /**
     * @dev Distribute payment to stakeholders
     * @param propertyId Property identifier
     */
    function distributePayment(string memory propertyId) external payable {
        paymentSplitterContract.distributePropertyPayment{value: msg.value}(propertyId);
    }
    
    /**
     * @dev Update contract addresses
     * @param _titleDeedContract New title deed contract address
     * @param _sharesContract New shares contract address
     * @param _paymentSplitterContract New payment splitter contract address
     */
    function updateContracts(
        address _titleDeedContract,
        address _sharesContract,
        address _paymentSplitterContract
    ) external onlyOwner {
        require(_titleDeedContract != address(0), "Invalid title deed contract");
        require(_sharesContract != address(0), "Invalid shares contract");
        require(_paymentSplitterContract != address(0), "Invalid payment splitter contract");
        
        titleDeedContract = PropertyTitleDeed(_titleDeedContract);
        sharesContract = PropertyShares(_sharesContract);
        paymentSplitterContract = PropertyPaymentSplitter(_paymentSplitterContract);
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
}
