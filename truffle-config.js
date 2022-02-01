
require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider");

const wallets = {}
wallets.dev = process.env.DEVNET_WALLET;
wallets.test = process.env.TESTNET_WALLET;
wallets.main = process.env.MAINNET_WALLET;

const endpoints = {}
endpoints.dev = process.env.DEVNET_URI;
endpoints.test = process.env.TESTNET_URI;
endpoints.main = process.env.MAINNET_URI;

const W3 = require('web3');
const web3 = new W3();

module.exports = {
  plugins: ["truffle-security"],
  migrations_directory: "./migrations",
  networks: {
    local: {
      host: "localhost",
      port: 7545,
      network_id: "5777" // Match any network id
    },
    devnet : {
      provider: () => {
        return new HDWalletProvider(wallets.dev, endpoints.dev);
      },
      gas: 6955016,
      gasPrice: web3.utils.toWei("15", "gwei"),
      network_id: "3",
    },
    testnet : {
      provider: () => {
        return new HDWalletProvider(wallets.test, endpoints.test);
      },
      gas: 6955016,
      gasPrice: web3.utils.toWei("15", "gwei"),
      network_id: "4",
    },

    mainnet : {
      provider: () => {
        return new HDWalletProvider(wallets.main, endpoints.main);
      },
      gas: 6955016,
      gasPrice: web3.utils.toWei("15", "gwei"),
      network_id: "1",
    },
  },
  compilers: {
    solc: {
      version: "0.5.10", // A version or constraint - Ex. "^0.5.0"
      docker: false, // Use a version obtained through docker
      settings: {
        optimizer: {
          enabled: false,
          runs: 500   // Optimize for how many times you intend to run the code
        },
        evmVersion: "homestead" // Default: "petersburg"
      }
    }
  }
}
