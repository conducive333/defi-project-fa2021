export default (devAddress: string) =>
  `
import DBNonFungibleToken from ${devAddress}
import DBNFTStorefront from ${devAddress}

pub struct SaleOfferDetails {
  pub var storefrontID: UInt64
  pub var saleOfferResourceID: UInt64
  pub var accepted: Bool
  pub let nftType: Type
  pub let nftID: UInt64
  pub let salePaymentVaultType: Type
  pub let salePrice: UFix64
  init(storefrontID: UInt64, saleOfferResourceID: UInt64, accepted: Bool, nftType: Type, nftID: UInt64, salePaymentVaultType: Type, salePrice: UFix64) {
    self.storefrontID = storefrontID
    self.saleOfferResourceID = saleOfferResourceID
    self.accepted = accepted
    self.nftType = nftType
    self.nftID = nftID
    self.salePaymentVaultType = salePaymentVaultType
    self.salePrice = salePrice
  }
}

pub fun main(address: Address, limit: Int, offset: Int): [SaleOfferDetails] {
  
  let account = getAccount(address)
  let storefrontRef = account.getCapability<&DBNFTStorefront.Storefront{DBNFTStorefront.StorefrontPublic}>(DBNFTStorefront.StorefrontPublicPath).borrow()
    ?? panic("Could not borrow public storefront from address")

  var index = 0
  let saleOffers: [SaleOfferDetails] = []
  let saleOfferResourceIDs = storefrontRef.getSaleOfferIDs()
  while (index + offset) < saleOfferResourceIDs.length && index < limit {
    let saleOfferResourceID = saleOfferResourceIDs[index + offset]
    let saleOffer = storefrontRef.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID) ?? panic("No item with that ID")
    let details = saleOffer.getDetails()
    saleOffers.append(
      SaleOfferDetails(
        storefrontID: details.storefrontID,
        saleOfferResourceID: saleOfferResourceID,
        accepted: details.accepted,
        nftType: details.nftType,
        nftID: details.nftID,
        salePaymentVaultType: details.salePaymentVaultType,
        salePrice: details.salePrice
      )
    )
    index = index + 1
  }
  return saleOffers

}
`
