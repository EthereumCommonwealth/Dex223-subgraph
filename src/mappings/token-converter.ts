import { Address, log } from '@graphprotocol/graph-ts'
import { ERC20WrapperCreated, ERC223WrapperCreated } from '../types/TokenConverter/TokenConverter'
import { TokenConvertible, Token } from '../types/schema'
import { fetchTokenSymbol, fetchTokenName, fetchTokenDecimals } from '../utils/token'

function saveConverter(addressERC20: Address, addressERC223: Address): void {
  let decimals = fetchTokenDecimals(addressERC20, addressERC223)
  if (decimals === null) {
    return
  }
  let id = `${addressERC20.toHexString()}-${addressERC223.toHexString()}`
  let token = TokenConvertible.load(id)
  if (token === null) {
    token = new TokenConvertible(id)
    token.decimals = decimals
    token.symbol = fetchTokenSymbol(addressERC20, addressERC223)
    token.name = fetchTokenName(addressERC20, addressERC223)
    token.addressERC20 = addressERC20.toHexString()
    token.addressERC223 = addressERC223.toHexString()
    token.save()
  }

  let t = Token.load(addressERC20.toHexString())
  if (t) {
    t.inConverter = true
    t.save()
  }
}

export function handleERC20WrapperCreated(event: ERC20WrapperCreated): void {
  let addressERC20 = event.params._ERC20Wrapper
  let addressERC223 = event.params._token
  saveConverter(addressERC20, addressERC223)
}

export function handleERC223WrapperCreated(event: ERC223WrapperCreated): void {
  let addressERC20 = event.params._token
  let addressERC223 = event.params._ERC223Wrapper
  saveConverter(addressERC20, addressERC223)
}
