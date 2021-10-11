export default (flowStorefrontAddress: string) =>
  `
import NFTStorefront from ${flowStorefrontAddress}


pub fun main(address: Address): Bool {
  let account = getAccount(address)
  if let storefrontRef = account.getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath).borrow() {
    return true
  }
  return false
}
`
