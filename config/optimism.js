const dex223Chain = require('./lib/dex223Chain')

/**
 * optimism, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Deployable to Subgraph Studio (network 'optimism').
 */
module.exports = dex223Chain({
  chain: 'optimism',
  network: 'optimism',
  wrappedNative: '0x4200000000000000000000000000000000000006',
  stableCoins: [
    '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', // USDT
    '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', // USDC
  ],
  pricingPool: '0x28C13068624Bef8f8B4B5909e7778a063a2375A9',
  minimumEthLocked: '60', // ETH
  startBlocks: { converter: null, factory: null }
})
