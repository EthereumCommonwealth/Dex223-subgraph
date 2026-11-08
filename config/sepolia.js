// The WETH9 the UI and the Sepolia router/position manager use.
const WETH = '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa'
const DAI = '0x1e6951b73f44E7C71B43Dfc1FFA63cA2eab2cEdA'
const USDC = '0x44649c38615ad4426c16cd5d5059e6e74b87234a'
const USDT = '0x8dD8F439D3478Badb814F7b84d7a06d467eD3812'
// The test USDC and USDT the trading bots deploy and mint, which hold the Sepolia liquidity.
const TEST_USDC = '0xFC86A38E97F63852B49b61d44Eee4f937251ae1A'
const TEST_USDT = '0xB8e96EB2A094e889AaCC9491fa0538F28517CC33'
// RED: the margin order's base asset, priced through RED/test-USDC 0.3% (0xb619…bf7c). Whitelisting it prices TOT1 via RED/TOT1.
const RED = '0x1DEf777468F76ed1E74fC87bD32334d3Ccb520d0'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'sepolia',
  WETH: WETH.toLowerCase(),
  v1: {
    // WETH/test-USDC 0.3% on factory 0xbdC7…, created by the bots' seed (2026-11-08). WETH sorts first, so the
    // stablecoin is token1. The earlier entry used USDC 0x4464…, which holds no Sepolia liquidity, so ETH priced at 0.
    WETH_USDC_03_POOL: '0xF92214133F4Eb757BF389Ea7200398D9FC2c8965'.toLowerCase(),
    stablecoinIsToken0: false,
    // Testnet pools are small; 60 ETH left every token but the stablecoins unpriced.
    minimumEthLocked: '1',
    contracts: {
      factory: {
        name: 'Factory',
        // Sepolia v6, 2026-11-07: everything merged through Dex223-contracts #200 (pool hash 0x5944…).
        address: '0xbdC7986B4C46F3629948f78a8F9942A88c111A86'.toLowerCase(),
        startBlock: 12085842
      },
      tokenConverter: {
        name: 'TokenConverter',
        // The converter the factory uses since collector.execute(factory.set(...)), the same one the UI uses.
        address: '0x5847f5C0E09182d9e75fE8B1617786F62fee0D9F'.toLowerCase(),
        startBlock: 8468334 // converter deployment, so wrappers created before the factory are indexed
      }
    },
    stableCoins: [DAI, USDC, USDT, TEST_USDC, TEST_USDT].map(token => token.toLowerCase()),
    whitelistAddresses: [
      WETH,
      USDC, // USDC
      USDT, // USDT
      DAI, // DAI
      TEST_USDC,
      TEST_USDT,
      RED
    ].map(token => token.toLowerCase())
  }
}
