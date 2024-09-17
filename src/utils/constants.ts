/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { Factory as FactoryContract } from '../types/templates/Pool/Factory'
import { TokenConverter as TokenConverterContract } from '../types/templates/Pool/TokenConverter'


export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const FACTORY_ADDRESS = '0xc7d28e12bc1744ac2c78a893f6282412e6d620ab'
export const TOKEN_CONVERTER_ADDRESS = '0x1245c83de3cc16193de8777ed597b677d789ac94'

export const WETH_ADDRESS = '0xb16f35c0ae2912430dac15764477e179d9b9ebea'
export const USDC_WETH_03_POOL = '0xc6f53004069bd066ec33c13f0b43e1212b9053d6'

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = '0xb16f35c0ae2912430dac15764477e179d9b9ebea,0xb2e07b4536b2e35d41dcb9b9c4f5c86e89a42663,0x8dd8f439d3478badb814f7b84d7a06d467ed3812,0x1e6951b73f44e7c71b43dfc1ffa63ca2eab2ceda'.split(',')

export const STABLE_COINS: string[] = '0x1e6951b73f44e7c71b43dfc1ffa63ca2eab2ceda,0xb2e07b4536b2e35d41dcb9b9c4f5c86e89a42663,0x8dd8f439d3478badb814f7b84d7a06d467ed3812'.split(',')
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