const WETH = '0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa'
const DAI = '0x1e6951b73f44E7C71B43Dfc1FFA63cA2eab2cEdA'
const USDC = '0xb2E07B4536b2e35D41DCb9B9c4F5C86E89a42663'
const USDT = '0x8dD8F439D3478Badb814F7b84d7a06d467eD3812'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'sepolia',
  WETH: WETH.toLowerCase(),
  v1: {
    WETH_USDC_03_POOL: '0xC6F53004069bD066EC33C13F0B43E1212B9053D6'.toLowerCase(),
    contracts: {
      factory: {
        name: 'Factory',
        address: '0xC7D28E12Bc1744Ac2C78A893F6282412e6D620ab'.toLowerCase(),
        startBlock: 5920069
      },
      nonfungiblePositionManager: {
        name: 'NonfungiblePositionManager',
        address: '0x70f4524cc98B9F3b0505430a94a2Fc2a7cbDAA27'.toLowerCase(),
        startBlock: 5941286
      },
      tokenConverter: {
        name: 'TokenConverter',
        address: '0x1245c83de3cc16193de8777ed597b677d789ac94'.toLowerCase(),
        startBlock: 5814218
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
