// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PropertyPaymentSplitter
 * @dev Automatic payment distribution for property transactions
 * Distributes payments to stakeholders based on predefined percentages
 */
contract PropertyPaymentSplitter is Ownable, ReentrancyGuard {
    
    // Stakeholder information
    struct Stakeholder {
        address wallet;          // Stakeholder wallet address
        string role;            // Role description (Government, Broker, Seller, Platform)
        uint256 percentage;    // Percentage share (in basis points, e.g., 1000 = 10%)
        bool isActive;         // Whether stakeholder is active
    }
    
    // Mapping from property ID to stakeholders
    mapping(string => Stakeholder[]) public propertyStakeholders;
    
    // Mapping from property ID to total percentage
    mapping(string => uint256) public propertyTotalPercentage;
    
    // Events
    event StakeholdersSet(
        string indexed propertyId,
        address[] stakeholders,
        uint256[] percentages,
        string[] roles
    );
    
    event PaymentDistributed(
        string indexed propertyId,
        uint256 totalAmount,
        address[] recipients,
        uint256[] amounts
    );
    
    event StakeholderUpdated(
        string indexed propertyId,
        address indexed stakeholder,
        uint256 newPercentage,
        string role
    );
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Set stakeholders for a property
     * @param propertyId Property identifier
     * @param stakeholders Array of stakeholder addresses
     * @param percentages Array of percentages (in basis points)
     * @param roles Array of role descriptions
     */
    function setPropertyStakeholders(
        string memory propertyId,
        address[] memory stakeholders,
        uint256[] memory percentages,
        string[] memory roles
    ) external onlyOwner {
        require(stakeholders.length == percentages.length, "Arrays length mismatch");
        require(stakeholders.length == roles.length, "Arrays length mismatch");
        require(stakeholders.length > 0, "At least one stakeholder required");
        
        // Clear existing stakeholders
        delete propertyStakeholders[propertyId];
        propertyTotalPercentage[propertyId] = 0;
        
        uint256 totalPercentage = 0;
        
        for (uint256 i = 0; i < stakeholders.length; i++) {
            require(stakeholders[i] != address(0), "Invalid stakeholder address");
            require(percentages[i] > 0, "Percentage must be greater than 0");
            require(percentages[i] <= 10000, "Percentage cannot exceed 100%");
            
            totalPercentage += percentages[i];
            
            propertyStakeholders[propertyId].push(Stakeholder({
                wallet: stakeholders[i],
                role: roles[i],
                percentage: percentages[i],
                isActive: true
            }));
        }
        
        require(totalPercentage == 10000, "Total percentage must equal 100%");
        propertyTotalPercentage[propertyId] = totalPercentage;
        
        emit StakeholdersSet(propertyId, stakeholders, percentages, roles);
    }
    
    /**
     * @dev Distribute payment for a property transaction
     * @param propertyId Property identifier
     */
    function distributePropertyPayment(string memory propertyId) external payable nonReentrant {
        require(msg.value > 0, "No payment to distribute");
        require(propertyStakeholders[propertyId].length > 0, "No stakeholders set for property");
        
        Stakeholder[] memory stakeholders = propertyStakeholders[propertyId];
        address[] memory recipients = new address[](stakeholders.length);
        uint256[] memory amounts = new uint256[](stakeholders.length);
        
        // Calculate amounts for each stakeholder
        for (uint256 i = 0; i < stakeholders.length; i++) {
            if (stakeholders[i].isActive) {
                recipients[i] = stakeholders[i].wallet;
                amounts[i] = (msg.value * stakeholders[i].percentage) / 10000;
            }
        }
        
        // Distribute payments
        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] != address(0) && amounts[i] > 0) {
                payable(recipients[i]).transfer(amounts[i]);
            }
        }
        
        emit PaymentDistributed(propertyId, msg.value, recipients, amounts);
    }
    
    /**
     * @dev Get stakeholders for a property
     * @param propertyId Property identifier
     * @return Stakeholder[] Array of stakeholder information
     */
    function getPropertyStakeholders(string memory propertyId) external view returns (Stakeholder[] memory) {
        return propertyStakeholders[propertyId];
    }
    
    /**
     * @dev Update a specific stakeholder
     * @param propertyId Property identifier
     * @param stakeholderIndex Index of stakeholder to update
     * @param newPercentage New percentage (in basis points)
     * @param newRole New role description
     */
    function updateStakeholder(
        string memory propertyId,
        uint256 stakeholderIndex,
        uint256 newPercentage,
        string memory newRole
    ) external onlyOwner {
        require(stakeholderIndex < propertyStakeholders[propertyId].length, "Invalid stakeholder index");
        require(newPercentage > 0, "Percentage must be greater than 0");
        require(newPercentage <= 10000, "Percentage cannot exceed 100%");
        
        Stakeholder storage stakeholder = propertyStakeholders[propertyId][stakeholderIndex];
        stakeholder.percentage = newPercentage;
        stakeholder.role = newRole;
        
        emit StakeholderUpdated(propertyId, stakeholder.wallet, newPercentage, newRole);
    }
    
    /**
     * @dev Activate/deactivate a stakeholder
     * @param propertyId Property identifier
     * @param stakeholderIndex Index of stakeholder
     * @param isActive New status
     */
    function updateStakeholderStatus(
        string memory propertyId,
        uint256 stakeholderIndex,
        bool isActive
    ) external onlyOwner {
        require(stakeholderIndex < propertyStakeholders[propertyId].length, "Invalid stakeholder index");
        propertyStakeholders[propertyId][stakeholderIndex].isActive = isActive;
    }
    
    /**
     * @dev Get total number of stakeholders for a property
     * @param propertyId Property identifier
     * @return uint256 Number of stakeholders
     */
    function getStakeholderCount(string memory propertyId) external view returns (uint256) {
        return propertyStakeholders[propertyId].length;
    }
    
    /**
     * @dev Check if stakeholders are set for a property
     * @param propertyId Property identifier
     * @return bool True if stakeholders are set
     */
    function hasStakeholders(string memory propertyId) external view returns (bool) {
        return propertyStakeholders[propertyId].length > 0;
    }
    
    /**
     * @dev Calculate payment amount for a stakeholder
     * @param propertyId Property identifier
     * @param stakeholderIndex Index of stakeholder
     * @param totalAmount Total payment amount
     * @return uint256 Stakeholder's share
     */
    function calculateStakeholderShare(
        string memory propertyId,
        uint256 stakeholderIndex,
        uint256 totalAmount
    ) external view returns (uint256) {
        require(stakeholderIndex < propertyStakeholders[propertyId].length, "Invalid stakeholder index");
        
        Stakeholder memory stakeholder = propertyStakeholders[propertyId][stakeholderIndex];
        if (!stakeholder.isActive) return 0;
        
        return (totalAmount * stakeholder.percentage) / 10000;
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
