// The WETH9 the UI and the Sepolia router/position manager use.
const WETH = '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa'
const DAI = '0x1e6951b73f44E7C71B43Dfc1FFA63cA2eab2cEdA'
const USDC = '0x44649c38615ad4426c16cd5d5059e6e74b87234a'
const USDT = '0x8dD8F439D3478Badb814F7b84d7a06d467eD3812'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'sepolia',
  WETH: WETH.toLowerCase(),
  v1: {
    // CREATE2 for USDC/WETH 0.3% on factory 0xeA0A… (may not exist until created).
    WETH_USDC_03_POOL: '0x6F8038B79388C16dbe3DF2138B3A05ca1D856Ef8'.toLowerCase(),
    stablecoinIsToken0: true,
    minimumEthLocked: '60',
    contracts: {
      factory: {
        name: 'Factory',
        // Sepolia redeploy 2026-09-21 (same CREATE2 address as mainnet).
        address: '0xeA0A163e0196Bf1500B1B41d3ADdA0476dC137eb'.toLowerCase(),
        startBlock: 11755632
      },
      tokenConverter: {
        name: 'TokenConverter',
        // The converter the factory uses since collector.execute(factory.set(...)), the same one the UI uses.
        address: '0x5847f5C0E09182d9e75fE8B1617786F62fee0D9F'.toLowerCase(),
        startBlock: 8468334 // converter deployment, so wrappers created before the factory are indexed
      }
    },
    stableCoins: [DAI, USDC, USDT].map(token => token.toLowerCase()),
    whitelistAddresses: [
      WETH,
      USDC, // USDC
      USDT, // USDT
      DAI // DAI
    ].map(token => token.toLowerCase())
  }
}
