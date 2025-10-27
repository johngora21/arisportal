// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PropertyShares
 * @dev ERC-20 token contract for fractionalized property ownership
 * Each property can have multiple investors owning shares
 */
contract PropertyShares is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    
    // Property share information
    struct PropertyShare {
        string propertyId;        // Unique property identifier
        uint256 totalShares;     // Total shares for this property
        uint256 sharePrice;      // Price per share
        bool isActive;          // Whether shares are active for trading
        address propertyOwner;   // Original property owner
        uint256 createdAt;      // Timestamp when shares were created
    }
    
    // Mapping from property ID to share information
    mapping(string => PropertyShare) public propertyShares;
    
    // Mapping from property ID to total supply
    mapping(string => uint256) public propertyTotalSupply;
    
    // Mapping from property ID to circulating supply
    mapping(string => uint256) public propertyCirculatingSupply;
    
    // Events
    event PropertySharesCreated(
        string indexed propertyId,
        uint256 totalShares,
        uint256 sharePrice,
        address indexed propertyOwner
    );
    
    event SharesPurchased(
        string indexed propertyId,
        address indexed buyer,
        uint256 amount,
        uint256 totalCost
    );
    
    event SharesSold(
        string indexed propertyId,
        address indexed seller,
        uint256 amount,
        uint256 totalValue
    );
    
    constructor() ERC20("Property Shares", "PSH") Ownable(msg.sender) {}
    
    /**
     * @dev Create shares for a property
     * @param propertyId Unique property identifier
     * @param totalShares Total number of shares to create
     * @param sharePrice Price per share in wei
     * @param propertyOwner Original property owner
     */
    function createPropertyShares(
        string memory propertyId,
        uint256 totalShares,
        uint256 sharePrice,
        address propertyOwner
    ) external onlyOwner {
        require(totalShares > 0, "Total shares must be greater than 0");
        require(sharePrice > 0, "Share price must be greater than 0");
        require(propertyOwner != address(0), "Invalid property owner");
        require(propertyShares[propertyId].totalShares == 0, "Shares already exist for this property");
        
        // Store property share information
        propertyShares[propertyId] = PropertyShare({
            propertyId: propertyId,
            totalShares: totalShares,
            sharePrice: sharePrice,
            isActive: true,
            propertyOwner: propertyOwner,
            createdAt: block.timestamp
        });
        
        // Set total supply for this property
        propertyTotalSupply[propertyId] = totalShares;
        propertyCirculatingSupply[propertyId] = 0;
        
        emit PropertySharesCreated(
            propertyId,
            totalShares,
            sharePrice,
            propertyOwner
        );
    }
    
    /**
     * @dev Purchase shares for a property
     * @param propertyId Property identifier
     * @param amount Number of shares to purchase
     */
    function purchaseShares(string memory propertyId, uint256 amount) external payable nonReentrant {
        PropertyShare memory share = propertyShares[propertyId];
        require(share.totalShares > 0, "Property shares do not exist");
        require(share.isActive, "Property shares are not active");
        require(amount > 0, "Amount must be greater than 0");
        require(propertyCirculatingSupply[propertyId] + amount <= share.totalShares, "Not enough shares available");
        
        uint256 totalCost = amount * share.sharePrice;
        require(msg.value >= totalCost, "Insufficient payment");
        
        // Update circulating supply
        propertyCirculatingSupply[propertyId] += amount;
        
        // Mint shares to buyer
        _mint(msg.sender, amount);
        
        // Refund excess payment
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
        
        emit SharesPurchased(propertyId, msg.sender, amount, totalCost);
    }
    
    /**
     * @dev Sell shares back to the property owner
     * @param propertyId Property identifier
     * @param amount Number of shares to sell
     */
    function sellShares(string memory propertyId, uint256 amount) external nonReentrant {
        PropertyShare memory share = propertyShares[propertyId];
        require(share.totalShares > 0, "Property shares do not exist");
        require(share.isActive, "Property shares are not active");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient shares");
        
        uint256 totalValue = amount * share.sharePrice;
        
        // Burn shares from seller
        _burn(msg.sender, amount);
        
        // Update circulating supply
        propertyCirculatingSupply[propertyId] -= amount;
        
        // Transfer payment to seller
        payable(msg.sender).transfer(totalValue);
        
        emit SharesSold(propertyId, msg.sender, amount, totalValue);
    }
    
    /**
     * @dev Get property share information
     * @param propertyId Property identifier
     * @return PropertyShare struct containing share details
     */
    function getPropertyShares(string memory propertyId) external view returns (PropertyShare memory) {
        return propertyShares[propertyId];
    }
    
    /**
     * @dev Get available shares for a property
     * @param propertyId Property identifier
     * @return uint256 Number of available shares
     */
    function getAvailableShares(string memory propertyId) external view returns (uint256) {
        PropertyShare memory share = propertyShares[propertyId];
        if (share.totalShares == 0) return 0;
        return share.totalShares - propertyCirculatingSupply[propertyId];
    }
    
    /**
     * @dev Update share price for a property
     * @param propertyId Property identifier
     * @param newPrice New price per share
     */
    function updateSharePrice(string memory propertyId, uint256 newPrice) external onlyOwner {
        require(propertyShares[propertyId].totalShares > 0, "Property shares do not exist");
        require(newPrice > 0, "Share price must be greater than 0");
        propertyShares[propertyId].sharePrice = newPrice;
    }
    
    /**
     * @dev Update property share status
     * @param propertyId Property identifier
     * @param isActive New status
     */
    function updateShareStatus(string memory propertyId, bool isActive) external onlyOwner {
        require(propertyShares[propertyId].totalShares > 0, "Property shares do not exist");
        propertyShares[propertyId].isActive = isActive;
    }
    
    /**
     * @dev Withdraw contract balance (for property owners)
     * @param propertyId Property identifier
     */
    function withdrawPropertyFunds(string memory propertyId) external {
        PropertyShare memory share = propertyShares[propertyId];
        require(share.propertyOwner == msg.sender, "Only property owner can withdraw");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        payable(share.propertyOwner).transfer(balance);
    }
    
    /**
     * @dev Emergency withdraw (owner only)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Check if property shares exist
     * @param propertyId Property identifier
     * @return bool True if shares exist
     */
    function propertySharesExist(string memory propertyId) external view returns (bool) {
        return propertyShares[propertyId].totalShares > 0;
    }
}
