/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import { Factory as FactoryContract } from '../types/templates/Pool/Factory'
import { TokenConverter as TokenConverterContract } from '../types/templates/Pool/TokenConverter'


export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const FACTORY_ADDRESS = '0xf07cc56e969bc08395e80da099e44d122bfa42b9'
export const TOKEN_CONVERTER_ADDRESS = '0x5847f5c0e09182d9e75fe8b1617786f62fee0d9f'

export const WETH_ADDRESS = '0xb16f35c0ae2912430dac15764477e179d9b9ebea'
export const USDC_WETH_03_POOL = '0xc146f2eff11eaed03e7a6cdf723678509179c1f4'

// token where amounts should contribute to tracked volume and liquidity
// usually tokens that many tokens are paired with s
export const WHITELIST_TOKENS: string[] = '0xb16f35c0ae2912430dac15764477e179d9b9ebea,0x44649c38615ad4426c16cd5d5059e6e74b87234a,0x8dd8f439d3478badb814f7b84d7a06d467ed3812,0x1e6951b73f44e7c71b43dfc1ffa63ca2eab2ceda'.split(',')

export const STABLE_COINS: string[] = '0x1e6951b73f44e7c71b43dfc1ffa63ca2eab2ceda,0x44649c38615ad4426c16cd5d5059e6e74b87234a,0x8dd8f439d3478badb814f7b84d7a06d467ed3812'.split(',')
// true if the stablecoin sorts before WETH, so it is token0 of USDC_WETH_03_POOL
export const STABLECOIN_IS_TOKEN0 = true


// in the network's native token, so it differs per network
export let MINIMUM_ETH_LOCKED = BigDecimal.fromString('60')

export let Q192 = BigDecimal.fromString('6277101735386680763835789423207666416102355444464034512896') // 2^192

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export let factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS))
export let tokenConverterContract = TokenConverterContract.bind(Address.fromString(TOKEN_CONVERTER_ADDRESS))