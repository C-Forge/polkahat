# Verifying your contracts

Once your contract is ready, the next step is to deploy it to a live network and verify its source code.

Verifying a contract means making its source code public, along with the compiler settings you used, which allows anyone to compile it and compare the generated bytecode with the one that is deployed on-chain. Doing this is extremely important in an open platform like Ethereum.

In this guide we'll explain how to do this in the [Etherscan](https://etherscan.io/) explorer, but there are other ways to verify a contract, for example with [Sourcify](https://sourcify.dev/).

## Getting an API key from Etherscan

The first thing you need is an API key from Etherscan. To get one, go to [their site](https://etherscan.io/login), sign in (or create an account if you don't have one) and open the "API Keys" tab. Then click the "Add" button and give a name (like "Hardhat") to the API key you are creating. After that you'll see the newly created key in the list.

Open your Hardhat config and add the API key you just created:

::::tabsgroup{options=TypeScript,JavaScript}

:::tab{value=TypeScript}

```ts
export default {
  // ...rest of the config...
  etherscan: {
    apiKey: "ABCDE12345ABCDE12345ABCDE123456789",
  },
};
```

:::

:::tab{value=JavaScript}

```js
module.exports = {
  // ...rest of the config...
  etherscan: {
    apiKey: "ABCDE12345ABCDE12345ABCDE123456789",
  },
};
```

:::

::::

## Deploying and verifying a contract in the Sepolia testnet

We are going to use the [Sepolia testnet](https://ethereum.org/en/developers/docs/networks/#sepolia) to deploy and verify our contract, so you need to add this network in your Hardhat config. Here we are using [Infura](https://infura.io/) to connect to the network, but you can use an alternative JSON-RPC URL like [Alchemy](https://alchemy.com/) if you want.

::::tabsgroup{options=Infura,Alchemy}

:::tab{value=Infura}

```js
// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and replace "KEY" with it
const INFURA_API_KEY = "KEY";

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = "YOUR SEPOLIA PRIVATE KEY";

module.exports = {
  // ...rest of your config...
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};
```

:::

:::tab{value=Alchemy}

```js
// Go to https://alchemy.com, sign up, create a new App in
// its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "KEY";

// Replace this private key with your Sepolia account private key
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const SEPOLIA_PRIVATE_KEY = "YOUR SEPOLIA PRIVATE KEY";

module.exports = {
  // ...rest of your config...
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
};
```

:::

::::

To deploy on Sepolia you need to send some Sepolia ether to the address that's going to be making the deployment. You can get testnet ether from a faucet, a service that distributes testing-ETH for free. Here is one for Sepolia:

- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)

Now you are ready to deploy your contract, but first we are going to make the source code of our contract unique. The reason we need to do this is that the sample code from the previous section is already verified in Sepolia, so if you try to verify it you'll get an error.

Open your contract and add a comment with something unique, like your GitHub's username. Keep in mind that whatever you include here will be, like the rest of the code, publicly available on Etherscan:

```solidity
// Author: @janedoe
contract Lock {
```

You can now run the deploy script using the newly added Sepolia network:

::::tabsgroup{options=TypeScript,JavaScript}

:::tab{value=TypeScript}

```
npx hardhat run scripts/deploy.ts --network sepolia
```

:::

:::tab{value=JavaScript}

```
npx hardhat run scripts/deploy.js --network sepolia
```

:::

::::

Take note of the address and the unlock time and run the `verify` task with them:

```
npx hardhat verify --network sepolia <address> <unlock time>
```

:::tip

If you get an error saying that the address does not have bytecode, it probably means that Etherscan has not indexed your contract yet. In that case, wait for a minute and then try again.

:::

After the task is successfully executed, you'll see a link to the publicly verified code of your contract.

To learn more about verifying, read the [hardhat-verify](/hardhat-runner/plugins/nomicfoundation-hardhat-verify) documentation.