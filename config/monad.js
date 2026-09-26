const dex223Chain = require('./lib/dex223Chain')

/**
 * monad, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Subgraph Studio does not index 'monad': use a self-hosted graph-node or another indexer.
 */
module.exports = dex223Chain({
  chain: 'monad',
  network: 'monad',
  wrappedNative: '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A',
  stableCoins: [
    '0xe7cd86e13AC4309349F30B3435a9d337750fC82D', // USDT0
    '0x754704Bc059F8C67012fEd69BC8A327a5aafb603', // USDC
  ],
  pricingPool: '0xD3cf025bD30f3CE6366D19f1217d245aeaE38590',
  // ~ the USD value of mainnet's 60 ETH on 2026-09-25
  minimumEthLocked: '6000000', // MON
  startBlocks: { converter: null, factory: null }
})
