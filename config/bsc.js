const dex223Chain = require('./lib/dex223Chain')

/**
 * bsc, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Deployable to Subgraph Studio (network 'bsc').
 */
module.exports = dex223Chain({
  chain: 'bsc',
  network: 'bsc',
  wrappedNative: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  stableCoins: [
    '0x55d398326f99059fF775485246999027B3197955', // USDT
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC
  ],
  pricingPool: '0xdAeA304F4fDe1f70D915b8Ff84ea9306be977558',
  // ~ the USD value of mainnet's 60 ETH on 2026-09-25
  minimumEthLocked: '200', // BNB
  startBlocks: { converter: null, factory: null }
})
