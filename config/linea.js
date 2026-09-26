const dex223Chain = require('./lib/dex223Chain')

/**
 * linea, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Deployable to Subgraph Studio (network 'linea').
 */
module.exports = dex223Chain({
  chain: 'linea',
  network: 'linea',
  wrappedNative: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
  stableCoins: [
    '0xA219439258ca9da29E9Cc4cE5596924745e12B93', // USDT
    '0x176211869cA2b568f2A7D4EE941E073a821EE1ff', // USDC
  ],
  pricingPool: '0x66a989d14b3cF2b461fc77A6C60B7dfB4Cf034b4',
  minimumEthLocked: '60', // ETH
  startBlocks: { converter: null, factory: null }
})
