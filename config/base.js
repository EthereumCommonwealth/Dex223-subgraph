const dex223Chain = require('./lib/dex223Chain')

/**
 * base, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Deployable to Subgraph Studio (network 'base').
 */
module.exports = dex223Chain({
  chain: 'base',
  network: 'base',
  wrappedNative: '0x4200000000000000000000000000000000000006',
  stableCoins: [
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC
    '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', // USDT
  ],
  pricingPool: '0x69718500C02d4FB6017F81F1045d2a54734AA7b3',
  minimumEthLocked: '60', // ETH
  startBlocks: { converter: null, factory: null }
})
