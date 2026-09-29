const dex223Chain = require('./lib/dex223Chain')

/**
 * arbitrum, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Deployable to Subgraph Studio (network 'arbitrum-one').
 */
module.exports = dex223Chain({
  chain: 'arbitrum',
  network: 'arbitrum-one',
  wrappedNative: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  stableCoins: [
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT0
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC
  ],
  pricingPool: '0x81b4a9a7690F744d2135798b9375666B9B5bD01d',
  minimumEthLocked: '60', // ETH
  startBlocks: { converter: null, factory: null }
})
