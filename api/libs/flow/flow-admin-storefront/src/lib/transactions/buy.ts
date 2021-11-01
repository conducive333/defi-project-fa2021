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

pub fun findAvailableListing(
    storefront: &AdminNFTStorefrontV3.Storefront{AdminNFTStorefrontV3.StorefrontPublic},
    setID: String
): &AdminNFTStorefrontV3.Listing{AdminNFTStorefrontV3.ListingPublic} {
    let setListings = storefront.borrowListings(setID: setID)
    if setListings != nil {
        for packID in setListings!.keys {
            let listing = storefront.borrowListing(setID: setID, packID: packID)!
            let details = listing.getDetails()
            if (!listing.getDetails().purchased) {
                return listing
            }
        }
        panic("No packs available for purchase")
    }
    panic("Set ID does not exist")
  }

transaction(setID: String) {

    let paymentVault: @FungibleToken.Vault
    let nftCollection: Capability<&${nftContractName}.Collection{NonFungibleToken.CollectionPublic}>
    let storefront: &AdminNFTStorefrontV3.Storefront{AdminNFTStorefrontV3.StorefrontPublic}
    let listing: &AdminNFTStorefrontV3.Listing{AdminNFTStorefrontV3.ListingPublic}

    prepare(acct: AuthAccount) {
        
        self.storefront = getAccount(acct.address)
            .getCapability<&AdminNFTStorefrontV3.Storefront{AdminNFTStorefrontV3.StorefrontPublic}>(
                AdminNFTStorefrontV3.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")

        self.listing = findAvailableListing(storefront: self.storefront, setID: setID)
        let price = self.listing.getDetails().salePrice

        let mainFlowVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Cannot borrow FlowToken vault from acct storage")
        self.paymentVault <- mainFlowVault.withdraw(amount: price)

        self.nftCollection = acct.getCapability<&${nftContractName}.Collection{NonFungibleToken.CollectionPublic}>(${nftContractName}.CollectionPublicPath)
        assert(self.nftCollection.borrow() != nil, message: "Missing or mis-typed NFT Collection")

    }

    execute {
        let details = self.listing.getDetails()
        self.listing.purchase(
            payment: <-self.paymentVault,
            nftCollectionCapability: self.nftCollection
        )
        self.storefront.cleanup(setID: setID, packID: details.packID)
    }
    
}
`
