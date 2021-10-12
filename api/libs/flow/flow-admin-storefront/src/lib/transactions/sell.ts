export default (
  devAddress: string,
  nftAddress: string,
  fungibleTokenAddress: string,
  flowTokenAddress: string,
  flowStorefrontAddress: string
) =>
  `
import FungibleToken from ${fungibleTokenAddress}
import NonFungibleToken from ${nftAddress}
import FlowToken from ${flowTokenAddress}
import CryptoCreateItems from ${devAddress}
import CryptoCreateNFTStorefront from ${flowStorefrontAddress}

transaction(saleItemID: UInt64, saleItemPrice: UFix64) {

    let flowReceiver: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
    let nftProvider: Capability<&CryptoCreateItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let storefront: &CryptoCreateNFTStorefront.Storefront

    prepare(acct: AuthAccount) {
        // We need a provider capability, but one is not provided by default so we create one if needed.
        let nftCollectionProviderPrivatePath = /private/nftCollectionProviderForCryptoCreateNFTStorefront

        self.flowReceiver = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        assert(self.flowReceiver.borrow() != nil, message: "Missing or mis-typed FlowToken receiver")

        if !acct.getCapability<&CryptoCreateItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath)!.check() {
            acct.link<&CryptoCreateItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath, target: CryptoCreateItems.CollectionStoragePath)
        }

        self.nftProvider = acct.getCapability<&CryptoCreateItems.Collection{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(nftCollectionProviderPrivatePath)!
        assert(self.nftProvider.borrow() != nil, message: "Missing or mis-typed CryptoCreateItems.Collection provider")

        self.storefront = acct.borrow<&CryptoCreateNFTStorefront.Storefront>(from: CryptoCreateNFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed CryptoCreateNFTStorefront Storefront")
    }

    execute {
        let saleCut = CryptoCreateNFTStorefront.SaleCut(
            receiver: self.flowReceiver,
            amount: saleItemPrice
        )
        self.storefront.createListing(
            nftProviderCapability: self.nftProvider,
            nftType: Type<@CryptoCreateItems.NFT>(),
            nftID: saleItemID,
            salePaymentVaultType: Type<@FlowToken.Vault>(),
            saleCuts: [saleCut]
        )
    }
}
`