# 🔥 KnockKnockNovember: A Zero-Knowledge Dice Roll Dating DApp 🎲💘

**KnockKnockNovember** is a decentralized dating app that combines the thrill of a random dice roll with privacy-first matchmaking. Using **zero-knowledge proofs (ZKPs)**, this DApp ensures that players can engage in fun, anonymous matchmaking without revealing sensitive data, such as gender or chosen dice rolls, on-chain.

## 🛠 Project Overview

In **KnockKnockNovember**, two players select a dice roll and try to match with each other based on their selected numbers. With the help of **ZKPs**, player information remains private and secure, ensuring that neither gender nor chosen dice roll values are exposed on the blockchain.

### Key Components

- **Zero-Knowledge Proofs** (ZKPs) for gender and dice roll privacy
- **Starkware** for secure, scalable smart contract deployment on Ethereum
- **Svelte** for a modern, fast, and interactive frontend
- **Telegram logging integration** for debugging and tracking DApp activities

## ⚙️ How It Works

1. **Connect Wallet**: Players connect to the DApp via Starknet-compatible wallets (e.g., Argent).
2. **Select Gender and Dice Roll**: Each player privately chooses a gender and rolls a virtual dice to generate a random number.
3. **Zero-Knowledge Matching**: Using ZKPs, the DApp verifies matches without revealing individual choices on-chain.
4. **Check for Match**: If both users’ dice rolls match, the DApp confirms a successful match!
5. **Logging**: All critical activities are logged (securely) for debugging purposes via Telegram integration.

## 🧩 Tech Stack

- **Starkware**: Deployed smart contracts for secure and scalable transaction management
- **Zero-Knowledge Proofs**: Ensures that sensitive data (gender and dice roll) remains private
- **Svelte**: Provides a dynamic and responsive frontend experience
- **Telegram API**: Logs DApp activity to Telegram for real-time monitoring

## 🔑 Core Features

1. **Privacy-Focused Matching**: Zero-knowledge proofs protect user information while enabling matches.
2. **Dice Roll Mechanics**: A fun, gamified way to match users without needing excessive data.
3. **Decentralized**: The entire DApp is built on Starkware for decentralized operation.
4. **Real-Time Logs**: Telegram integration ensures transparent monitoring and debugging of events.

## 🚀 Getting Started

1. **Prerequisites**:
   - **Node.js** and **npm**
   - **Starknet wallet** (e.g., Argent X) for interaction
2. **Installation**:
   - Clone the repository: `git clone https://github.com/your-username/KnockKnockNovember.git`
   - Install dependencies: `npm install`
3. **Environment Setup**:
   - Create a `.env` file and add the following:
     ```
     VITE_DATING_CONTRACT_ADDRESS=<Your Starkware Contract Address>
     TELEGRAM_BOT_TOKEN=<Your Telegram Bot Token>
     TELEGRAM_CHAT_ID=<Your Chat ID>
     ```
4. **Run the App**:
   - Start the development server: `npm run dev`

## 🎲 Using the DApp

1. **Connect Your Wallet**: Click "Connect Wallet" and link a Starknet-compatible wallet.
2. **Choose Gender and Roll the Dice**: Select a gender (kept private via ZKPs) and roll a dice.
3. **Find Your Match**: If another user rolls the same number, a match is confirmed!

## 👨‍💻 Developer Notes

- The ZKP implementation is handled within the Starkware smart contracts to keep private data secure.
- **Testing**: Zero-knowledge proofs and matching are thoroughly tested to ensure data privacy and integrity.

## 📈 Future Enhancements

- **Enhanced Privacy**: Integrate additional ZKP optimizations for even more secure interactions.
- **Additional Game Mechanics**: Add options for multi-round games or additional private information.
- **Improved Matching Algorithms**: Use more sophisticated algorithms for matchmaking.

## 🤝 Contribution

Contributions, suggestions, and feature requests are welcome! Fork the repository and submit a pull request to help improve **KnockKnockNovember**.

---

**KnockKnockNovember** brings a unique blend of privacy and fun to decentralized dating. Roll the dice and find your match — without ever revealing your private information!
