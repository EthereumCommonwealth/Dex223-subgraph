const dex223Chain = require('./lib/dex223Chain')

/**
 * plasma, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Subgraph Studio does not index 'plasma': use a self-hosted graph-node or another indexer.
 */
module.exports = dex223Chain({
  chain: 'plasma',
  network: 'plasma',
  wrappedNative: '0x6100E367285b01F48D07953803A2d8dCA5D19873',
  stableCoins: [
    '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb', // USDT0
  ],
  pricingPool: '0x6a829d3068b36F07BCB1d331cBdBEEA01CD93812',
  // ~ the USD value of mainnet's 60 ETH on 2026-09-25
  minimumEthLocked: '1400000', // XPL
  startBlocks: { converter: null, factory: null }
})
