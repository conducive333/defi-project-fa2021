export default (devAddress: string) =>
  `
import DBNonFungibleToken from ${devAddress}
import DBNFTStorefront from ${devAddress}

pub fun main(address: Address): Bool {
  let account = getAccount(address)
  if let storefrontRef = account.getCapability<&DBNFTStorefront.Storefront{DBNFTStorefront.StorefrontPublic}>(DBNFTStorefront.StorefrontPublicPath).borrow() {
    return true
  }
  return false
}
`
