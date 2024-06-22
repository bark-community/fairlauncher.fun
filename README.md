# FairLauncher.fun Contribution Guide

Welcome to FairLauncher.fun! This document provides an overview of the project and how you can contribute. FairLauncher.fun focuses on creating a fair and transparent launch mechanism for anti-bot, Solana, token-2022 based memecoins on the Solana blockchain. Your skills are highly valuable in driving this project forward.

## Project Description

**FairLauncher.fun**: This project features advanced anti-bot measures and a community governance framework, ensuring a fair and transparent launch mechanism for memecoins on the Solana blockchain.

**Contribute**: You can help by working on the dApp's UI, backend integration, or smart contracts.

**Repository**: [FairLauncher.fun](https://github.com/bark-community/fairlauncher.fun)

## Prerequisites

- Node v18.18.0 or higher
- Rust v1.77.2 or higher
- Anchor CLI 0.30.0 or higher
- Solana CLI 1.18.16 or higher

## Installation

### Clone the repo

```shell
git clone https://github.com/bark-community/fairlauncher.fun
cd fairlauncher.fun
```

### Install Dependencies

```shell
pnpm install
```

### Start the web app

```shell
pnpm run dev
```

## dApps

### Anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `pnpm run`, e.g., `pnpm run anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/fairlauncher.fun.ts` to match the new program id.

```shell
pnpm run anchor keys sync
```

#### Build the program:

```shell
pnpm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
pnpm run anchor-test
```

#### Deploy to Devnet

```shell
pnpm run anchor deploy --provider.cluster devnet
```

### FairLauncher web

This is a Next.js, React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
pnpm run dev
```

Build the web app

```shell
pnpm run build
```

## Creating a New Repository

If you have innovative ideas or enhancements that do not fit into the existing repositories, we need to create a new repository under the BARK community. This will help expand the ecosystem and drive further innovation.

## Getting Started

Your involvement can help drive this project forward, ensuring the success and growth of FairLauncher.fun. For more detailed information and to get started, visit the [GitHub repository](https://github.com/bark-community/fairlauncher.fun). Your contributions, whether in UI/UX design, backend development, smart contract optimization, or community engagement, will be highly appreciated.

Let's build a robust and innovative FairLauncher.fun together!

For any questions or further information, please reach out to the project maintainers through the GitHub repository.