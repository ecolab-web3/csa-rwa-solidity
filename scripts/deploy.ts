// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying CSA_RWA contract with the account:", deployer.address);

  const CSARWA = await ethers.getContractFactory("CSA_RWA");
  
  const csaRwa = await CSARWA.deploy(deployer.address);
  await csaRwa.waitForDeployment();
  
  const contractAddress = await csaRwa.getAddress();
  console.log("✅ CSA_RWA contract deployed to:", contractAddress);

  console.log("\nTo verify on Fuji, run:");
  console.log(`npx hardhat verify --network fuji ${contractAddress} "${deployer.address}"`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});