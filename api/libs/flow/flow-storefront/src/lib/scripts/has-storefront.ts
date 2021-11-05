export default (flowStorefrontAddress: string) =>
  `
import OpenSpaceNFTStorefront from ${flowStorefrontAddress}

pub fun main(address: Address): Bool {
  let account = getAccount(address)
  if let storefrontRef = account.getCapability<&OpenSpaceNFTStorefront.Storefront{OpenSpaceNFTStorefront.StorefrontPublic}>(OpenSpaceNFTStorefront.StorefrontPublicPath).borrow() {
    return true
  }
  return false
}
`
