# CSA as RWA: A Smart Contract Prototype in Solidity

![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-blue)
![Language](https://img.shields.io/badge/Language-Solidity-orange)
![License](https://img.shields.io/badge/License-MIT-green)

This repository contains a smart contract prototype demonstrating how a **Community Supported Agriculture (CSA)** program can be tokenized as a **Real World Asset (RWA)** on the blockchain.

## Overview

The core idea is to transform a CSA "membership share" into an **ERC721 Non-Fungible Token (NFT)**. Each NFT represents a member's right to receive food baskets for a specific harvest season, turning this right into a liquid, transferable, and transparent digital asset.

### Key Concepts Implemented

*   **Season Management**: The contract owner (the farmer) can create new harvest seasons, defining the price, maximum capacity, and duration.
*   **Share Purchase (Minting)**: Community members can purchase a share by sending the correct payment, which "mints" an NFT that proves their membership.
*   **Weekly Redemption**: The NFT owner can "redeem" their weekly basket. The contract prevents double redemptions within the same week.
*   **Transferability**: As a standard NFT, the membership share can be sold or transferred to someone else on any secondary marketplace.
*   **Security and Transparency**: The contract is managed using OpenZeppelin's `Ownable` standard, and all transactions are publicly verifiable on-chain.

## Contract Structure

*   **`Season` (struct)**: Stores the details for each harvest season.
*   **`seasons` (array)**: Holds all created seasons.
*   **`tokenIdToSeasonId` (mapping)**: Links each NFT to its corresponding season.
*   **`weeklyRedemptions` (mapping)**: Tracks weekly basket redemptions to prevent duplicates.

## Next Steps

This is a basic prototype. For a production-ready project, the next steps would include:

*   Developing a comprehensive test suite (using Hardhat or Foundry).
*   Creating deployment scripts.
*   Building a user-friendly frontend interface to interact with the contract.
*   Undergoing a professional security audit.

## License

This project is licensed under the MIT License. See the [LICENSE] file for details.