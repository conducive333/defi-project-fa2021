export default (
  devAddress: string,
  fungibleTokenAddress: string,
  flowTokenAddress: string
) =>
  `
import FungibleToken from ${fungibleTokenAddress}
import DBNonFungibleToken from ${devAddress}
import FlowToken from ${flowTokenAddress}
import DBCollectable from ${devAddress}
import DBNFTStorefront from ${devAddress}


transaction(saleOfferResourceID: UInt64, storefrontAddress: Address, withdrawMeta: {String: String}, depositMeta: {String: String}, saleOfferCompletedMeta: {String: String}) {

    let paymentVault: @FungibleToken.Vault
    let DBCollectableCollection: &DBCollectable.Collection{DBNonFungibleToken.Receiver}
    let storefront: &DBNFTStorefront.Storefront{DBNFTStorefront.StorefrontPublic}
    let saleOffer: &DBNFTStorefront.SaleOffer{DBNFTStorefront.SaleOfferPublic}

    prepare(account: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&DBNFTStorefront.Storefront{DBNFTStorefront.StorefrontPublic}>(
                DBNFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Cannot borrow Storefront from provided address")

        self.saleOffer = self.storefront.borrowSaleOffer(saleOfferResourceID: saleOfferResourceID)
            ?? panic("No offer with that ID in Storefront")
        
        let price = self.saleOffer.getDetails().salePrice

        let mainFlowTokenVault = account.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault from account storage")
        
        self.paymentVault <- mainFlowTokenVault.withdraw(amount: price)

        self.DBCollectableCollection = account.borrow<&DBCollectable.Collection{DBNonFungibleToken.Receiver}>(
            from: DBCollectable.CollectionStoragePath
        ) ?? panic("Cannot borrow DBCollectable collection receiver from account")
    }

    execute {
        let item <- self.saleOffer.accept(
            payment: <-self.paymentVault,
            trxMeta: withdrawMeta,
            sftrxMeta: saleOfferCompletedMeta
        )

        self.DBCollectableCollection.deposit(token: <-item, trxMeta: depositMeta)

        self.storefront.cleanup(saleOfferResourceID: saleOfferResourceID)
    }
}
`
