const dex223Chain = require('./lib/dex223Chain')

/**
 * ink, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Subgraph Studio does not index 'ink': use a self-hosted graph-node or another indexer.
 */
module.exports = dex223Chain({
  chain: 'ink',
  network: 'ink',
  wrappedNative: '0x4200000000000000000000000000000000000006',
  stableCoins: [
    '0x0200C29006150606B650577BBE7B6248F58470c1', // USDT0
    '0x2D270e6886d130D724215A266106e6832161EAEd', // USDC
  ],
  pricingPool: '0x004b955A7F5856213900B7Da3D938eA37537C8D9',
  minimumEthLocked: '60', // ETH
  startBlocks: { converter: null, factory: null }
})
