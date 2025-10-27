const { ethers } = require("hardhat");

async function main() {
    console.log("Deploying Real Estate Blockchain Contracts...");
    
    // Get the contract factories
    const PropertyTitleDeed = await ethers.getContractFactory("PropertyTitleDeed");
    const PropertyShares = await ethers.getContractFactory("PropertyShares");
    const PropertyPaymentSplitter = await ethers.getContractFactory("PropertyPaymentSplitter");
    const PropertyEscrow = await ethers.getContractFactory("PropertyEscrow");
    
    // Deploy contracts
    console.log("Deploying PropertyTitleDeed...");
    const titleDeedContract = await PropertyTitleDeed.deploy();
    await titleDeedContract.waitForDeployment();
    const titleDeedAddress = await titleDeedContract.getAddress();
    console.log("PropertyTitleDeed deployed to:", titleDeedAddress);
    
    console.log("Deploying PropertyShares...");
    const sharesContract = await PropertyShares.deploy();
    await sharesContract.waitForDeployment();
    const sharesAddress = await sharesContract.getAddress();
    console.log("PropertyShares deployed to:", sharesAddress);
    
    console.log("Deploying PropertyPaymentSplitter...");
    const paymentSplitterContract = await PropertyPaymentSplitter.deploy();
    await paymentSplitterContract.waitForDeployment();
    const paymentSplitterAddress = await paymentSplitterContract.getAddress();
    console.log("PropertyPaymentSplitter deployed to:", paymentSplitterAddress);
    
    console.log("Deploying PropertyEscrow...");
    const escrowContract = await PropertyEscrow.deploy(
        titleDeedAddress,
        sharesAddress,
        paymentSplitterAddress
    );
    await escrowContract.waitForDeployment();
    const escrowAddress = await escrowContract.getAddress();
    console.log("PropertyEscrow deployed to:", escrowAddress);
    
    // Save deployment addresses
    const deploymentInfo = {
        network: "hardhat",
        contracts: {
            PropertyTitleDeed: titleDeedAddress,
            PropertyShares: sharesAddress,
            PropertyPaymentSplitter: paymentSplitterAddress,
            PropertyEscrow: escrowAddress
        },
        deployedAt: new Date().toISOString()
    };
    
    console.log("\n=== Deployment Summary ===");
    console.log("PropertyTitleDeed:", titleDeedAddress);
    console.log("PropertyShares:", sharesAddress);
    console.log("PropertyPaymentSplitter:", paymentSplitterAddress);
    console.log("PropertyEscrow:", escrowAddress);
    
    console.log("\n=== Contract Integration ===");
    console.log("Main contract: PropertyEscrow");
    console.log("All contracts are integrated and ready for use!");
    
    return deploymentInfo;
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
