const dex223Chain = require('./lib/dex223Chain')

/**
 * unichain, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Deployable to Subgraph Studio (network 'unichain').
 */
module.exports = dex223Chain({
  chain: 'unichain',
  network: 'unichain',
  wrappedNative: '0x4200000000000000000000000000000000000006',
  stableCoins: [
    '0x9151434b16b9763660705744891fA906F660EcC5', // USDT0
    '0x078D782b760474a361dDA0AF3839290b0EF57AD6', // USDC
  ],
  pricingPool: '0x1c27F8BdecA2D96FE7d713ecb9Bf9c5AA5481c10',
  minimumEthLocked: '60', // ETH
  startBlocks: { converter: null, factory: null }
})
