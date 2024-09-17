import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { assert, createMockedFunction, test, describe } from 'matchstick-as/assembly/index'

import { NULL_ETH_HEX_STRING } from '../src/utils'
import { FACTORY_ADDRESS } from '../src/utils/constants'
import { StaticTokenDefinition } from '../src/utils/staticTokenDefinition'
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol, fetchTokenTotalSupply } from '../src/utils/token'
import {
  assertObjectMatches,
  invokePoolCreatedWithMockedEthCalls,
  MOCK_EVENT,
  POOL_FEE_TIER_03,
  POOL_TICK_SPACING_03,
  USDC_MAINNET_FIXTURE,
  USDC_WETH_03_MAINNET_POOL,
  WETH_MAINNET_FIXTURE
} from './constants'

describe('handlePoolCreated', () => {
  test('success - create a pool', () => {
    assert.notInStore('Factory', FACTORY_ADDRESS)
    assert.notInStore('Pool', USDC_WETH_03_MAINNET_POOL)
    assert.notInStore('Token', USDC_MAINNET_FIXTURE.addressERC20)
    assert.notInStore('Token', USDC_MAINNET_FIXTURE.addressERC20)
    // assert.notInStore('Token', USDC_MAINNET_FIXTURE.addressERC223)
    // assert.notInStore('Token', USDC_MAINNET_FIXTURE.addressERC223)

    invokePoolCreatedWithMockedEthCalls(
      MOCK_EVENT,
      FACTORY_ADDRESS,
      USDC_MAINNET_FIXTURE,
      WETH_MAINNET_FIXTURE,
      USDC_WETH_03_MAINNET_POOL,
      POOL_FEE_TIER_03,
      POOL_TICK_SPACING_03
    )

    assertObjectMatches('Factory', FACTORY_ADDRESS, [
      ['poolCount', '1'],
      ['totalVolumeETH', '0'],
      ['totalVolumeUSD', '0'],
      ['untrackedVolumeUSD', '0'],
      ['totalFeesUSD', '0'],
      ['totalFeesETH', '0'],
      ['totalValueLockedETH', '0'],
      ['totalValueLockedUSD', '0'],
      ['totalValueLockedETHUntracked', '0'],
      ['totalValueLockedUSDUntracked', '0']
    ])

    assertObjectMatches('Bundle', '1', [['ethPriceUSD', '0']])

    assertObjectMatches('Token', USDC_MAINNET_FIXTURE.addressERC20, [
      ['symbol', USDC_MAINNET_FIXTURE.symbol],
      ['name', USDC_MAINNET_FIXTURE.name],
      ['totalSupply', USDC_MAINNET_FIXTURE.totalSupply],
      ['decimals', USDC_MAINNET_FIXTURE.decimals],
      ['addressERC223', USDC_MAINNET_FIXTURE.addressERC223],
      ['derivedETH', '0'],
      ['volume', '0'],
      ['volumeUSD', '0'],
      ['feesUSD', '0'],
      ['untrackedVolumeUSD', '0'],
      ['totalValueLocked', '0'],
      ['totalValueLockedUSD', '0'],
      ['totalValueLockedUSDUntracked', '0'],
      ['txCount', '0'],
      ['poolCount', '0'],
      ['whitelistPools', `[${USDC_WETH_03_MAINNET_POOL}]`]
    ])

    assertObjectMatches('Token', WETH_MAINNET_FIXTURE.addressERC20, [
      ['symbol', WETH_MAINNET_FIXTURE.symbol],
      ['name', WETH_MAINNET_FIXTURE.name],
      ['totalSupply', WETH_MAINNET_FIXTURE.totalSupply],
      ['decimals', WETH_MAINNET_FIXTURE.decimals],
      ['derivedETH', '0'],
      ['volume', '0'],
      ['volumeUSD', '0'],
      ['feesUSD', '0'],
      ['untrackedVolumeUSD', '0'],
      ['totalValueLocked', '0'],
      ['totalValueLockedUSD', '0'],
      ['totalValueLockedUSDUntracked', '0'],
      ['txCount', '0'],
      ['poolCount', '0'],
      ['whitelistPools', `[${USDC_WETH_03_MAINNET_POOL}]`]
    ])

    assertObjectMatches('Pool', USDC_WETH_03_MAINNET_POOL, [
      ['token0', USDC_MAINNET_FIXTURE.addressERC20],
      ['token1', WETH_MAINNET_FIXTURE.addressERC20],
      ['feeTier', POOL_FEE_TIER_03.toString()],
      ['createdAtTimestamp', MOCK_EVENT.block.timestamp.toString()],
      ['createdAtBlockNumber', MOCK_EVENT.block.number.toString()],
      ['liquidityProviderCount', '0'],
      ['txCount', '0'],
      ['sqrtPrice', '0'],
      ['token0Price', '0'],
      ['token1Price', '0'],
      ['observationIndex', '0'],
      ['totalValueLockedToken0', '0'],
      ['totalValueLockedToken1', '0'],
      ['totalValueLockedUSD', '0'],
      ['totalValueLockedETH', '0'],
      ['totalValueLockedUSDUntracked', '0'],
      ['volumeToken0', '0'],
      ['volumeToken1', '0'],
      ['volumeUSD', '0'],
      ['feesUSD', '0'],
      ['untrackedVolumeUSD', '0'],
      ['collectedFeesToken0', '0'],
      ['collectedFeesToken1', '0'],
      ['collectedFeesUSD', '0']
    ])
  })

  describe('fetchTokenSymbol', () => {
    test('success - fetch token symbol', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'symbol', 'symbol():(string)').returns([ethereum.Value.fromString('USDC')])
      const symbol = fetchTokenSymbol(usdcAddressERC20, usdcAddressERC223)
      assert.stringEquals(symbol, 'USDC')
    })

    test('success - fetch token symbol falls back to bytes call', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'symbol', 'symbol():(string)').reverts()
      createMockedFunction(usdcAddressERC20, 'symbol', 'symbol():(bytes32)').returns([
        ethereum.Value.fromBytes(Bytes.fromUTF8('USDC'))
      ])
      const symbol = fetchTokenSymbol(usdcAddressERC20, usdcAddressERC223)
      assert.stringEquals(symbol, 'USDC')
    })

    test('success - fetch token symbol falls back to static definition', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'symbol', 'symbol():(string)').reverts()
      createMockedFunction(usdcAddressERC20, 'symbol', 'symbol():(bytes32)').returns([
        ethereum.Value.fromBytes(Bytes.fromHexString(NULL_ETH_HEX_STRING))
      ])
      const staticDefinitions: Array<StaticTokenDefinition> = [
        {
          address: Address.fromString(USDC_MAINNET_FIXTURE.addressERC20),
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: BigInt.fromI32(6)
        }
      ]
      const symbol = fetchTokenSymbol(usdcAddressERC20, usdcAddressERC223, staticDefinitions)
      assert.stringEquals(symbol, 'USDC')
    })

    test('failure - fetch token symbol reverts', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'symbol', 'symbol():(string)').reverts()
      createMockedFunction(usdcAddressERC20, 'symbol', 'symbol():(bytes32)').reverts()
      createMockedFunction(usdcAddressERC223, 'symbol', 'symbol():(string)').reverts()
      createMockedFunction(usdcAddressERC223, 'symbol', 'symbol():(bytes32)').reverts()
      const symbol = fetchTokenSymbol(usdcAddressERC20, usdcAddressERC223)
      assert.stringEquals(symbol, 'unknown')
    })
  })

  describe('fetchTokenName', () => {
    test('success - fetch token name', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'name', 'name():(string)').returns([ethereum.Value.fromString('USD Coin')])
      const name = fetchTokenName(usdcAddressERC20, usdcAddressERC223)
      assert.stringEquals(name, 'USD Coin')
    })

    test('success - fetch token name falls back to bytes call', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'name', 'name():(string)').reverts()
      createMockedFunction(usdcAddressERC20, 'name', 'name():(bytes32)').returns([
        ethereum.Value.fromBytes(Bytes.fromUTF8('USD Coin'))
      ])
      const name = fetchTokenName(usdcAddressERC20, usdcAddressERC223)
      assert.stringEquals(name, 'USD Coin')
    })

    test('success - fetch token name falls back to static definition', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'name', 'name():(string)').reverts()
      createMockedFunction(usdcAddressERC20, 'name', 'name():(bytes32)').returns([
        ethereum.Value.fromBytes(Bytes.fromHexString(NULL_ETH_HEX_STRING))
      ])
      const staticDefinitions: Array<StaticTokenDefinition> = [
        {
          address: Address.fromString(USDC_MAINNET_FIXTURE.addressERC20),
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: BigInt.fromI32(6)
        }
      ]
      const name = fetchTokenName(usdcAddressERC20, usdcAddressERC223, staticDefinitions)
      assert.stringEquals(name, 'USD Coin')
    })

    test('failure - fetch token name reverts', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'name', 'name():(string)').reverts()
      createMockedFunction(usdcAddressERC20, 'name', 'name():(bytes32)').reverts()
      createMockedFunction(usdcAddressERC223, 'name', 'name():(string)').reverts()
      createMockedFunction(usdcAddressERC223, 'name', 'name():(bytes32)').reverts()
      const name = fetchTokenName(usdcAddressERC20, usdcAddressERC223)
      assert.stringEquals(name, 'unknown')
    })
  })

  describe('fetchTokenTotalSupply', () => {
    test('success - fetch token total supply', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)

      createMockedFunction(usdcAddressERC20, 'totalSupply', 'totalSupply():(uint256)').returns([
        ethereum.Value.fromUnsignedBigInt(BigInt.fromString('300'))
      ])
      const totalSupply = fetchTokenTotalSupply(usdcAddressERC20, usdcAddressERC223)
      assert.bigIntEquals(totalSupply, BigInt.fromString('300'))
    })

    test('failure - fetch token total supply reverts', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'totalSupply', 'totalSupply():(uint256)').reverts()
      createMockedFunction(usdcAddressERC223, 'totalSupply', 'totalSupply():(uint256)').reverts()
      const totalSupply = fetchTokenTotalSupply(usdcAddressERC20, usdcAddressERC223)
      assert.bigIntEquals(totalSupply, BigInt.zero())
    })
  })

  describe('fetchTokenDecimals', () => {
    test('success - fetch token decimals', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'decimals', 'decimals():(uint32)').returns([
        ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(6))
      ])
      const decimals = fetchTokenDecimals(usdcAddressERC20, usdcAddressERC223)
      assert.assertTrue(decimals == BigInt.fromI32(6))
    })

    test('success - fetch token decimals falls back to static definition', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'decimals', 'decimals():(uint32)').reverts()
      const staticDefinitions: Array<StaticTokenDefinition> = [
        {
          address: Address.fromString(USDC_MAINNET_FIXTURE.addressERC20),
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: BigInt.fromI32(6)
        }
      ]
      const decimals = fetchTokenDecimals(usdcAddressERC20, usdcAddressERC223, staticDefinitions)
      assert.assertTrue(decimals == BigInt.fromI32(6))
    })

    test('failure - fetch token decimals reverts', () => {
      const usdcAddressERC20 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC20)
      const usdcAddressERC223 = Address.fromString(USDC_MAINNET_FIXTURE.addressERC223)
      createMockedFunction(usdcAddressERC20, 'decimals', 'decimals():(uint32)').reverts()
      createMockedFunction(usdcAddressERC223, 'decimals', 'decimals():(uint32)').reverts()
      const decimals: BigInt | null = fetchTokenDecimals(usdcAddressERC20, usdcAddressERC223)
      assert.assertTrue(decimals === null)
    })
  })
})
