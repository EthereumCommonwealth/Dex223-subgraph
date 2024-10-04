const WETH = '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa'
const DAI = '0x1e6951b73f44E7C71B43Dfc1FFA63cA2eab2cEdA'
const USDC = '0x44649C38615AD4426c16Cd5d5059E6E74B87234A'
const USDT = '0x8dD8F439D3478Badb814F7b84d7a06d467eD3812'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'sepolia',
  WETH: WETH.toLowerCase(),
  v1: {
    WETH_USDC_03_POOL: '0xc1ae0a4782a42a76637ab49001f1f370888053da'.toLowerCase(),
    contracts: {
      factory: {
        name: 'Factory',
        address: '0xC7D28E12Bc1744Ac2C78A893F6282412e6D620ab'.toLowerCase(),
        startBlock: 5920069
      },
      tokenConverter: {
        name: 'TokenConverter',
        address: '0x044845FB22B4258d83a6c24b2fB061AFEba7e5b9'.toLowerCase(),
        startBlock: 6794913
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
