// scripts/setup.ts
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config'; // Load .env file if it exists

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function checkAndCreateEnv() {
  const envPath = path.join(__dirname, '../.env');

  if (fs.existsSync(envPath) && process.env.PRIVATE_KEY && process.env.PRIVATE_KEY.length > 60) {
    console.log("✅ .env file found and configured.");
    return true;
  }

  console.log("\n⚠️  .env file not found or is incomplete.");
  console.log("I will create a `.env.example` file for you now.");

  const envTemplate = `
# RPC URL for Avalanche Fuji Testnet
FUJI_RPC_URL="https://api.avax-test.network/ext/bc/C/rpc"

# Your private key from a TEST wallet (NEVER a main wallet)
# IMPORTANT: It must start with '0x'
PRIVATE_KEY=""
`;
  
  fs.writeFileSync(path.join(__dirname, '../.env.example'), envTemplate.trim());
  
  console.log("\nACTION REQUIRED:");
  console.log("1. I've created a file named `.env.example` in your project root.");
  console.log("2. Please RENAME it to `.env`.");
  console.log("3. Open the new `.env` file and PASTE your test wallet's private key.");
  console.log("4. Save the file and run `npx hardhat setup` again.");

  return false;
}

async function main() {
  console.log("--- E-co.lab Boilerplate Setup ---");

  const isEnvReady = await checkAndCreateEnv();
  if (!isEnvReady) {
    rl.close();
    return;
  }
  
  console.log("This script will generate a deployment script for your CSA project.");

  const contractName = "CSA_RWA"; // The contract we are deploying
  const network = await question("Which network will you deploy to? (e.g., fuji, avalancheMainnet) ");
  
  console.log("\nA deployment script `deploy-csa.ts` will be created.");
  
  const deployScriptContent = `
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying CSA_RWA contract with the account:", deployer.address);

  const CSARWA = await ethers.getContractFactory("${contractName}");
  
  // The constructor of CSA_RWA requires the initial owner's address.
  const csaRwa = await CSARWA.deploy(deployer.address);

  await csaRwa.waitForDeployment();
  
  const contractAddress = await csaRwa.getAddress();
  console.log("✅ CSA_RWA contract deployed to:", contractAddress);

  console.log("\\nTo verify your contract, run:");
  console.log(\`npx hardhat verify --network ${network} \${contractAddress} "\${deployer.address}"\`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
`;

  const scriptPath = path.join(__dirname, 'deploy-csa.ts');
  fs.writeFileSync(scriptPath, deployScriptContent.trim());
  
  console.log("\n✅ Successfully created `scripts/deploy-csa.ts`!");
  console.log("\nNext steps:");
  console.log(`1. Fund your deployer address on the ${network} network.`);
  console.log(`2. Run the deployment script: npx hardhat run scripts/deploy-csa.ts --network ${network}`);
  
  console.log("\nSetup complete! You can now proceed with the deployment.");

  rl.close();
}

main().catch(error => {
  console.error(error);
  rl.close();
  process.exitCode = 1;
});