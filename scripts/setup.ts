// scripts/setup.ts
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("--- E-co.lab CSA Boilerplate Setup ---");
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
  console.log("1. Edit your `.env` file with your private key and RPC URL.");
  console.log(`2. Fund your deployer address on the ${network} network.`);
  console.log(`3. Run the deployment script: npx hardhat run scripts/deploy-csa.ts --network ${network}`);
  
  rl.close();
}

main().catch(error => {
  console.error(error);
  rl.close();
  process.exitCode = 1;
});