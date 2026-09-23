const WETH = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14'
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
    WETH_USDC_03_POOL: '0x6ab29B6DfaB7E06dEf97f20E619F653Cb3C6fc89'.toLowerCase(),
    contracts: {
      factory: {
        name: 'Factory',
        // Sepolia redeploy 2026-09-21 (same CREATE2 address as mainnet).
        address: '0xeA0A163e0196Bf1500B1B41d3ADdA0476dC137eb'.toLowerCase(),
        startBlock: 11755632
      },
      tokenConverter: {
        name: 'TokenConverter',
        address: '0xa7d623Dd99fae6f03Bb4A427F1b3FF29fb130108'.toLowerCase(),
        startBlock: 11755626
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
