// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title EscrowContract
 * @dev A professional, unbiased smart contract for managing escrow accounts
 *      Supports both full payment and milestone-based payment structures
 * @author ArisPortal
 */

contract EscrowContract {
    // State Variables
    address public immutable owner;
    uint256 public escrowCount;
    
    // Escrow Status Enum
    enum EscrowStatus {
        Pending,      // 0 - Waiting for deposit
        Active,       // 1 - Funds deposited
        Partial,      // 2 - Partial release (milestone)
        Completed,    // 3 - All funds released
        Cancelled,    // 4 - Cancelled and refunded
        Disputed      // 5 - Under dispute
    }
    
    // Payment Type Enum
    enum PaymentType {
        Full,         // 0 - One-time full payment
        Milestone     // 1 - Milestone-based payment
    }
    
    // Escrow Struct
    struct Escrow {
        uint256 escrowId;
        string title;
        address payer;           // Party depositing funds
        address payee;           // Party receiving funds
        uint256 totalAmount;     // Total escrow amount
        uint256 releasedAmount;  // Amount released so far
        EscrowStatus status;
        PaymentType paymentType;
        uint256 releaseDate;     // Timestamp for release date
        string terms;            // Terms and conditions
        uint256 createdAt;
        uint256 completedAt;
        bool isActive;
    }
    
    // Milestone Struct
    struct Milestone {
        uint256 milestoneNumber;
        string description;
        uint256 amount;
        uint256 completionDate;
        bool completed;
        uint256 completedAt;
    }
    
    // Mappings
    mapping(uint256 => Escrow) public escrows;
    mapping(uint256 => Milestone[]) public milestones;
    mapping(address => uint256[]) public userEscrows;
    mapping(address => bool) public authorizedAdmins;
    
    // Events
    event EscrowCreated(
        uint256 indexed escrowId,
        address indexed payer,
        address indexed payee,
        uint256 amount,
        PaymentType paymentType
    );
    
    event FundsDeposited(
        uint256 indexed escrowId,
        uint256 amount,
        address indexed depositor
    );
    
    event PaymentReleased(
        uint256 indexed escrowId,
        uint256 amount,
        address indexed payee
    );
    
    event MilestoneCompleted(
        uint256 indexed escrowId,
        uint256 indexed milestoneNumber,
        uint256 amount
    );
    
    event EscrowCompleted(
        uint256 indexed escrowId,
        uint256 totalAmount
    );
    
    event EscrowCancelled(
        uint256 indexed escrowId,
        address indexed payer,
        uint256 refundedAmount
    );
    
    event DisputeRaised(
        uint256 indexed escrowId,
        address indexed raisedBy
    );
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAdmin() {
        require(
            msg.sender == owner || authorizedAdmins[msg.sender],
            "Only admin can call this function"
        );
        _;
    }
    
    modifier validEscrow(uint256 _escrowId) {
        require(escrows[_escrowId].escrowId != 0, "Escrow does not exist");
        require(escrows[_escrowId].isActive, "Escrow is not active");
        _;
    }
    
    modifier onlyParty(uint256 _escrowId) {
        require(
            msg.sender == escrows[_escrowId].payer || 
            msg.sender == escrows[_escrowId].payee,
            "Only parties to escrow can call this function"
        );
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        authorizedAdmins[msg.sender] = true;
        escrowCount = 0;
    }
    
    /**
     * @dev Create a new escrow account
     * @param _title Title/description of the transaction
     * @param _payee Address of the payee (receiver)
     * @param _totalAmount Total amount to be escrowed
     * @param _paymentType Type of payment (Full or Milestone)
     * @param _releaseDate Timestamp for release date (0 if manual release)
     * @param _terms Terms and conditions as string
     */
    function createEscrow(
        string memory _title,
        address _payee,
        uint256 _totalAmount,
        PaymentType _paymentType,
        uint256 _releaseDate,
        string memory _terms
    ) external returns (uint256) {
        require(_payee != address(0), "Invalid payee address");
        require(_totalAmount > 0, "Amount must be greater than zero");
        require(_payee != msg.sender, "Payee cannot be the same as payer");
        
        escrowCount++;
        
        escrows[escrowCount] = Escrow({
            escrowId: escrowCount,
            title: _title,
            payer: msg.sender,
            payee: _payee,
            totalAmount: _totalAmount,
            releasedAmount: 0,
            status: EscrowStatus.Pending,
            paymentType: _paymentType,
            releaseDate: _releaseDate,
            terms: _terms,
            createdAt: block.timestamp,
            completedAt: 0,
            isActive: true
        });
        
        userEscrows[msg.sender].push(escrowCount);
        userEscrows[_payee].push(escrowCount);
        
        emit EscrowCreated(escrowCount, msg.sender, _payee, _totalAmount, _paymentType);
        
        return escrowCount;
    }
    
    /**
     * @dev Add milestones to an escrow
     * @param _escrowId The escrow ID
     * @param _descriptions Array of milestone descriptions
     * @param _amounts Array of milestone amounts
     * @param _completionDates Array of completion dates
     */
    function addMilestones(
        uint256 _escrowId,
        string[] memory _descriptions,
        uint256[] memory _amounts,
        uint256[] memory _completionDates
    ) external validEscrow(_escrowId) onlyParty(_escrowId) {
        require(
            escrows[_escrowId].paymentType == PaymentType.Milestone,
            "Escrow is not milestone-based"
        );
        require(
            _descriptions.length == _amounts.length && 
            _amounts.length == _completionDates.length,
            "Arrays length mismatch"
        );
        
        uint256 totalMilestoneAmount = 0;
        
        for (uint256 i = 0; i < _amounts.length; i++) {
            require(_amounts[i] > 0, "Milestone amount must be greater than zero");
            totalMilestoneAmount += _amounts[i];
            
            milestones[_escrowId].push(Milestone({
                milestoneNumber: milestones[_escrowId].length + 1,
                description: _descriptions[i],
                amount: _amounts[i],
                completionDate: _completionDates[i],
                completed: false,
                completedAt: 0
            }));
        }
        
        require(
            totalMilestoneAmount == escrows[_escrowId].totalAmount,
            "Milestone amounts must equal total amount"
        );
    }
    
    /**
     * @dev Deposit funds into escrow
     * @param _escrowId The escrow ID
     */
    function depositFunds(uint256 _escrowId) 
        external 
        payable 
        validEscrow(_escrowId) 
    {
        require(
            msg.sender == escrows[_escrowId].payer,
            "Only payer can deposit funds"
        );
        require(
            escrows[_escrowId].status == EscrowStatus.Pending,
            "Escrow is not in pending status"
        );
        require(
            msg.value == escrows[_escrowId].totalAmount,
            "Amount must equal total escrow amount"
        );
        
        escrows[_escrowId].status = EscrowStatus.Active;
        
        emit FundsDeposited(_escrowId, msg.value, msg.sender);
    }
    
    /**
     * @dev Release full payment (for Full payment type)
     * @param _escrowId The escrow ID
     */
    function releasePayment(uint256 _escrowId) 
        external 
        validEscrow(_escrowId) 
    {
        require(
            escrows[_escrowId].paymentType == PaymentType.Full,
            "Use releaseMilestone for milestone escrows"
        );
        require(
            escrows[_escrowId].status == EscrowStatus.Active,
            "Escrow must be active"
        );
        require(
            escrows[_escrowId].releaseDate == 0 || 
            block.timestamp >= escrows[_escrowId].releaseDate,
            "Release date not reached"
        );
        
        uint256 amount = escrows[_escrowId].totalAmount;
        escrows[_escrowId].releasedAmount = amount;
        escrows[_escrowId].status = EscrowStatus.Completed;
        escrows[_escrowId].completedAt = block.timestamp;
        
        (bool success, ) = escrows[_escrowId].payee.call{value: amount}("");
        require(success, "Payment transfer failed");
        
        emit PaymentReleased(_escrowId, amount, escrows[_escrowId].payee);
        emit EscrowCompleted(_escrowId, amount);
    }
    
    /**
     * @dev Release milestone payment
     * @param _escrowId The escrow ID
     * @param _milestoneNumber The milestone number to release
     */
    function releaseMilestone(uint256 _escrowId, uint256 _milestoneNumber)
        external
        validEscrow(_escrowId)
        onlyAdmin()
    {
        require(
            escrows[_escrowId].paymentType == PaymentType.Milestone,
            "Escrow is not milestone-based"
        );
        require(
            _milestoneNumber > 0 && 
            _milestoneNumber <= milestones[_escrowId].length,
            "Invalid milestone number"
        );
        
        Milestone storage milestone = milestones[_escrowId][_milestoneNumber - 1];
        require(!milestone.completed, "Milestone already completed");
        
        milestone.completed = true;
        milestone.completedAt = block.timestamp;
        
        escrows[_escrowId].releasedAmount += milestone.amount;
        
        if (escrows[_escrowId].releasedAmount == escrows[_escrowId].totalAmount) {
            escrows[_escrowId].status = EscrowStatus.Completed;
            escrows[_escrowId].completedAt = block.timestamp;
        } else {
            escrows[_escrowId].status = EscrowStatus.Partial;
        }
        
        (bool success, ) = escrows[_escrowId].payee.call{value: milestone.amount}("");
        require(success, "Milestone payment transfer failed");
        
        emit MilestoneCompleted(_escrowId, _milestoneNumber, milestone.amount);
        
        if (escrows[_escrowId].status == EscrowStatus.Completed) {
            emit EscrowCompleted(_escrowId, escrows[_escrowId].totalAmount);
        }
    }
    
    /**
     * @dev Cancel escrow and refund to payer
     * @param _escrowId The escrow ID
     */
    function cancelEscrow(uint256 _escrowId) 
        external 
        validEscrow(_escrowId) 
    {
        require(
            msg.sender == escrows[_escrowId].payer || 
            msg.sender == owner,
            "Only payer or owner can cancel"
        );
        require(
            escrows[_escrowId].status == EscrowStatus.Pending ||
            escrows[_escrowId].status == EscrowStatus.Active ||
            escrows[_escrowId].status == EscrowStatus.Partial,
            "Cannot cancel escrow in current status"
        );
        
        uint256 refundAmount = escrows[_escrowId].totalAmount - 
                              escrows[_escrowId].releasedAmount;
        
        escrows[_escrowId].status = EscrowStatus.Cancelled;
        escrows[_escrowId].isActive = false;
        escrows[_escrowId].completedAt = block.timestamp;
        
        if (refundAmount > 0) {
            (bool success, ) = escrows[_escrowId].payer.call{value: refundAmount}("");
            require(success, "Refund transfer failed");
        }
        
        emit EscrowCancelled(_escrowId, escrows[_escrowId].payer, refundAmount);
    }
    
    /**
     * @dev Raise a dispute on an escrow
     * @param _escrowId The escrow ID
     */
    function raiseDispute(uint256 _escrowId) 
        external 
        validEscrow(_escrowId) 
        onlyParty(_escrowId) 
    {
        require(
            escrows[_escrowId].status == EscrowStatus.Active ||
            escrows[_escrowId].status == EscrowStatus.Partial,
            "Cannot raise dispute in current status"
        );
        
        escrows[_escrowId].status = EscrowStatus.Disputed;
        
        emit DisputeRaised(_escrowId, msg.sender);
    }
    
    /**
     * @dev Resolve dispute (only by admin)
     * @param _escrowId The escrow ID
     * @param _favorPayee If true, funds go to payee; if false, refund to payer
     */
    function resolveDispute(uint256 _escrowId, bool _favorPayee)
        external
        validEscrow(_escrowId)
        onlyAdmin()
    {
        require(
            escrows[_escrowId].status == EscrowStatus.Disputed,
            "Escrow is not in disputed status"
        );
        
        uint256 remainingAmount = escrows[_escrowId].totalAmount - 
                                 escrows[_escrowId].releasedAmount;
        
        if (_favorPayee) {
            (bool success, ) = escrows[_escrowId].payee.call{value: remainingAmount}("");
            require(success, "Dispute resolution payment failed");
            
            escrows[_escrowId].status = EscrowStatus.Completed;
            escrows[_escrowId].releasedAmount = escrows[_escrowId].totalAmount;
        } else {
            (bool success, ) = escrows[_escrowId].payer.call{value: remainingAmount}("");
            require(success, "Dispute resolution refund failed");
            
            escrows[_escrowId].status = EscrowStatus.Cancelled;
        }
        
        escrows[_escrowId].isActive = false;
        escrows[_escrowId].completedAt = block.timestamp;
    }
    
    /**
     * @dev Authorize an admin account
     * @param _admin Address to authorize
     */
    function authorizeAdmin(address _admin) external onlyOwner {
        authorizedAdmins[_admin] = true;
    }
    
    /**
     * @dev Revoke admin authorization
     * @param _admin Address to revoke
     */
    function revokeAdmin(address _admin) external onlyOwner {
        authorizedAdmins[_admin] = false;
    }
    
    // View Functions
    
    /**
     * @dev Get escrow details
     * @param _escrowId The escrow ID
     * @return Escrow struct
     */
    function getEscrow(uint256 _escrowId) 
        external 
        view 
        returns (Escrow memory) 
    {
        return escrows[_escrowId];
    }
    
    /**
     * @dev Get all milestones for an escrow
     * @param _escrowId The escrow ID
     * @return Array of milestones
     */
    function getMilestones(uint256 _escrowId) 
        external 
        view 
        returns (Milestone[] memory) 
    {
        return milestones[_escrowId];
    }
    
    /**
     * @dev Get all escrows for a user
     * @param _user User address
     * @return Array of escrow IDs
     */
    function getUserEscrows(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userEscrows[_user];
    }
    
    /**
     * @dev Get contract balance
     * @return Balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Emergency withdraw (only owner, for rescue purposes)
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Emergency withdraw failed");
    }
}
