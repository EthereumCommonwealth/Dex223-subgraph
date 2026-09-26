const dex223Chain = require('./lib/dex223Chain')

/**
 * polygon, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Deployable to Subgraph Studio (network 'matic').
 */
module.exports = dex223Chain({
  chain: 'polygon',
  network: 'matic',
  wrappedNative: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  stableCoins: [
    '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT0
    '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // USDC
  ],
  pricingPool: '0x71BA8861BaAF6f61Bd013Fc2771016045614EE7E',
  // ~ the USD value of mainnet's 60 ETH on 2026-09-25
  minimumEthLocked: '1400000', // POL
  startBlocks: { converter: null, factory: null }
})
