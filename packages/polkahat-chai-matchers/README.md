[![npm](https://img.shields.io/npm/v/wookashwackomytest-polkahat-chai-matchers.svg)](https://www.npmjs.com/package/wookashwackomytest-polkahat-chai-matchers)

# Polkahat Chai Matchers

This plugin adds various capabilities to the [Chai](https://chaijs.com/) assertion library, making your smart contract tests easy to write and read.

### Installation

```bash
npm install --save-dev wookashwackomytest-polkahat-chai-matchers
```

If you are using yarn:

```bash
yarn add --dev wookashwackomytest-polkahat-chai-matchers
```

### Usage

After installing it, import the config in:

```js
import "wookashwackomytest-polkahat-chai-matchers";
```

Then you'll be able to use the matchers in your tests:

```js
expect(await token.totalSupply()).to.equal(1_000_000);

await expect(token.transfer(token, 1000)).to.be.revertedWith(
  "Cannot transfer to the contract itself"
);

await expect(token.transfer(recipient, 1000))
  .to.emit(token, "Transfer")
  .withArgs(owner, recipient, 1000);
```

### Known issues

#### Chaining Async Matchers

Currently, the following matchers do not support chaining:

- `reverted`
- `revertedWith`
- `revertedWithCustomError`
- `revertedWithoutReason`
- `revertedWithPanic`
- `changeEtherBalance`
- `changeEtherBalances`
- `changeTokenBalance`
- `changeTokenBalances`
- `emit` (with the only exception of chaining multiple `emit` matchers)

Which means you can't do:

```js
await expect(contract.f(...))
  .to.changeEtherBalance(...)
  .and.to.changeTokenBalance(...)
```

To work around this limitation, write separate assertions for each matcher:

```js
const tx = contract.f(...);
await expect(tx).to.changeEtherBalance(...)
await expect(tx).to.changeTokenBalance(...)
```
