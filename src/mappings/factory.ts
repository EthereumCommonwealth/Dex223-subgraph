import { Address, BigInt, log } from '@graphprotocol/graph-ts'

import { PoolCreated } from '../types/Factory/Factory'
import { Factory } from '../types/schema'
import { Bundle, Pool, Token } from '../types/schema'
import { Pool as PoolTemplate } from '../types/templates'
import { STATIC_TOKEN_DEFINITIONS, StaticTokenDefinition } from '../utils/staticTokenDefinition'
import {
  fetchTokenDecimals,
  fetchTokenName,
  fetchTokenSymbol,
  fetchTokenTotalSupply,
  fetchTokenInConverter
} from '../utils/token'
import { ADDRESS_ZERO, FACTORY_ADDRESS, ONE_BI, ZERO_BD, ZERO_BI } from '../utils/constants'
import { WHITELIST_TOKENS } from '../utils/constants'

// The subgraph handler must have this signature to be able to handle events,
// however, we invoke a helper in order to inject dependencies for unit tests.
export function handlePoolCreated(event: PoolCreated): void {
  handlePoolCreatedHelper(event)
}

// Exported for unit tests
export function handlePoolCreatedHelper(
  event: PoolCreated,
  factoryAddress: string = FACTORY_ADDRESS,
  whitelistTokens: string[] = WHITELIST_TOKENS,
  staticTokenDefinitions: StaticTokenDefinition[] = STATIC_TOKEN_DEFINITIONS
): void {
  // temp fix
  if (event.params.pool == Address.fromHexString('0x8fe8d9bb8eeba3ed688069c3d6b556c9ca258248')) {
    return
  }

  // load factory
  let factory = Factory.load(factoryAddress)
  if (factory === null) {
    factory = new Factory(factoryAddress)
    factory.poolCount = ZERO_BI
    factory.totalVolumeETH = ZERO_BD
    factory.totalVolumeUSD = ZERO_BD
    factory.untrackedVolumeUSD = ZERO_BD
    factory.totalFeesUSD = ZERO_BD
    factory.totalFeesETH = ZERO_BD
    factory.totalValueLockedETH = ZERO_BD
    factory.totalValueLockedUSD = ZERO_BD
    factory.totalValueLockedUSDUntracked = ZERO_BD
    factory.totalValueLockedETHUntracked = ZERO_BD
    factory.txCount = ZERO_BI
    factory.owner = ADDRESS_ZERO

    // create new bundle for tracking eth price
    const bundle = new Bundle('1')
    bundle.ethPriceUSD = ZERO_BD
    bundle.save()
  }

  factory.poolCount = factory.poolCount.plus(ONE_BI)

  const pool = new Pool(event.params.pool.toHexString()) as Pool
  const token0AddressERC20 = event.params.token0_erc20
  const token1AddressERC20 = event.params.token1_erc20
  const token0AddressERC223 = event.params.token0_erc223
  const token1AddressERC223 = event.params.token1_erc223

  let token0 = Token.load(token0AddressERC20.toHexString())
  let token1 = Token.load(token1AddressERC20.toHexString())

  // fetch info if null
  if (token0 === null) {
    token0 = new Token(token0AddressERC20.toHexString())
    token0.symbol = fetchTokenSymbol(token0AddressERC20, token0AddressERC223, staticTokenDefinitions)
    token0.name = fetchTokenName(token0AddressERC20, token0AddressERC223, staticTokenDefinitions)
    token0.totalSupply = fetchTokenTotalSupply(token0AddressERC20, token0AddressERC223)
    token0.addressERC223 = token0AddressERC223.toHexString() || ADDRESS_ZERO

    const decimals = fetchTokenDecimals(token0AddressERC20, token0AddressERC223, staticTokenDefinitions)

    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      log.debug('mybug the decimal on token 0 was null', [])
      return
    }

    token0.inConverter = fetchTokenInConverter(token0AddressERC20)
    token0.decimals = decimals
    token0.derivedETH = ZERO_BD
    token0.volume = ZERO_BD
    token0.volumeUSD = ZERO_BD
    token0.feesUSD = ZERO_BD
    token0.untrackedVolumeUSD = ZERO_BD
    token0.totalValueLocked = ZERO_BD
    token0.totalValueLockedUSD = ZERO_BD
    token0.totalValueLockedUSDUntracked = ZERO_BD
    token0.txCount = ZERO_BI
    token0.poolCount = ZERO_BI
    token0.whitelistPools = []
  }

  if (token1 === null) {
    token1 = new Token(token1AddressERC20.toHexString())
    token1.symbol = fetchTokenSymbol(token1AddressERC20, token1AddressERC223, staticTokenDefinitions)
    token1.name = fetchTokenName(token1AddressERC20, token1AddressERC223, staticTokenDefinitions)
    token1.totalSupply = fetchTokenTotalSupply(token1AddressERC20, token1AddressERC223)
    token1.addressERC223 = token1AddressERC20.toHexString() || ADDRESS_ZERO

    const decimals = fetchTokenDecimals(token1AddressERC20, token1AddressERC223, staticTokenDefinitions)
    // bail if we couldn't figure out the decimals
    if (decimals === null) {
      log.debug('mybug the decimal on token 0 was null', [])
      return
    }
    token1.inConverter = fetchTokenInConverter(event.params.token1_erc20)

    token1.decimals = decimals
    token1.derivedETH = ZERO_BD
    token1.volume = ZERO_BD
    token1.volumeUSD = ZERO_BD
    token1.untrackedVolumeUSD = ZERO_BD
    token1.feesUSD = ZERO_BD
    token1.totalValueLocked = ZERO_BD
    token1.totalValueLockedUSD = ZERO_BD
    token1.totalValueLockedUSDUntracked = ZERO_BD
    token1.txCount = ZERO_BI
    token1.poolCount = ZERO_BI
    token1.whitelistPools = []
  }

  // update white listed pools
  if (whitelistTokens.includes(token0.id)) {
    const newPools = token1.whitelistPools
    newPools.push(pool.id)
    token1.whitelistPools = newPools
  }
  if (whitelistTokens.includes(token1.id)) {
    const newPools = token0.whitelistPools
    newPools.push(pool.id)
    token0.whitelistPools = newPools
  }

  pool.token0 = token0.id
  pool.token1 = token1.id
  pool.feeTier = BigInt.fromI32(event.params.fee)
  pool.createdAtTimestamp = event.block.timestamp
  pool.createdAtBlockNumber = event.block.number
  pool.liquidityProviderCount = ZERO_BI
  pool.txCount = ZERO_BI
  pool.liquidity = ZERO_BI
  pool.sqrtPrice = ZERO_BI
  pool.token0Price = ZERO_BD
  pool.token1Price = ZERO_BD
  pool.observationIndex = ZERO_BI
  pool.totalValueLockedToken0 = ZERO_BD
  pool.totalValueLockedToken1 = ZERO_BD
  pool.totalValueLockedUSD = ZERO_BD
  pool.totalValueLockedETH = ZERO_BD
  pool.totalValueLockedUSDUntracked = ZERO_BD
  pool.volumeToken0 = ZERO_BD
  pool.volumeToken1 = ZERO_BD
  pool.volumeUSD = ZERO_BD
  pool.feesUSD = ZERO_BD
  pool.untrackedVolumeUSD = ZERO_BD

  pool.collectedFeesToken0 = ZERO_BD
  pool.collectedFeesToken1 = ZERO_BD
  pool.collectedFeesUSD = ZERO_BD

  pool.save()
  // create the tracked contract based on the template
  PoolTemplate.create(event.params.pool)
  token0.save()
  token1.save()
  factory.save()
}
