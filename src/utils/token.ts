import { Address, BigInt } from '@graphprotocol/graph-ts'

import { ERC20andERC223 } from '../types/Factory/ERC20andERC223'
import { ERC20andERC223NameBytes } from '../types/Factory/ERC20andERC223NameBytes'
import { ERC20andERC223SymbolBytes } from '../types/Factory/ERC20andERC223SymbolBytes'
import { isNullEthValue } from '.'
import { getStaticDefinition, STATIC_TOKEN_DEFINITIONS, StaticTokenDefinition } from './staticTokenDefinition'
import { tokenConverterContract } from './constants'

function _fetchTokenSymbol(
  tokenAddress: Address,
  staticTokenDefinitions: StaticTokenDefinition[] = STATIC_TOKEN_DEFINITIONS
): string {
  const contract = ERC20andERC223.bind(tokenAddress)
  const contractSymbolBytes = ERC20andERC223SymbolBytes.bind(tokenAddress)

  // try types string and bytes32 for symbol
  let symbolValue = 'unknown'
  const symbolResult = contract.try_symbol()
  if (symbolResult.reverted) {
    const symbolResultBytes = contractSymbolBytes.try_symbol()
    if (!symbolResultBytes.reverted) {
      // for broken pairs that have no symbol function exposed
      if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
        symbolValue = symbolResultBytes.value.toString()
      } else {
        // try with the static definition
        const staticTokenDefinition = getStaticDefinition(tokenAddress, staticTokenDefinitions)
        if (staticTokenDefinition != null) {
          symbolValue = staticTokenDefinition.symbol
        }
      }
    }
  } else {
    symbolValue = symbolResult.value
  }

  return symbolValue
}

export function _fetchTokenName(
  tokenAddress: Address,
  staticTokenDefinitions: StaticTokenDefinition[] = STATIC_TOKEN_DEFINITIONS
): string {
  const contract = ERC20andERC223.bind(tokenAddress)
  const contractNameBytes = ERC20andERC223NameBytes.bind(tokenAddress)

  // try types string and bytes32 for name
  let nameValue = 'unknown'
  const nameResult = contract.try_name()
  if (nameResult.reverted) {
    const nameResultBytes = contractNameBytes.try_name()
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString()
      } else {
        // try with the static definition
        const staticTokenDefinition = getStaticDefinition(tokenAddress, staticTokenDefinitions)
        if (staticTokenDefinition != null) {
          nameValue = staticTokenDefinition.name
        }
      }
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
}

function _fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  const contract = ERC20andERC223.bind(tokenAddress)
  let totalSupplyValue = BigInt.zero()
  const totalSupplyResult = contract.try_totalSupply()
  if (!totalSupplyResult.reverted) {
    totalSupplyValue = totalSupplyResult.value
  }
  return totalSupplyValue
}

function _fetchTokenDecimals(
  tokenAddress: Address,
  staticTokenDefinitions: StaticTokenDefinition[] = STATIC_TOKEN_DEFINITIONS
): BigInt | null {
  const contract = ERC20andERC223.bind(tokenAddress)
  // try types uint8 for decimals
  const decimalResult = contract.try_decimals()

  if (!decimalResult.reverted) {
    // Приведение u8 к i32 перед передачей в BigInt.fromI32
    // console.log()
    // const decimals = BigInt.fromI32(decimalResult.value)
    if (decimalResult.value.lt(BigInt.fromI32(255))) {
      return decimalResult.value
    }
  } else {
    // try with the static definition
    const staticTokenDefinition = getStaticDefinition(tokenAddress, staticTokenDefinitions)
    if (staticTokenDefinition) {
      return staticTokenDefinition.decimals
    }
  }

  return null
}

// Global functions

export function fetchTokenSymbol(
  tokenAddressERC20: Address,
  tokenAddressERC223: Address,
  staticTokenDefinitions: StaticTokenDefinition[] = STATIC_TOKEN_DEFINITIONS
): string {
  const symbol = _fetchTokenSymbol(tokenAddressERC20, staticTokenDefinitions)
  if (symbol == 'unknown') {
    return _fetchTokenSymbol(tokenAddressERC223, staticTokenDefinitions)
  }
  return symbol
}

export function fetchTokenName(
  tokenAddressERC20: Address,
  tokenAddressERC223: Address,
  staticTokenDefinitions: StaticTokenDefinition[] = STATIC_TOKEN_DEFINITIONS
): string {
  const name = _fetchTokenName(tokenAddressERC20, staticTokenDefinitions)
  if (name == 'unknown') {
    return _fetchTokenName(tokenAddressERC223, staticTokenDefinitions)
  }
  return name
}

export function fetchTokenTotalSupply(tokenAddressERC20: Address, tokenAddressERC223: Address): BigInt {
  let totalSupplyValue = _fetchTokenTotalSupply(tokenAddressERC20)
  if (totalSupplyValue.equals(BigInt.zero())) {
    return _fetchTokenTotalSupply(tokenAddressERC223)
  }
  return totalSupplyValue
}

export function fetchTokenDecimals(
  tokenAddressERC20: Address,
  tokenAddressERC223: Address,
  staticTokenDefinitions: StaticTokenDefinition[] = STATIC_TOKEN_DEFINITIONS
): BigInt | null {
  const value = _fetchTokenDecimals(tokenAddressERC20, staticTokenDefinitions)
  if (value === null) {
    return _fetchTokenDecimals(tokenAddressERC223, staticTokenDefinitions)
  }
  return value
}

export function fetchTokenInConverter(addressERC20: Address): boolean {
  let result = tokenConverterContract.try_getERC223WrapperFor(addressERC20)
  if (!result.reverted) {
    return result.value.getValue0().toHexString() != '0x0000000000000000000000000000000000000000'
  }
  return false
}
