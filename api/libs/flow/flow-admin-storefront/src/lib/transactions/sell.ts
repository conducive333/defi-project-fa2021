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
import AdminNFTStorefrontV3 from ${flowStorefrontAddress}

transaction(
    setID: String,
    packID: String,
    saleItemPrice: UFix64, 
    metadatas: [{String:String}],
    beneficiaryAddress: Address, 
    beneficiaryPercent: UFix64
) {

    let adminWallet: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
    let beneficiaryWallet: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
    let storefront: &AdminNFTStorefrontV3.AdminStorefront

    prepare(acct: AuthAccount) {
        assert(beneficiaryPercent >= 0.0 && beneficiaryPercent <= 1.0, message: "Invalid beneficiary percentage sale cut.")
        let beneficiary = getAccount(beneficiaryAddress)

        self.adminWallet = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        assert(self.adminWallet.borrow() != nil, message: "Missing or mis-typed FlowToken receiver for admin")

        self.beneficiaryWallet = beneficiary.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
        assert(self.beneficiaryWallet.borrow() != nil, message: "Missing or mis-typed FlowToken receiver for beneficiary")

        self.storefront = acct.borrow<&AdminNFTStorefrontV3.AdminStorefront>(from: AdminNFTStorefrontV3.AdminStorefrontStoragePath)
            ?? panic("Missing or mis-typed AdminNFTStorefrontV3 Storefront")
    }

    execute {
        let adminCut = AdminNFTStorefrontV3.SaleCut(
            receiver: self.adminWallet,
            amount: saleItemPrice * (1.0 - beneficiaryPercent)
        )
        let beneficiaryCut = AdminNFTStorefrontV3.SaleCut(
            receiver: self.beneficiaryWallet,
            amount: saleItemPrice * beneficiaryPercent
        )
        self.storefront.createListing(
            setID: setID,
            packID: packID,
            metadatas: metadatas,
            salePaymentVaultType: Type<@FlowToken.Vault>(),
            saleCuts: [adminCut, beneficiaryCut]
        )
    }
}
`
