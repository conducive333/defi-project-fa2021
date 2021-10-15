export default (
  nftContractName: string,
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
import ${nftContractName} from ${devAddress}
import AdminNFTStorefront from ${flowStorefrontAddress}

transaction(
    creatorAddress: Address, 
    saleItemPrice: UFix64, 
    creatorPercent: UFix64,
    metadata: {String:String}
) {

    let adminWallet: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
    let creatorWallet: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
    let nftReceiver: Capability<&${nftContractName}.Collection{NonFungibleToken.CollectionPublic}>
    let storefront: &AdminNFTStorefront.AdminStorefront

    prepare(acct: AuthAccount) {
        assert(creatorPercent >= 0.0 && creatorPercent <= 1.0, message: "Invalid creator percentage sale cut.")
        let creator = getAccount(creatorAddress)

        self.adminWallet = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        assert(self.adminWallet.borrow() != nil, message: "Missing or mis-typed FlowToken receiver for admin")

        self.creatorWallet = creator.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        assert(self.creatorWallet.borrow() != nil, message: "Missing or mis-typed FlowToken receiver for creator")

        // borrow a public reference to the receivers collection
        self.nftReceiver = creator.getCapability<&CryptoCreate.Collection{NonFungibleToken.CollectionPublic}>(CryptoCreate.CollectionPublicPath)!
        assert(self.nftReceiver.borrow() != nil, message: "Missing or mis-typed ${nftContractName}.Collection receiver")

        self.storefront = acct.borrow<&AdminNFTStorefront.AdminStorefront>(from: AdminNFTStorefront.AdminStorefrontStoragePath)
            ?? panic("Missing or mis-typed AdminNFTStorefront Storefront")
    }

    execute {
        let adminCut = AdminNFTStorefront.SaleCut(
            receiver: self.adminWallet,
            amount: saleItemPrice * (1.0 - creatorPercent)
        )
        let creatorCut = AdminNFTStorefront.SaleCut(
            receiver: self.creatorWallet,
            amount: saleItemPrice * creatorPercent
        )
        self.storefront.createListing(
            nftReceiverCapability: self.nftReceiver,
            metadata: metadata,
            salePaymentVaultType: Type<@FlowToken.Vault>(),
            saleCuts: [adminCut, creatorCut]
        )
    }
}
`
