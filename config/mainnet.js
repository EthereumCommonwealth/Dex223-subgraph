const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const USDT = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

/**
 * Ethereum mainnet, Dex223 deployment of 2026-09-22
 * (addresses and blocks: EthereumCommonwealth/Dex223-contracts, deployments/mainnet.json).
 *
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'mainnet',
  WETH: WETH.toLowerCase(),
  v1: {
    // USDC/WETH 0.3% pool of this factory, prices ETH in USD. USDC is token0 (STABLECOIN_IS_TOKEN0).
    // Derived from the factory and POOL_INIT_CODE_HASH 0xe125...c486; it exists once someone creates it.
    WETH_USDC_03_POOL: '0xaEaD34c58230D771C57905473CceBD936b755373'.toLowerCase(),
    stablecoinIsToken0: true,
    minimumEthLocked: '60',
    contracts: {
      factory: {
        name: 'Factory',
        address: '0xeA0A163e0196Bf1500B1B41d3ADdA0476dC137eb'.toLowerCase(),
        startBlock: 26032204 // factory deployment
      },
      tokenConverter: {
        // The live ERC-7417 converter, reused by the 2026-09-22 deployment.
        name: 'TokenConverter',
        address: '0xe7E969012557f25bECddB717A3aa2f4789ba9f9a'.toLowerCase(),
        startBlock: 21298983 // converter deployment, so wrappers created before the factory are indexed
      }
    },
    stableCoins: [USDC, USDT, DAI].map(token => token.toLowerCase()),
    whitelistAddresses: [
      WETH,
      USDC, // USDC
      USDT, // USDT
      DAI // DAI
    ].map(token => token.toLowerCase())
  }
}
