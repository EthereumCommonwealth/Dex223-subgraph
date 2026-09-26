/**
 * Config for a chain deployed with Dex223-contracts scripts/deploy-chain.ts. That script puts the factory
 * and the converter at the same address on every chain, so only the tokens, the pricing pool and the
 * start blocks differ.
 *
 * Start blocks exist only after the deploy: copy `block:converter` and `block:factory` from
 * Dex223-contracts deployments/<chain>.json. Rendering fails until both are set.
 */
const FACTORY = '0xeA0A163e0196Bf1500B1B41d3ADdA0476dC137eb'
const CONVERTER = '0xa7d623Dd99fae6f03Bb4A427F1b3FF29fb130108'

module.exports = function dex223Chain({ chain, network, wrappedNative, stableCoins, pricingPool, minimumEthLocked, startBlocks }) {
  if (!startBlocks.converter || !startBlocks.factory) {
    throw new Error(`config/${chain}.js: set startBlocks from Dex223-contracts deployments/${chain}.json (block:converter, block:factory)`)
  }
  const lower = a => a.toLowerCase()
  // stableCoins[0] is the stablecoin in pricingPool
  const pricingStable = lower(stableCoins[0])
  return {
    network,
    WETH: lower(wrappedNative),
    v1: {
      // CREATE2 of the pricingStable/wrappedNative 0.3% pool on FACTORY with the new-chain
      // POOL_INIT_CODE_HASH 0xda78…c568; it exists once someone creates it.
      WETH_USDC_03_POOL: lower(pricingPool),
      stablecoinIsToken0: pricingStable < lower(wrappedNative),
      minimumEthLocked,
      contracts: {
        factory: { name: 'Factory', address: lower(FACTORY), startBlock: startBlocks.factory },
        tokenConverter: { name: 'TokenConverter', address: lower(CONVERTER), startBlock: startBlocks.converter }
      },
      stableCoins: stableCoins.map(lower),
      whitelistAddresses: [wrappedNative, ...stableCoins].map(lower)
    }
  }
}
