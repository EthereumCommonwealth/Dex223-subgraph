const dex223Chain = require('./lib/dex223Chain')

/**
 * mantle, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Subgraph Studio does not index 'mantle': use a self-hosted graph-node or another indexer.
 */
module.exports = dex223Chain({
  chain: 'mantle',
  network: 'mantle',
  wrappedNative: '0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
  stableCoins: [
    '0x779Ded0c9e1022225f8E0630b35a9b54bE713736', // USDT0
    '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9', // USDC
  ],
  pricingPool: '0xe57d43E455FC91DF7011E5AdDfD70784bA250489',
  // ~ the USD value of mainnet's 60 ETH on 2026-09-25
  minimumEthLocked: '240000', // MNT
  startBlocks: { converter: null, factory: null }
})
