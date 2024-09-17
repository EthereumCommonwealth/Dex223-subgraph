import { Address, BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { assert, createMockedFunction, newMockEvent } from 'matchstick-as'

import { handlePoolCreatedHelper } from '../src/mappings/factory'
import { PoolCreated } from '../src/types/Factory/Factory'
import { Pool, Token } from '../src/types/schema'
import { ZERO_BD, ZERO_BI, ADDRESS_ZERO, TOKEN_CONVERTER_ADDRESS, USDC_WETH_03_POOL } from '../src/utils/constants'

const USDC_MAINNET_ADDRESS_ERC20 = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'.toLowerCase()
const USDC_MAINNET_ADDRESS_ERC223 = '0x247c52296051F2bd9f18834812e5c3a0B200A351'.toLowerCase()

const WETH_MAINNET_ADDRESS_ERC20 = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'.toLowerCase()
const WETH_MAINNET_ADDRESS_ERC223 = '0x8D68273683B545BD31C956f51a336E3eEb45eAa5'.toLowerCase()

const WBTC_MAINNET_ADDRESS_ERC20 = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'.toLowerCase()
const WBTC_MAINNET_ADDRESS_ERC223 = '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1'.toLowerCase()

export const USDC_WETH_03_MAINNET_POOL = USDC_WETH_03_POOL
export const WBTC_WETH_03_MAINNET_POOL = '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed'.toLowerCase()
export const POOL_FEE_TIER_03 = 3000
export const POOL_TICK_SPACING_03 = 60

export class TokenFixture {
  addressERC20: string
  addressERC223: string
  symbol: string
  name: string
  totalSupply: string
  decimals: string
  inConverter: boolean
}

export const USDC_MAINNET_FIXTURE: TokenFixture = {
  addressERC20: USDC_MAINNET_ADDRESS_ERC20,
  addressERC223: USDC_MAINNET_ADDRESS_ERC223,
  symbol: 'USDC',
  name: 'USD Coin',
  totalSupply: '300',
  decimals: '6',
  inConverter: true
}

export const WETH_MAINNET_FIXTURE: TokenFixture = {
  addressERC20: WETH_MAINNET_ADDRESS_ERC20,
  addressERC223: WETH_MAINNET_ADDRESS_ERC223,
  symbol: 'WETH',
  name: 'Wrapped Ether',
  totalSupply: '100',
  decimals: '18',
  inConverter: true
}

export const WBTC_MAINNET_FIXTURE: TokenFixture = {
  addressERC20: WBTC_MAINNET_ADDRESS_ERC20,
  addressERC223: WBTC_MAINNET_ADDRESS_ERC223,
  symbol: 'WBTC',
  name: 'Wrapped Bitcoin',
  totalSupply: '200',
  decimals: '8',
  inConverter: false
}

export const TEST_ETH_PRICE_USD = BigDecimal.fromString('2000')
export const TEST_USDC_DERIVED_ETH = BigDecimal.fromString('1').div(BigDecimal.fromString('2000'))
export const TEST_WETH_DERIVED_ETH = BigDecimal.fromString('1')

export const MOCK_EVENT = newMockEvent()

export const invokePoolCreatedWithMockedEthCalls = (
  mockEvent: ethereum.Event,
  factoryAddress: string,
  token0: TokenFixture,
  token1: TokenFixture,
  poolAddressHexString: string,
  feeTier: number,
  tickSpacing: number
): void => {
  const mockEvent = newMockEvent()
  const token0ERC20Address = Address.fromString(token0.addressERC20)
  const token0ERC223Address = Address.fromString(token0.addressERC223)

  const token1ERC20Address = Address.fromString(token1.addressERC20)
  const token1ERC223Address = Address.fromString(token1.addressERC223)

  const poolAddress = Address.fromString(poolAddressHexString)
  const parameters = [
    new ethereum.EventParam('token0_ecr20', ethereum.Value.fromAddress(token0ERC20Address)),
    new ethereum.EventParam('token1_ecr20', ethereum.Value.fromAddress(token1ERC20Address)),
    new ethereum.EventParam('token0_ecr223', ethereum.Value.fromAddress(token0ERC223Address)),
    new ethereum.EventParam('token1_erc223', ethereum.Value.fromAddress(token1ERC223Address)),
    new ethereum.EventParam('fee', ethereum.Value.fromI32(feeTier as i32)),
    new ethereum.EventParam('tickSpacing', ethereum.Value.fromI32(tickSpacing as i32)),
    new ethereum.EventParam('pool', ethereum.Value.fromAddress(poolAddress))
  ]
  const poolCreatedEvent = new PoolCreated(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    parameters,
    mockEvent.receipt
  )
  const tokenFixtures = [token0, token1]
  for (let i = 0; i < tokenFixtures.length; i++) {
    const token = tokenFixtures[i]
    const addresses = [token.addressERC20, token.addressERC223]
    for (let j = 0; j < addresses.length; j++) {
      const address = addresses[j]

      createMockedFunction(Address.fromString(address), 'symbol', 'symbol():(string)').returns([
        ethereum.Value.fromString(token.symbol)
      ])

      createMockedFunction(Address.fromString(address), 'name', 'name():(string)').returns([
        ethereum.Value.fromString(token.name)
      ])
      createMockedFunction(Address.fromString(address), 'decimals', 'decimals():(uint32)').returns([
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(token.decimals))
      ])

      createMockedFunction(Address.fromString(address), 'totalSupply', 'totalSupply():(uint256)').returns([
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString(token.totalSupply))
      ])
    }
    createMockedFunction(
      Address.fromString(TOKEN_CONVERTER_ADDRESS),
      'getERC223WrapperFor',
      'getERC223WrapperFor(address):(address,string)'
    )
      .withArgs([ethereum.Value.fromAddress(Address.fromString(token.addressERC20))])
      .returns([
        ethereum.Value.fromAddress(Address.fromString(token.addressERC223)),
        ethereum.Value.fromString('ERC-223')
      ])
    createMockedFunction(
      Address.fromString(TOKEN_CONVERTER_ADDRESS),
      'getERC223WrapperFor',
      'getERC223WrapperFor(address):(address,string)'
    )
      .withArgs([ethereum.Value.fromAddress(Address.fromString(token.addressERC223))])
      .returns([ethereum.Value.fromAddress(Address.fromString(ADDRESS_ZERO)), ethereum.Value.fromString('Error')])
  }

  handlePoolCreatedHelper(poolCreatedEvent, factoryAddress, [token0.addressERC20, token1.addressERC20])
}

// More lightweight than the method above which invokes handlePoolCreated. This
// method only creates the pool entity while the above method also creates the
// relevant token and factory entities.
export const createAndStoreTestPool = (
  poolAddress: string,
  token0Address: string,
  token1Address: string,
  feeTier: i32
): Pool => {
  const pool = new Pool(poolAddress)
  pool.createdAtTimestamp = ZERO_BI
  pool.createdAtBlockNumber = ZERO_BI
  pool.token0 = token0Address
  pool.token1 = token1Address
  pool.feeTier = BigInt.fromI32(feeTier)
  pool.liquidity = ZERO_BI
  pool.sqrtPrice = ZERO_BI
  pool.token0Price = ZERO_BD
  pool.token1Price = ZERO_BD
  pool.tick = ZERO_BI
  pool.observationIndex = ZERO_BI
  pool.volumeToken0 = ZERO_BD
  pool.volumeToken1 = ZERO_BD
  pool.volumeUSD = ZERO_BD
  pool.untrackedVolumeUSD = ZERO_BD
  pool.feesUSD = ZERO_BD
  pool.txCount = ZERO_BI
  pool.collectedFeesToken0 = ZERO_BD
  pool.collectedFeesToken1 = ZERO_BD
  pool.collectedFeesUSD = ZERO_BD
  pool.totalValueLockedToken0 = ZERO_BD
  pool.totalValueLockedToken1 = ZERO_BD
  pool.totalValueLockedUSD = ZERO_BD
  pool.totalValueLockedETH = ZERO_BD
  pool.totalValueLockedUSDUntracked = ZERO_BD
  pool.liquidityProviderCount = ZERO_BI

  pool.save()
  return pool
}

export const createAndStoreTestToken = (tokenFixture: TokenFixture): Token => {
  const token = new Token(tokenFixture.addressERC20)
  token.symbol = tokenFixture.symbol
  token.name = tokenFixture.name
  token.decimals = BigInt.fromString(tokenFixture.decimals)
  token.totalSupply = BigInt.fromString(tokenFixture.totalSupply)
  token.addressERC223 = tokenFixture.addressERC223
  token.inConverter = tokenFixture.inConverter
  token.volume = ZERO_BD
  token.volumeUSD = ZERO_BD
  token.untrackedVolumeUSD = ZERO_BD
  token.feesUSD = ZERO_BD
  token.txCount = ZERO_BI
  token.poolCount = ZERO_BI
  token.totalValueLocked = ZERO_BD
  token.totalValueLockedUSD = ZERO_BD
  token.totalValueLockedUSDUntracked = ZERO_BD
  token.derivedETH = ZERO_BD
  token.whitelistPools = []

  token.save()
  return token
}

// Typescript for Subgraphs do not support Record types so we use a 2D string array to represent the object instead.
export const assertObjectMatches = (entityType: string, id: string, obj: string[][]): void => {
  for (let i = 0; i < obj.length; i++) {
    assert.fieldEquals(entityType, id, obj[i][0], obj[i][1])
  }
}
