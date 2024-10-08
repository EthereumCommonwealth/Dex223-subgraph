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
    WETH_USDC_03_POOL: '0xc1ae0A4782A42A76637AB49001F1F370888053DA'.toLowerCase(),
    contracts: {
      factory: {
        name: 'Factory',
        address: '0x8524c3bD49Cd455EA0102BF194AdD2F21165E049'.toLowerCase(),
        startBlock: 6794948
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
