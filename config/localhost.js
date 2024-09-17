const WETH = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f'
const USDC = '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318'
const USDT = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
const TUSD = '0x0000000000085d4780b73119b644ae5ecd22b376'

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: 'localhost',
  WETH: WETH,
  v1: {
    WETH_USDC_POOL: '0x9e423663BAC6c02200827B3703Df659870529cc3',
    contracts: {
      factory: {
        name: 'Factory',
        address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
        startBlock: 2
      },
      nonfungiblePositionManager: {
        name: 'NonfungiblePositionManager',
        address: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
        startBlock: 7
      },
      tokenConverter: {
        name: 'TokenConverter',
        address: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
        startBlock: 8
      }
    },
    stableCoins: [DAI, USDC, USDT, TUSD],
    whitelistAddresses: [
      WETH,
      DAI, // DAI
      USDC, // USDC
      USDT // USDT
    ]
  }
}
