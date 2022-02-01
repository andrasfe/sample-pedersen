# Pedersen commmitment validation of model execution

Implementation of Pedersen commitment in solidity.

Launch ganache, then deploy contracts:
```sh
ganache-cli --port 7545 --networkId 5777
npm i
truffle compile
truffle migrate
```

Run the test suite directly:
```sh
truffle test --network local
```

From console:

```sh
truffle console
sc = await PedersenCommitment.deployed();
ms = await ModelSubmission.deployed();
commitment = await sc.commit(123, 456);
await ms.submit(commitment[0], commitment[1], 88789);
await ms.validate(accounts[0], 123, 456);

```

## Connecting to Ropsten
This process is slightly more convoluted.User needs to have a wallet (seed/mnemonic) and an account at https://infura.io .

```sh
DEVNET_WALLET='<MNEMONICS>' DEVNET_URI=<ROPSTEN URI> npm run deployDev
```

Using `truffle console` with devnet:

```sh
DEVNET_WALLET='<MNEMONICS>' DEVNET_URI=<ROPSTEN URI> truffle console --network devnet
```

Credits:
ZKP package used as-is from: https://github.com/18dew/solGrined

  