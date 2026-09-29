const dex223Chain = require('./lib/dex223Chain')

/**
 * sonic, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Deployable to Subgraph Studio (network 'sonic').
 */
module.exports = dex223Chain({
  chain: 'sonic',
  network: 'sonic',
  wrappedNative: '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38',
  stableCoins: [
    '0x29219dd400f2Bf60E5a23d13Be72B486D4038894', // USDC
    '0x6047828dc181963ba44974801FF68e538dA5eaF9', // USDT
  ],
  pricingPool: '0x6EedC4FE50AD071294458E2580B8F2a4ce52DDF7',
  // ~ the USD value of mainnet's 60 ETH on 2026-09-25
  minimumEthLocked: '4000000', // S
  startBlocks: { converter: null, factory: null }
})
