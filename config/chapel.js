const WETH = '0xae13d989dac2f0debff460ac112a837c89baa7cd'
const USDC = '0x431cC175baFB82C2415a94ef6103e124F289959e'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'chapel',
  WETH: WETH.toLowerCase(),
  v1: {
    WETH_USDC_03_POOL: '0x76E82368C26488D4daf3008a92DDe2477F0bcCa6'.toLowerCase(),
    contracts: {
      factory: {
        name: 'Factory',
        address: '0x8524c3bD49Cd455EA0102BF194AdD2F21165E049'.toLowerCase(),
        startBlock: 44378995
      },
      tokenConverter: {
        name: 'TokenConverter',
        address: '0x18EEdef5d3D21C2828Ca8557BeF7210Bfa481bC2'.toLowerCase(),
        startBlock: 44378912
      }
    },
    stableCoins: [USDC].map(token => token.toLowerCase()),
    whitelistAddresses: [
      WETH,
      USDC // USDC
    ].map(token => token.toLowerCase())
  }
}
