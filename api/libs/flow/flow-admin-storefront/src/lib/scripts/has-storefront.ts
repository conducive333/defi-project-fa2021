export default (flowStorefrontAddress: string) =>
  `
import AdminNFTStorefrontV3 from ${flowStorefrontAddress}

pub fun main(address: Address): Bool {
  let account = getAccount(address)
  if let storefrontRef = account.getCapability<&AdminNFTStorefrontV3.Storefront{AdminNFTStorefrontV3.StorefrontPublic}>(AdminNFTStorefrontV3.StorefrontPublicPath).borrow() {
    return true
  }
  return false
}
`
