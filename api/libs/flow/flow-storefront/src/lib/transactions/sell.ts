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

transaction(saleItemID: UInt64, saleItemPrice: UFix64, saleOfferAvailableMeta: {String: String}) {

    let flowTokenReceiver: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
    let dbCollectableProvider: Capability<&DBCollectable.Collection{DBNonFungibleToken.Provider, DBNonFungibleToken.CollectionPublic}>
    let storefront: &DBNFTStorefront.Storefront

    prepare(account: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one if needed.
        let DBCollectableCollectionProviderPrivatePath = /private/DBCollectableCollectionProvider

        self.flowTokenReceiver = account.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        
        assert(self.flowTokenReceiver.borrow() != nil, message: "Missing or mis-typed FlowToken receiver")

        if !account.getCapability<&DBCollectable.Collection{DBNonFungibleToken.Provider, DBNonFungibleToken.CollectionPublic}>(DBCollectableCollectionProviderPrivatePath)!.check() {
            account.link<&DBCollectable.Collection{DBNonFungibleToken.Provider, DBNonFungibleToken.CollectionPublic}>(DBCollectableCollectionProviderPrivatePath, target: DBCollectable.CollectionStoragePath)
        }

        self.dbCollectableProvider = account.getCapability<&DBCollectable.Collection{DBNonFungibleToken.Provider, DBNonFungibleToken.CollectionPublic}>(DBCollectableCollectionProviderPrivatePath)!
        assert(self.dbCollectableProvider.borrow() != nil, message: "Missing or mis-typed DBCollectable.Collection provider")

        // If this panics, make sure you have a storefront setup on the account
        self.storefront = account.borrow<&DBNFTStorefront.Storefront>(from: DBNFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed DBNFTStorefront Storefront")
    }

    execute {
        let saleCut = DBNFTStorefront.SaleCut(
            receiver: self.flowTokenReceiver,
            amount: saleItemPrice
        )
        self.storefront.createSaleOffer(
            nftProviderCapability: self.dbCollectableProvider,
            nftType: Type<@DBCollectable.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@FlowToken.Vault>(),
            saleCuts: [saleCut],
            sftrxMeta: saleOfferAvailableMeta
        )
    }
}
`
