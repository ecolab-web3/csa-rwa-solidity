# CSA as RWA: A Smart Contract Prototype in Solidity

![Language](https://img.shields.io/badge/Language-Solidity-orange)
![Blockchain](https://img.shields.io/badge/Blockchain-Avalanche_Fuji-red)
![Verified Contract](https://img.shields.io/badge/Contract-Verified-green)
![License](https://img.shields.io/badge/License-MIT-blue)

This repository contains a smart contract prototype demonstrating how a **Community Supported Agriculture (CSA)** program can be tokenized as a **Real World Asset (RWA)** on the blockchain.

This project has been successfully deployed to the **Avalanche Fuji testnet** and includes a live DApp for interaction.

## Live Demo & Contract

You can interact with the live version of this project using the DApp prototypes below. Please make sure your wallet (e.g., MetaMask) is connected to the **Avalanche Fuji Testnet**.

### DApp Prototypes

*   **[➡️ Interact with the DApp (English Version)](https://ecolab-web3.github.io/csa-rwa-solidity/index-en.html)**
*   **[➡️ Interaja com o DApp (Versão em Português)](https://ecolab-web3.github.io/csa-rwa-solidity/index-pt_br.html)**

### Contract Details

*   **Network:** `Avalanche Fuji Testnet`
*   **Contract Address:** [`0x1c96D0701B1bd9c3CC24fAcca3A4d68ED8Bfb1AF`](https://testnet.snowtrace.io/address/0x1c96D0701B1bd9c3CC24fAcca3A4d68ED8Bfb1AF)
*   **Verification:** The source code is verified. You can read and interact with it directly on **[Snowtrace](https://testnet.snowtrace.io/address/0x1c96D0701B1bd9c3CC24fAcca3A4d68ED8Bfb1AF#code)**.

---

## Overview

The core idea is to transform a CSA "membership share" into an **ERC721Enumerable Non-Fungible Token (NFT)**. Each NFT represents a member's right to receive a weekly product box for a specific harvest season, turning this right into a liquid, transferable, and transparent digital asset.

### Key Concepts Implemented

*   **Season Management**: The contract owner (the farmer) can create new harvest seasons, defining the price, maximum capacity, and duration.
*   **Share Purchase (Minting)**: Community members can purchase a share by sending the correct payment, which "mints" an NFT that proves their membership.
*   **Weekly Redemption**: The NFT owner can redeem their weekly product box. The contract prevents double redemptions within the same week.
*   **Automated Token ID Discovery**: The DApp automatically detects if a user is already a member and retrieves their Token ID, providing a seamless user experience.
*   **Transferability**: As a standard NFT, the membership share can be sold or transferred to someone else on any secondary marketplace.
*   **Security and Transparency**: The contract is `Ownable` and the code is publicly verified.

---

## Local Development & Testing

For those who wish to fork or test the project locally, the original instructions for using Remix IDE are still relevant.

1.  Clone this repository into a Remix IDE workspace.
2.  Open the `contracts/CSA_RWA.sol` file.
3.  Compile the contract using a Solidity compiler version `^0.8.20`.
4.  Deploy to a local Remix VM or a testnet of your choice.

## Contract Structure

*   **`Season` (struct)**: Stores the details for each harvest season.
*   **`seasons` (array)**: Holds all created seasons.
*   **`tokenIdToSeasonId` (mapping)**: Links each NFT to its corresponding season.
*   **`weeklyRedemptions` (mapping)**: Tracks weekly box redemptions to prevent duplicates.

## Next Steps

This is a functional prototype. For a production-ready project, the next steps would include:

*   Developing a comprehensive test suite (using Hardhat or Foundry).
*   Creating deployment scripts.
*   Enhancing the DApp with a more robust UI/UX.
*   Undergoing a professional security audit.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
