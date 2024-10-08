/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { Factory as FactoryContract } from '../types/templates/Pool/Factory'
import { TokenConverter as TokenConverterContract } from '../types/templates/Pool/TokenConverter'


export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const FACTORY_ADDRESS = '0x8524c3bd49cd455ea0102bf194add2f21165e049'
export const TOKEN_CONVERTER_ADDRESS = '0x044845fb22b4258d83a6c24b2fb061afeba7e5b9'

export const WETH_ADDRESS = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14'
export const USDC_WETH_03_POOL = '0xc1ae0a4782a42a76637ab49001f1f370888053da'

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14,0x44649c38615ad4426c16cd5d5059e6e74b87234a,0x8dd8f439d3478badb814f7b84d7a06d467ed3812,0x1e6951b73f44e7c71b43dfc1ffa63ca2eab2ceda'.split(',')

export const STABLE_COINS: string[] = '0x1e6951b73f44e7c71b43dfc1ffa63ca2eab2ceda,0x44649c38615ad4426c16cd5d5059e6e74b87234a,0x8dd8f439d3478badb814f7b84d7a06d467ed3812'.split(',')
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