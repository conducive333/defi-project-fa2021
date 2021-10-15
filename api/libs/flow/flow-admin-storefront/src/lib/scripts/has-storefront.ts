export default (flowStorefrontAddress: string) =>
  `
import AdminNFTStorefront from ${flowStorefrontAddress}


pub fun main(address: Address): Bool {
  let account = getAccount(address)
  if let storefrontRef = account.getCapability<&AdminNFTStorefront.Storefront{AdminNFTStorefront.StorefrontPublic}>(AdminNFTStorefront.StorefrontPublicPath).borrow() {
    return true
  }
  return false
}
`
