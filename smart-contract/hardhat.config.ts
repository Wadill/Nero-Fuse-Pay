require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    nero: {
      url: process.env.NERO_RPC_URL || "https://rpc.nerochain.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1234, // Replace with actual NERO chain ID
    },
    neroTestnet: {
      url: process.env.NERO_TESTNET_RPC_URL || "https://testnet.rpc.nerochain.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5678, // Replace with actual testnet ID
    },
  },
  etherscan: {
    apiKey: {
      nero: process.env.NERO_SCAN_API_KEY || "UNSET",
      neroTestnet: process.env.NERO_SCAN_API_KEY || "UNSET",
    },
    customChains: [
      {
        network: "nero",
        chainId: 1689,
        urls: {
          apiURL: "https://api.scan.nerochain.io/api",
          browserURL: "https://scan.nerochain.io"
        }
      },
      {
        network: "neroTestnet",
        chainId: 5678,
        urls: {
          apiURL: "https://api.testnet.scan.nerochain.io/api",
          browserURL: "https://testnet.scan.nerochain.io"
        }
      }
    ]
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test"
  }
};