const dex223Chain = require('./lib/dex223Chain')

/**
 * avalanche, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Deployable to Subgraph Studio (network 'avalanche').
 */
module.exports = dex223Chain({
  chain: 'avalanche',
  network: 'avalanche',
  wrappedNative: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
  stableCoins: [
    '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', // USDt
    '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', // USDC
  ],
  pricingPool: '0x3B7Ebc7Cd3a3c32ab98F6a8daaEBd3ad55e91d5C',
  // ~ the USD value of mainnet's 60 ETH on 2026-09-25
  minimumEthLocked: '15000', // AVAX
  startBlocks: { converter: null, factory: null }
})
