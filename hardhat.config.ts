import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config"; // Imports dotenv to load environment variables

// Safely load the private key
const privateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Configuration for the Avalanche Fuji testnet
    fuji: {
      url: process.env.FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc",
      // Only add accounts if a private key is provided in the .env file
      accounts: privateKey !== undefined ? [privateKey] : [],
      chainId: 43113,
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: "snowtrace", // Placeholder is sufficient
    },
  },
};

// --- Our Custom Setup Task ---
// (It now lives inside the config file for better organization)
task("setup", "Generates the necessary deployment scripts for the project")
  .setAction(async () => {
    const { exec } = require("child_process");
    console.log("Running interactive setup to generate deployment files...");
    const setupScript = exec("ts-node scripts/setup.ts");
    
    setupScript.stdout.on('data', (data: any) => {
        console.log(data);
    });
    setupScript.stderr.on('data', (data: any) => {
        console.error(data);
    });
});


export default config;