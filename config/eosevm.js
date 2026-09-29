const dex223Chain = require('./lib/dex223Chain')

/**
 * eosevm, Dex223 deployment from Dex223-contracts scripts/deploy-chain.ts.
 * Subgraph Studio does not index 'eos-evm': use a self-hosted graph-node or another indexer.
 * EOS EVM has had no public RPC since 2025-10-08; the token addresses below are unverified. Index it with
 * our own graph-node pointed at our own EOS EVM node.
 */
module.exports = dex223Chain({
  chain: 'eosevm',
  network: 'eos-evm',
  wrappedNative: '0xc00592aA41D32D137dC480d9f6d0Df19b860104F',
  stableCoins: [
    '0x33B57dC70014FD7AA6e1ed3080eeD2B619632B8e', // USDT
  ],
  pricingPool: '0xb74ff491211cDc5A74422F692EC2207B888d1556',
  // ~ the USD value of mainnet's 60 ETH on 2026-09-25
  minimumEthLocked: '1600000', // A
  startBlocks: { converter: null, factory: null }
})
