# CSA as RWA: A Smart Contract Prototype in Solidity

![Language](https://img.shields.io/badge/Language-Solidity-orange)
![Blockchain](https://img.shields.io/badge/Blockchain-Avalanche_Fuji-red)
![Verified Contract](https://img.shields.io/badge/Contract-Verified-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Solidity Version](https://img.shields.io/badge/Solidity-0.8.20-yellow.svg)
![Framework](https://img.shields.io/badge/Framework-Hardhat-purple.svg)

## Quick Start

This repository is a Hardhat-based boilerplate. To get started and scaffold your own project from this template, follow these steps:

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/ecolab-web3/csa-rwa-solidity.git
    cd csa-rwa-solidity
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Run the setup command:**
    ```sh
    npx hardhat setup
    ```
This interactive script will configure the project for you, creating your initial smart contract and preparing the environment.

___

## Official E-co.lab Links

*   **Official Website:** [ecolab-web3.github.io](https://ecolab-web3.github.io/)
*   **Whitepaper:** [e-co-lab.gitbook.io/whitepaper](https://e-co-lab.gitbook.io/whitepaper)
*   **Discord Community:** [discord.gg/Q6BNyUDNtm](https://discord.gg/Q6BNyUDNtm)
*   **Twitter:** [x.com/ecolab_web3](https://x.com/ecolab_web3)

___

## About The Project

This repository contains a smart contract prototype that tokenizes a **Community Supported Agriculture (CSA)** membership share as a **Real World Asset (RWA)** on the blockchain.

This project has been successfully migrated to a professional **Hardhat environment**, rigorously tested, deployed, and verified on the **Avalanche Fuji Testnet**.
___

## Live Demo & dApps

### Frontend dApp
-   **Wallet Integration:** Connects seamlessly to browser wallets like MetaMask.
-   **Auto-Connection & Network Validation:** Remembers connected wallets and verifies the correct network.
-   **Dynamic Season Display:** Robustly fetches and displays all available seasons from the contract.
-   **Multi-language Support:** Available in both English and Portuguese.

### Smart Contract
-   **Season Management:** Owner can create new harvest seasons with specific names, prices, and member capacity.
-   **NFT Membership:** Users can purchase a membership (`buyMembership()`), which mints an ERC721 NFT to their wallet.
-   **Weekly Redemption:** NFT owners can redeem their weekly product box, with the contract enforcing one redemption per week per share.
-   **Standards-Based:** Built on OpenZeppelin's `ERC721Enumerable` and `Ownable` contracts.

You can interact with the live version of this project using the dApp prototypes below. Please make sure your wallet (e.g., MetaMask) is connected to the **Avalanche Fuji Testnet**.

### dApp Prototypes

*   **User dApp (Membership & Redemption):**
    *   **[➡️ Interact with the dApp (english version)](https://ecolab-web3.github.io/csa-rwa-solidity/index-en.html)**
    *   **[➡️ Interaja com o dApp (versão em português)](https://ecolab-web3.github.io/csa-rwa-solidity/index-pt_br.html)**

*   **Admin Panel (Season Management):**
    *   **[➡️ Access the Admin Panel (english version, for contract owner only)](https://ecolab-web3.github.io/csa-rwa-solidity/admin-en.html)**
    *   **[➡️ Acesse o Painel do Administrador (versão em português, somente para o proprietário do contrato)](https://ecolab-web3.github.io/csa-rwa-solidity/admin-pt_br.html)**

### Contract Details

*   **Network:** `Avalanche Fuji Testnet`
*   **Contract Address:** [`0x1c96D0701B1bd9c3CC24fAcca3A4d68ED8Bfb1AF`](https://testnet.snowtrace.io/address/0x1c96D0701B1bd9c3CC24fAcca3A4d68ED8Bfb1AF)
*   **Verification:** The source code is verified. You can read and interact with it directly on **[Snowtrace](https://testnet.snowtrace.io/address/0x1c96D0701B1bd9c3CC24fAcca3A4d68ED8Bfb1AF#code)**.

---

## Development Environment & Testing

This project was migrated from Remix IDE to a professional Hardhat environment to ensure quality and reproducibility.

*   **Framework:** Hardhat
*   **Solidity Version:** `0.8.20`
*   **Testing:** A comprehensive test suite was developed using `ethers.js` and `Chai`. The suite consists of **26 passing tests** covering all contract functions and logic paths.

### Test Coverage

The project achieved the following test coverage:

| File             | % Stmts | % Branch | % Funcs | % Lines |
|------------------|---------|----------|---------|---------|
| **CSA_RWA.sol**  | 96.67   | 89.29    | 100     | 100     |
| **All files**    | 96.67   | 89.29    | 100     | 100     |

**Note on Code Coverage:** The coverage tool correctly identifies a redundant `require` statement in the `buyMembership` function. A preceding line (`uint256 seasonId = seasons.length - 1;`) already prevents execution with an empty `seasons` array due to an arithmetic underflow, making the `require` check's failure path unreachable. Since the contract is already deployed and immutable, this code will not be altered in this version. The optimization is listed as a next step for future versions.

---

## Overview

The core idea is to transform a CSA "membership share" into an **ERC721Enumerable Non-Fungible Token (NFT)**. Each NFT represents a member's right to receive a weekly product box for a specific harvest season, turning this right into a liquid, transferable, and transparent digital asset.

### Key Concepts Implemented

*   **Season Management**: The contract owner can create new harvest seasons via a dedicated admin panel.
*   **Share Purchase (Minting)**: Community members can purchase a share through the dApp, which "mints" an NFT.
*   **Weekly Redemption**: The NFT owner can redeem their weekly product box.
*   **Automated Token ID Discovery**: The dApp automatically detects if a user is a member and retrieves their Token ID.
*   **Security and Transparency**: The contract is `Ownable` and the code is publicly verified.

---

## Next Steps

This is a functional prototype. For a production-ready project, the next steps focus on code optimization, upgradability, user experience, and security.

### 1. Contract Refinement (Code Optimization)

As identified during the test coverage analysis, the next version of the contract will remove the redundant `require` statement in the `buyMembership` function. This will make the code cleaner and slightly more gas-efficient, allowing the test suite to achieve 100% branch coverage.

### 2. Implement an Upgradable Contract using the Proxy Pattern

To allow for future feature additions or bug fixes without forcing users to migrate to a new contract, the next logical step is to implement an upgradable contract using OpenZeppelin's Upgrades Contracts. This would enable future evolution, such as transforming the contract into a multi-farmer platform.

### 3. Enhance dApp and Admin Panel UI/UX

The current dApps are functional prototypes. A production version would require enhancing them with a modern framework and adding features like an NFT gallery, redemption history, and a more comprehensive admin dashboard.

### 4. Undergo a Professional Security Audit

Before deploying to a mainnet and handling real value, a full audit by a reputable third-party security firm is essential to ensure the safety of the system.

___

## Ecosystem Recognition

E-co.lab is a recognized participant in the **[Avalanche Retro9000](https://retro9000.avax.network/)** program, a retroactive public goods funding initiative by the Avalanche Foundation. Our project has been approved for the "L1s & Infrastructure Tooling" round and is currently live for community voting by participants in the Avalanche ecosystem.

You can view our official submission and support our mission here: **[E-co.lab on Retro9000](https://retro9000.avax.network/discover-builders/cmebmfjtw02g5103tb8aalzvi)**

___

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please feel free to fork the repo and create a pull request, or open an issue with the tag "enhancement".

---

## License


This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


