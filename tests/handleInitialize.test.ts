import { Address, BigDecimal, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as'

import { handleInitializeHelper } from '../src/mappings/pool/initialize'
import { Bundle, Pool, Token } from '../src/types/schema'
import { Initialize } from '../src/types/templates/Pool/Pool'
import { safeDiv } from '../src/utils'
import { ADDRESS_ZERO, ZERO_BD, ZERO_BI } from '../src/utils/constants'
import { findEthPerToken, getEthPriceInUSD } from '../src/utils/pricing'
import {
  assertObjectMatches,
  createAndStoreTestPool,
  createAndStoreTestToken,
  MOCK_EVENT,
  POOL_FEE_TIER_03,
  TEST_ETH_PRICE_USD,
  USDC_MAINNET_FIXTURE,
  USDC_WETH_03_MAINNET_POOL,
  WBTC_MAINNET_FIXTURE,
  WBTC_WETH_03_MAINNET_POOL,
  WETH_MAINNET_FIXTURE,
} from './constants'

class InitializeFixture {
  sqrtPriceX96: BigInt
  tick: i32
}

const INITIALIZE_FIXTURE: InitializeFixture = {
  sqrtPriceX96: BigInt.fromString('1111111111111111'),
  tick: 194280,
}

const INITIALIZE_EVENT = new Initialize(
  Address.fromString(USDC_WETH_03_MAINNET_POOL),
  MOCK_EVENT.logIndex,
  MOCK_EVENT.transactionLogIndex,
  MOCK_EVENT.logType,
  MOCK_EVENT.block,
  MOCK_EVENT.transaction,
  [
    new ethereum.EventParam('sqrtPriceX96', ethereum.Value.fromUnsignedBigInt(INITIALIZE_FIXTURE.sqrtPriceX96)),
    new ethereum.EventParam('tick', ethereum.Value.fromI32(INITIALIZE_FIXTURE.tick)),
  ],
  MOCK_EVENT.receipt,
)

describe('handleInitialize', () => {
  test('success', () => {
    createAndStoreTestPool(
      USDC_WETH_03_MAINNET_POOL,
      USDC_MAINNET_FIXTURE.addressERC20,
      WETH_MAINNET_FIXTURE.addressERC20,
      POOL_FEE_TIER_03,
    )

    const token0 = createAndStoreTestToken(USDC_MAINNET_FIXTURE)
    const token1 = createAndStoreTestToken(WETH_MAINNET_FIXTURE)

    const bundle = new Bundle('1')
    bundle.ethPriceUSD = TEST_ETH_PRICE_USD
    bundle.save()

    const stablecoinWrappedNativePoolAddress = USDC_WETH_03_MAINNET_POOL
    const stablecoinIsToken0 = true
    const wrappedNativeAddress = WETH_MAINNET_FIXTURE.addressERC20
    const stablecoinAddresses = [USDC_MAINNET_FIXTURE.addressERC20]
    const minimumEthLocked = ZERO_BD

    handleInitializeHelper(
      INITIALIZE_EVENT,
      stablecoinWrappedNativePoolAddress,
      stablecoinIsToken0,
      wrappedNativeAddress,
      stablecoinAddresses,
      minimumEthLocked,
    )

    assertObjectMatches('Pool', USDC_WETH_03_MAINNET_POOL, [
      ['sqrtPrice', INITIALIZE_FIXTURE.sqrtPriceX96.toString()],
      ['tick', INITIALIZE_FIXTURE.tick.toString()],
    ])

    const expectedEthPrice = getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, true)
    assertObjectMatches('Bundle', '1', [['ethPriceUSD', expectedEthPrice.toString()]])

    const expectedToken0Price = findEthPerToken(
      token0 as Token,
      wrappedNativeAddress,
      stablecoinAddresses,
      minimumEthLocked,
    )
    assertObjectMatches('Token', USDC_MAINNET_FIXTURE.addressERC20, [['derivedETH', expectedToken0Price.toString()]])

    const expectedToken1Price = findEthPerToken(
      token1 as Token,
      wrappedNativeAddress,
      stablecoinAddresses,
      minimumEthLocked,
    )
    assertObjectMatches('Token', WETH_MAINNET_FIXTURE.addressERC20, [['derivedETH', expectedToken1Price.toString()]])
  })
})

function saveEthPriceUSD(ethPriceUSD: BigDecimal): void {
  const bundle = new Bundle('1')
  bundle.ethPriceUSD = ethPriceUSD
  bundle.save()
}

describe('getEthPriceInUSD', () => {
  beforeEach(() => {
    clearStore()
    createAndStoreTestPool(
      USDC_WETH_03_MAINNET_POOL,
      USDC_MAINNET_FIXTURE.addressERC20,
      WETH_MAINNET_FIXTURE.addressERC20,
      POOL_FEE_TIER_03
    )
  })

  test('success - stablecoin is token0', () => {
    const pool = Pool.load(USDC_WETH_03_MAINNET_POOL)!
    pool.token0Price = BigDecimal.fromString('1')
    pool.save()

    const ethPriceUSD = getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, true)

    assert.assertTrue(ethPriceUSD == BigDecimal.fromString('1'))
  })

  test('success - stablecoin is token1', () => {
    const pool = Pool.load(USDC_WETH_03_MAINNET_POOL)!
    pool.token1Price = BigDecimal.fromString('1')
    pool.save()

    const ethPriceUSD = getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, false)

    assert.assertTrue(ethPriceUSD == BigDecimal.fromString('1'))
  })

  test('failure - pool not found', () => {
    const pool = Pool.load(USDC_WETH_03_MAINNET_POOL)!
    pool.token0Price = BigDecimal.fromString('1')
    pool.token1Price = BigDecimal.fromString('1')
    pool.save()

    const ethPriceUSD = getEthPriceInUSD(ADDRESS_ZERO)
    assert.assertTrue(ethPriceUSD == BigDecimal.fromString('0'))
  })

  test('success - healthy pool sets the price over the previous one', () => {
    saveEthPriceUSD(TEST_ETH_PRICE_USD)
    const pool = Pool.load(USDC_WETH_03_MAINNET_POOL)!
    pool.liquidity = BigInt.fromString('2632671270799841')
    pool.totalValueLockedToken0 = BigDecimal.fromString('5066.918773')
    pool.token0Price = BigDecimal.fromString('1809.837026')
    pool.save()

    const ethPriceUSD = getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, true, BigDecimal.fromString('100'))

    assert.assertTrue(ethPriceUSD == BigDecimal.fromString('1809.837026'))
  })

  test('success - pool with no liquidity in range keeps the previous price', () => {
    // a sale ran past the last position: the pool sits at the tick limit and its price is meaningless
    saveEthPriceUSD(TEST_ETH_PRICE_USD)
    const pool = Pool.load(USDC_WETH_03_MAINNET_POOL)!
    pool.liquidity = ZERO_BI
    pool.totalValueLockedToken0 = BigDecimal.fromString('5066.918773')
    pool.token0Price = BigDecimal.fromString('0.000000000000000000000000002939')
    pool.token1Price = BigDecimal.fromString('0.000000000000000000000000002939')
    pool.save()

    assert.assertTrue(getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, true, ZERO_BD) == TEST_ETH_PRICE_USD)
    assert.assertTrue(getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, false, ZERO_BD) == TEST_ETH_PRICE_USD)
  })

  test('success - stablecoin side below the floor keeps the previous price', () => {
    saveEthPriceUSD(TEST_ETH_PRICE_USD)
    const pool = Pool.load(USDC_WETH_03_MAINNET_POOL)!
    pool.liquidity = BigInt.fromString('2632671270799841')
    pool.totalValueLockedToken0 = BigDecimal.fromString('5')
    pool.totalValueLockedToken1 = BigDecimal.fromString('5000')
    pool.token0Price = BigDecimal.fromString('0.5')
    pool.token1Price = BigDecimal.fromString('2')
    pool.save()

    const floor = BigDecimal.fromString('10')
    // token0 is the stablecoin and holds 5 of it: held
    assert.assertTrue(getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, true, floor) == TEST_ETH_PRICE_USD)
    // the floor reads the stablecoin's side only: with token1 as the stablecoin, 5000 is enough
    assert.assertTrue(getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, false, floor) == BigDecimal.fromString('2'))
    // a floor of 0 turns the check off
    assert.assertTrue(getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, true, ZERO_BD) == BigDecimal.fromString('0.5'))
  })

  test('success - first price, with no previous price, is read from the pool as before', () => {
    const pool = Pool.load(USDC_WETH_03_MAINNET_POOL)!
    pool.token0Price = BigDecimal.fromString('1')
    pool.save()
    const floor = BigDecimal.fromString('10')

    // no liquidity and no stablecoin locked, but nothing to keep: no Bundle yet, then a Bundle still at 0
    assert.assertTrue(getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, true, floor) == BigDecimal.fromString('1'))
    saveEthPriceUSD(ZERO_BD)
    assert.assertTrue(getEthPriceInUSD(USDC_WETH_03_MAINNET_POOL, true, floor) == BigDecimal.fromString('1'))
  })
})

describe('findEthPerToken', () => {
  beforeEach(() => {
    clearStore()

    const bundle = new Bundle('1')
    bundle.ethPriceUSD = TEST_ETH_PRICE_USD
    bundle.save()
  })

  test('success - token is wrapped native', () => {
    const token = createAndStoreTestToken(WETH_MAINNET_FIXTURE)
    const ethPerToken = findEthPerToken(token as Token, WETH_MAINNET_FIXTURE.addressERC20)
    assert.assertTrue(ethPerToken == BigDecimal.fromString('1'))
  })

  test('success - token is stablecoin', () => {
    const token = createAndStoreTestToken(USDC_MAINNET_FIXTURE)
    const ethPerToken = findEthPerToken(token as Token, WETH_MAINNET_FIXTURE.addressERC20, [USDC_MAINNET_FIXTURE.addressERC20])
    const expectedStablecoinPrice = safeDiv(BigDecimal.fromString('1'), TEST_ETH_PRICE_USD)
    assert.assertTrue(ethPerToken == expectedStablecoinPrice)
  })

  test('success - token is not wrapped native or stablecoin', () => {
    const pool = createAndStoreTestPool(
      WBTC_WETH_03_MAINNET_POOL,
      WBTC_MAINNET_FIXTURE.addressERC20,
      WETH_MAINNET_FIXTURE.addressERC20,
      POOL_FEE_TIER_03,
    )

    const minimumEthLocked = BigDecimal.fromString('0')

    pool.liquidity = BigInt.fromString('100')
    pool.totalValueLockedToken1 = BigDecimal.fromString('100')
    pool.token1Price = BigDecimal.fromString('5')
    pool.save()

    const token0 = createAndStoreTestToken(WBTC_MAINNET_FIXTURE)
    token0.whitelistPools = [WBTC_WETH_03_MAINNET_POOL]
    token0.save()

    const token1 = createAndStoreTestToken(WETH_MAINNET_FIXTURE)
    token1.derivedETH = BigDecimal.fromString('10')
    token1.save()

    const ethPerToken = findEthPerToken(
      token0 as Token,
      WETH_MAINNET_FIXTURE.addressERC20,
      [USDC_MAINNET_FIXTURE.addressERC20],
      minimumEthLocked,
    )

    assert.assertTrue(ethPerToken == BigDecimal.fromString('50'))
  })

  test('success - token is not wrapped native or stablecoin, but has no pools', () => {
    const token0 = createAndStoreTestToken(WBTC_MAINNET_FIXTURE)
    const ethPerToken = findEthPerToken(token0 as Token)
    assert.assertTrue(ethPerToken == BigDecimal.fromString('0'))
  })

  test('success - token is not wrapped native or stablecoin, but has no pools with liquidity', () => {
    const token0 = createAndStoreTestToken(WBTC_MAINNET_FIXTURE)
    token0.whitelistPools = [WBTC_WETH_03_MAINNET_POOL]
    token0.save()

    const ethPerToken = findEthPerToken(token0 as Token)
    assert.assertTrue(ethPerToken == BigDecimal.fromString('0'))
  })
})
