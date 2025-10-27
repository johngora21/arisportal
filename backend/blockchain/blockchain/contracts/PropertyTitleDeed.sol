// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PropertyTitleDeed
 * @dev ERC-721 NFT contract for digital title deeds
 * Each property gets a unique NFT representing its title deed
 */
contract PropertyTitleDeed is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    
    // Property information stored on-chain
    struct PropertyInfo {
        string propertyId;        // Unique property identifier
        string location;         // Property location
        uint256 totalValue;      // Total property value
        uint256 totalShares;     // Total number of shares
        address currentOwner;    // Current owner address
        bool isActive;          // Whether property is active for trading
        uint256 createdAt;      // Timestamp when property was created
    }
    
    // Mapping from token ID to property information
    mapping(uint256 => PropertyInfo) public properties;
    
    // Mapping from property ID to token ID
    mapping(string => uint256) public propertyIdToTokenId;
    
    // Events
    event PropertyRegistered(
        uint256 indexed tokenId,
        string indexed propertyId,
        address indexed owner,
        string location,
        uint256 totalValue,
        uint256 totalShares
    );
    
    event PropertyTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        string propertyId
    );
    
    constructor() ERC721("Property Title Deed", "PTD") Ownable(msg.sender) {}
    
    /**
     * @dev Register a new property and mint its title deed NFT
     * @param propertyId Unique identifier for the property
     * @param location Property location
     * @param totalValue Total value of the property
     * @param totalShares Total number of shares available
     * @param metadataURI Metadata URI for the NFT
     * @param initialOwner Initial owner of the property
     */
    function registerProperty(
        string memory propertyId,
        string memory location,
        uint256 totalValue,
        uint256 totalShares,
        string memory metadataURI,
        address initialOwner
    ) external onlyOwner returns (uint256) {
        require(propertyIdToTokenId[propertyId] == 0, "Property already registered");
        require(totalValue > 0, "Property value must be greater than 0");
        require(totalShares > 0, "Total shares must be greater than 0");
        require(initialOwner != address(0), "Invalid owner address");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        // Store property information
        properties[tokenId] = PropertyInfo({
            propertyId: propertyId,
            location: location,
            totalValue: totalValue,
            totalShares: totalShares,
            currentOwner: initialOwner,
            isActive: true,
            createdAt: block.timestamp
        });
        
        // Map property ID to token ID
        propertyIdToTokenId[propertyId] = tokenId;
        
        // Mint NFT to initial owner
        _safeMint(initialOwner, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        emit PropertyRegistered(
            tokenId,
            propertyId,
            initialOwner,
            location,
            totalValue,
            totalShares
        );
        
        return tokenId;
    }
    
    /**
     * @dev Transfer property ownership (overrides ERC721 transfer)
     * @param to New owner
     * @param tokenId Token ID of the property
     */
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address previousOwner = super._update(to, tokenId, auth);
        
        if (to != address(0)) {
            // Update property owner information
            properties[tokenId].currentOwner = to;
            
            if (previousOwner != address(0)) {
                emit PropertyTransferred(
                    tokenId,
                    previousOwner,
                    to,
                    properties[tokenId].propertyId
                );
            }
        }
        
        return previousOwner;
    }
    
    /**
     * @dev Get property information by token ID
     * @param tokenId Token ID
     * @return PropertyInfo struct containing property details
     */
    function getPropertyInfo(uint256 tokenId) external view returns (PropertyInfo memory) {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        return properties[tokenId];
    }
    
    /**
     * @dev Get property information by property ID
     * @param propertyId Property identifier
     * @return PropertyInfo struct containing property details
     */
    function getPropertyInfoById(string memory propertyId) external view returns (PropertyInfo memory) {
        uint256 tokenId = propertyIdToTokenId[propertyId];
        require(tokenId > 0, "Property not found");
        return properties[tokenId];
    }
    
    /**
     * @dev Update property status (active/inactive)
     * @param tokenId Token ID
     * @param isActive New status
     */
    function updatePropertyStatus(uint256 tokenId, bool isActive) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        properties[tokenId].isActive = isActive;
    }
    
    /**
     * @dev Check if property exists
     * @param propertyId Property identifier
     * @return bool True if property exists
     */
    function propertyExists(string memory propertyId) external view returns (bool) {
        return propertyIdToTokenId[propertyId] > 0;
    }
    
    /**
     * @dev Get total number of registered properties
     * @return uint256 Total count
     */
    function getTotalProperties() external view returns (uint256) {
        return _tokenIdCounter;
    }
    
    // Required overrides for multiple inheritance
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
