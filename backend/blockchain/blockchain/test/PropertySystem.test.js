const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Real Estate Blockchain System", function () {
    let titleDeedContract;
    let sharesContract;
    let paymentSplitterContract;
    let escrowContract;
    let owner;
    let buyer;
    let seller;
    let stakeholder1;
    let stakeholder2;
    
    const PROPERTY_ID = "PROP-001";
    const LOCATION = "Dar es Salaam, Tanzania";
    const TOTAL_VALUE = ethers.parseEther("1000000"); // 1M TZS equivalent
    const TOTAL_SHARES = 1000;
    const SHARE_PRICE = ethers.parseEther("1000"); // 1000 TZS per share
    const TOKEN_URI = "https://api.example.com/metadata/property-001";
    
    beforeEach(async function () {
        [owner, buyer, seller, stakeholder1, stakeholder2] = await ethers.getSigners();
        
        // Deploy contracts
        const PropertyTitleDeed = await ethers.getContractFactory("PropertyTitleDeed");
        titleDeedContract = await PropertyTitleDeed.deploy();
        
        const PropertyShares = await ethers.getContractFactory("PropertyShares");
        sharesContract = await PropertyShares.deploy();
        
        const PropertyPaymentSplitter = await ethers.getContractFactory("PropertyPaymentSplitter");
        paymentSplitterContract = await PropertyPaymentSplitter.deploy();
        
        const PropertyEscrow = await ethers.getContractFactory("PropertyEscrow");
        escrowContract = await PropertyEscrow.deploy(
            await titleDeedContract.getAddress(),
            await sharesContract.getAddress(),
            await paymentSplitterContract.getAddress()
        );
    });
    
    describe("Property Registration", function () {
        it("Should register a property successfully", async function () {
            const stakeholders = [stakeholder1.address, stakeholder2.address];
            const percentages = [1000, 9000]; // 10% and 90%
            const roles = ["Government", "Seller"];
            
            await escrowContract.registerProperty(
                PROPERTY_ID,
                LOCATION,
                TOTAL_VALUE,
                TOTAL_SHARES,
                SHARE_PRICE,
                TOKEN_URI,
                stakeholders,
                percentages,
                roles,
                seller.address
            );
            
            // Verify title deed
            const propertyInfo = await titleDeedContract.getPropertyInfoById(PROPERTY_ID);
            expect(propertyInfo.propertyId).to.equal(PROPERTY_ID);
            expect(propertyInfo.location).to.equal(LOCATION);
            expect(propertyInfo.totalValue).to.equal(TOTAL_VALUE);
            expect(propertyInfo.currentOwner).to.equal(seller.address);
            
            // Verify shares
            const shareInfo = await sharesContract.getPropertyShares(PROPERTY_ID);
            expect(shareInfo.totalShares).to.equal(TOTAL_SHARES);
            expect(shareInfo.sharePrice).to.equal(SHARE_PRICE);
            expect(shareInfo.propertyOwner).to.equal(seller.address);
            
            // Verify stakeholders
            const stakeholderCount = await paymentSplitterContract.getStakeholderCount(PROPERTY_ID);
            expect(stakeholderCount).to.equal(2);
        });
    });
    
    describe("Property Share Trading", function () {
        beforeEach(async function () {
            const stakeholders = [stakeholder1.address, stakeholder2.address];
            const percentages = [1000, 9000]; // 10% and 90%
            const roles = ["Government", "Seller"];
            
            await escrowContract.registerProperty(
                PROPERTY_ID,
                LOCATION,
                TOTAL_VALUE,
                TOTAL_SHARES,
                SHARE_PRICE,
                TOKEN_URI,
                stakeholders,
                percentages,
                roles,
                seller.address
            );
        });
        
        it("Should allow purchasing shares", async function () {
            const sharesToBuy = 100;
            const totalCost = sharesToBuy * SHARE_PRICE;
            
            await sharesContract.connect(buyer).purchaseShares(
                PROPERTY_ID,
                sharesToBuy,
                { value: totalCost }
            );
            
            const buyerBalance = await sharesContract.balanceOf(buyer.address);
            expect(buyerBalance).to.equal(sharesToBuy);
            
            const circulatingSupply = await sharesContract.propertyCirculatingSupply(PROPERTY_ID);
            expect(circulatingSupply).to.equal(sharesToBuy);
        });
        
        it("Should allow selling shares back", async function () {
            const sharesToBuy = 100;
            const totalCost = sharesToBuy * SHARE_PRICE;
            
            // First purchase shares
            await sharesContract.connect(buyer).purchaseShares(
                PROPERTY_ID,
                sharesToBuy,
                { value: totalCost }
            );
            
            // Then sell them back
            await sharesContract.connect(buyer).sellShares(PROPERTY_ID, sharesToBuy);
            
            const buyerBalance = await sharesContract.balanceOf(buyer.address);
            expect(buyerBalance).to.equal(0);
            
            const circulatingSupply = await sharesContract.propertyCirculatingSupply(PROPERTY_ID);
            expect(circulatingSupply).to.equal(0);
        });
    });
    
    describe("Payment Distribution", function () {
        beforeEach(async function () {
            const stakeholders = [stakeholder1.address, stakeholder2.address];
            const percentages = [1000, 9000]; // 10% and 90%
            const roles = ["Government", "Seller"];
            
            await escrowContract.registerProperty(
                PROPERTY_ID,
                LOCATION,
                TOTAL_VALUE,
                TOTAL_SHARES,
                SHARE_PRICE,
                TOKEN_URI,
                stakeholders,
                percentages,
                roles,
                seller.address
            );
        });
        
        it("Should distribute payments correctly", async function () {
            const paymentAmount = ethers.parseEther("10000");
            const initialBalance1 = await ethers.provider.getBalance(stakeholder1.address);
            const initialBalance2 = await ethers.provider.getBalance(stakeholder2.address);
            
            await paymentSplitterContract.connect(buyer).distributePropertyPayment(
                PROPERTY_ID,
                { value: paymentAmount }
            );
            
            const finalBalance1 = await ethers.provider.getBalance(stakeholder1.address);
            const finalBalance2 = await ethers.provider.getBalance(stakeholder2.address);
            
            // Stakeholder1 should receive 10% (1000 TZS)
            expect(finalBalance1 - initialBalance1).to.equal(ethers.parseEther("1000"));
            
            // Stakeholder2 should receive 90% (9000 TZS)
            expect(finalBalance2 - initialBalance2).to.equal(ethers.parseEther("9000"));
        });
    });
    
    describe("Escrow System", function () {
        beforeEach(async function () {
            const stakeholders = [stakeholder1.address, stakeholder2.address];
            const percentages = [1000, 9000]; // 10% and 90%
            const roles = ["Government", "Seller"];
            
            await escrowContract.registerProperty(
                PROPERTY_ID,
                LOCATION,
                TOTAL_VALUE,
                TOTAL_SHARES,
                SHARE_PRICE,
                TOKEN_URI,
                stakeholders,
                percentages,
                roles,
                seller.address
            );
        });
        
        it("Should create escrow successfully", async function () {
            const sharesToBuy = 100;
            const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
            const paymentReference = "PAY-REF-001";
            
            const tx = await escrowContract.createEscrow(
                PROPERTY_ID,
                buyer.address,
                sharesToBuy,
                deadline,
                paymentReference
            );
            
            const receipt = await tx.wait();
            const escrowCreatedEvent = receipt.logs.find(
                log => log.fragment?.name === "EscrowCreated"
            );
            
            expect(escrowCreatedEvent).to.not.be.undefined;
            
            const hasActiveEscrow = await escrowContract.hasActiveEscrow(PROPERTY_ID);
            expect(hasActiveEscrow).to.be.true;
        });
        
        it("Should complete escrow after payment confirmation", async function () {
            const sharesToBuy = 100;
            const deadline = Math.floor(Date.now() / 1000) + 3600;
            const paymentReference = "PAY-REF-001";
            
            // Create escrow
            const tx = await escrowContract.createEscrow(
                PROPERTY_ID,
                buyer.address,
                sharesToBuy,
                deadline,
                paymentReference
            );
            
            const receipt = await tx.wait();
            const escrowCreatedEvent = receipt.logs.find(
                log => log.fragment?.name === "EscrowCreated"
            );
            const escrowId = escrowCreatedEvent.args.escrowId;
            
            // Complete escrow
            await escrowContract.confirmPaymentAndCompleteEscrow(escrowId);
            
            const escrowInfo = await escrowContract.getEscrowInfo(escrowId);
            expect(escrowInfo.isCompleted).to.be.true;
            expect(escrowInfo.isActive).to.be.false;
            
            // Verify shares were transferred
            const buyerBalance = await sharesContract.balanceOf(buyer.address);
            expect(buyerBalance).to.equal(sharesToBuy);
        });
    });
});
