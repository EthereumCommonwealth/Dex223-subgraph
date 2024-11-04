/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { Factory as FactoryContract } from '../types/templates/Pool/Factory'
import { TokenConverter as TokenConverterContract } from '../types/templates/Pool/TokenConverter'


export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const FACTORY_ADDRESS = '0x8524c3bd49cd455ea0102bf194add2f21165e049'
export const TOKEN_CONVERTER_ADDRESS = '0x18eedef5d3d21c2828ca8557bef7210bfa481bc2'

export const WETH_ADDRESS = '0xae13d989dac2f0debff460ac112a837c89baa7cd'
export const USDC_WETH_03_POOL = '0x76e82368c26488d4daf3008a92dde2477f0bcca6'

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = '0xae13d989dac2f0debff460ac112a837c89baa7cd,0x431cc175bafb82c2415a94ef6103e124f289959e'.split(',')

export const STABLE_COINS: string[] = '0x431cc175bafb82c2415a94ef6103e124f289959e'.split(',')
export const STABLECOIN_IS_TOKEN0 = true


export let MINIMUM_ETH_LOCKED = BigDecimal.fromString('60')

export let Q192 = BigDecimal.fromString('6277101735386680763835789423207666416102355444464034512896') // 2^192

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export let factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS))
export let tokenConverterContract = TokenConverterContract.bind(Address.fromString(TOKEN_CONVERTER_ADDRESS))