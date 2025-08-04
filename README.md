# CSA as RWA: A Smart Contract Prototype in Solidity

![Language](https://img.shields.io/badge/Language-Solidity-orange)
![Blockchain](https://img.shields.io/badge/Blockchain-Avalanche_Fuji-red)
![Verified Contract](https://img.shields.io/badge/Contract-Verified-green)
![License](https://img.shields.io/badge/License-MIT-blue)

This repository contains a smart contract prototype demonstrating how a **Community Supported Agriculture (CSA)** program can be tokenized as a **Real World Asset (RWA)** on the blockchain.

This project has been successfully deployed to the **Avalanche Fuji Testnet** and includes a live DApp for interaction.

## Live Demo & Contract

You can interact with the live version of this project using the DApp prototypes below. Please make sure your wallet (e.g., MetaMask) is connected to the **Avalanche Fuji Testnet**.

### DApp Prototypes

*   **[➡️ Interact with the DApp (english version)](https://ecolab-web3.github.io/csa-rwa-solidity/index-en.html)**
*   **[➡️ Interaja com o DApp (versão em português)](https://ecolab-web3.github.io/csa-rwa-solidity/index-pt_br.html)**

### Admin Panel

*   **[➡️ Access the Admin Panel (english version, for contract owner only)](https://ecolab-web3.github.io/csa-rwa-solidity/admin-en.html)**
*   **[➡️ Acesse o Painel do Administrador (versão em português, somente para o proprietário do contrato)](https://ecolab-web3.github.io/csa-rwa-solidity/admin-pt_br.html)**

### Contract Details

*   **Network:** `Avalanche Fuji Testnet`
*   **Contract Address:** [`0x1c96D0701B1bd9c3CC24fAcca3A4d68ED8Bfb1AF`](https://testnet.snowtrace.io/address/0x1c96D0701B1bd9c3CC24fAcca3A4d68ED8Bfb1AF)
*   **Verification:** The source code is verified. You can read and interact with it directly on **[Snowtrace](https://testnet.snowtrace.io/address/0x1c96D0701B1bd9c3CC24fAcca3A4d68ED8Bfb1AF#code)**.

---

## Overview

The core idea is to transform a CSA "membership share" into an **ERC721Enumerable Non-Fungible Token (NFT)**. Each NFT represents a member's right to receive a weekly product box for a specific harvest season, turning this right into a liquid, transferable, and transparent digital asset.

### Key Concepts Implemented

*   **Season Management**: The contract owner (the farmer) can create new harvest seasons via a dedicated admin panel.
*   **Share Purchase (Minting)**: Community members can purchase a share through the DApp, which "mints" an NFT that proves their membership.
*   **Weekly Redemption**: The NFT owner can redeem their weekly product box.
*   **Automated Token ID Discovery**: The DApp automatically detects if a user is already a member and retrieves their Token ID.
*   **Security and Transparency**: The contract is `Ownable` and the code is publicly verified.

---

## Next Steps

This is a functional prototype. For a production-ready project, the next steps focus on upgradability, user experience, and security.

### 1. Implement an Upgradable Contract using the Proxy Pattern

Smart contracts on the blockchain are immutable. To allow for future feature additions or bug fixes without forcing users to migrate to a new contract, the next logical step is to implement an upgradable contract.

*   **Benefits:** This would enable future evolution, such as transforming the contract from a single-farmer model into a multi-farmer platform using an **"Access List Model"** (where the owner can register multiple farmers) or a **"Factory Model"** (where any farmer can deploy their own CSA instance from a central factory contract).

### 2. Enhance DApp and Admin Panel UI/UX

The current DApps are functional prototypes built with vanilla HTML/JS. A production version would require a significant design overhaul.

*   **User DApp (Interaction Pages):** Migrate to a modern frontend framework (React, Vue), implement a proper design system, improve user feedback with modals and notifications, and add features like an NFT gallery and redemption history.
*   **Admin Panel (Registration Page):** Transform the single-form page into a comprehensive dashboard to display all created seasons and integrate UI components to call other `onlyOwner` functions.

### 3. Undergo a Professional Security Audit

Before deploying to a mainnet and handling real value, a full audit by a reputable third-party security firm is essential. This process rigorously checks the smart contract code for vulnerabilities like reentrancy, integer overflows, access control issues, and other common attack vectors, ensuring the safety of user funds and the integrity of the system.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
