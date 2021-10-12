import NonFungibleToken from 0x02
import FungibleToken from 0x03
import CryptoCreateItems from 0x04

// CryptoCreateNFTStorefront
//
// A general purpose sale support contract for Flow NonFungibleTokens.
// 
// Each account that wants to list NFTs for sale installs a Storefront,
// and lists individual sales within that Storefront as Listings.
// There is one Storefront per account, it handles sales of all NFT types
// for that account.
//
// Each Listing can have one or more "cut"s of the sale price that
// goes to one or more addresses. Cuts can be used to pay listing fees
// or other considerations.
// Each NFT may be listed in one or more Listings, the validity of each
// Listing can easily be checked.
// 
// Purchasers can watch for Listing events and check the NFT type and
// ID to see if they wish to buy the listed item.
// Marketplaces and other aggregators can watch for Listing events
// and list items of interest.
//
pub contract CryptoCreateNFTStorefront {
    // NFTStorefrontInitialized
    // This contract has been deployed.
    // Event consumers can now expect events from this contract.
    //
    pub event NFTStorefrontInitialized()

    // StorefrontInitialized
    // A Storefront resource has been created.
    // Event consumers can now expect events from this Storefront.
    // Note that we do not specify an address: we cannot and should not.
    // Created resources do not have an owner address, and may be moved
    // after creation in ways we cannot check.
    // ListingAvailable events can be used to determine the address
    // of the owner of the Storefront (...its location) at the time of
    // the listing but only at that precise moment in that precise transaction.
    // If the seller moves the Storefront while the listing is valid, 
    // that is on them.
    //
    pub event StorefrontInitialized(storefrontResourceID: UInt64)

    // StorefrontDestroyed
    // A Storefront has been destroyed.
    // Event consumers can now stop processing events from this Storefront.
    // Note that we do not specify an address.
    //
    pub event StorefrontDestroyed(storefrontResourceID: UInt64)

    // ListingAvailable
    // A listing has been created and added to a Storefront resource.
    // The Address values here are valid when the event is emitted, but
    // the state of the accounts they refer to may be changed outside of the
    // NFTStorefront workflow, so be careful to check when using them.
    //
    pub event ListingAvailable(
        storefrontAddress: Address,
        listingResourceID: UInt64,
        metadata: {String:String},
        ftVaultType: Type,
        price: UFix64
    )

    // ListingCompleted
    // The listing has been resolved. It has either been purchased, or removed and destroyed.
    //
    pub event ListingCompleted(listingResourceID: UInt64, storefrontResourceID: UInt64, purchased: Bool)

    // StorefrontStoragePath
    // The location in storage that a Storefront resource should be located.
    pub let StorefrontStoragePath: StoragePath

    // StorefrontPublicPath
    // The public location for a Storefront link.
    pub let StorefrontPublicPath: PublicPath

    // AdminStorefrontStoragePath
    // The location in storage that an AdminStorefront resource should be located.
    pub let AdminStorefrontStoragePath: StoragePath

    // The dictionary of Listing uuids to Listing resources.
    access(self) var listings: @{UInt64: Listing}

    // SaleCut
    // A struct representing a recipient that must be sent a certain amount
    // of the payment when a token is sold.
    //
    pub struct SaleCut {
        // The receiver for the payment.
        // Note that we do not store an address to find the Vault that this represents,
        // as the link or resource that we fetch in this way may be manipulated,
        // so to find the address that a cut goes to you must get this struct and then
        // call receiver.borrow()!.owner.address on it.
        // This can be done efficiently in a script.
        pub let receiver: Capability<&{FungibleToken.Receiver}>

        // The amount of the payment FungibleToken that will be paid to the receiver.
        pub let amount: UFix64

        // initializer
        //
        init(receiver: Capability<&{FungibleToken.Receiver}>, amount: UFix64) {
            self.receiver = receiver
            self.amount = amount
        }
    }


    // ListingDetails
    // A struct containing a Listing's data.
    //
    pub struct ListingDetails {
        // The Storefront that the Listing is stored in.
        // Note that this resource cannot be moved to a different Storefront,
        // so this is OK. If we ever make it so that it *can* be moved,
        // this should be revisited.
        pub var storefrontID: UInt64
        // Whether this listing has been purchased or not.
        pub var purchased: Bool
        // The metadata of the NFT that will be minted.
        pub let metadata: {String:String}
        // The Type of the FungibleToken that payments must be made in.
        pub let salePaymentVaultType: Type
        // The amount that must be paid in the specified FungibleToken.
        pub let salePrice: UFix64
        // This specifies the division of payment between recipients.
        pub let saleCuts: [SaleCut]

        // setToPurchased
        // Irreversibly set this listing as purchased.
        //
        access(contract) fun setToPurchased() {
            self.purchased = true
        }

        // initializer
        //
        init (
            metadata: {String:String},
            salePaymentVaultType: Type,
            saleCuts: [SaleCut],
            storefrontID: UInt64
        ) {
            self.storefrontID = storefrontID
            self.purchased = false
            self.metadata = metadata
            self.salePaymentVaultType = salePaymentVaultType

            // Store the cuts
            assert(saleCuts.length > 0, message: "Listing must have at least one payment cut recipient")
            self.saleCuts = saleCuts

            // Calculate the total price from the cuts
            var salePrice = 0.0
            // Perform initial check on capabilities, and calculate sale price from cut amounts.
            for cut in self.saleCuts {
                // Make sure we can borrow the receiver.
                // We will check this again when the token is sold.
                cut.receiver.borrow()
                    ?? panic("Cannot borrow receiver")
                // Add the cut amount to the total price
                salePrice = salePrice + cut.amount
            }
            assert(salePrice >= 0.0, message: "Listing must have nonnegative price")

            // Store the calculated sale price
            self.salePrice = salePrice
        }
    }


    // ListingPublic
    // An interface providing a useful public interface to a Listing.
    //
    pub resource interface ListingPublic {
        // purchase
        // Purchase the listing, buying the token.
        // This pays the beneficiaries and returns the token to the buyer.
        //
        pub fun purchase(payment: @FungibleToken.Vault)

        // getDetails
        //
        pub fun getDetails(): ListingDetails
    }


    // Listing
    // A resource that allows an NFT to be sold for an amount of a given FungibleToken,
    // and for the proceeds of that sale to be split between several recipients.
    // 
    pub resource Listing: ListingPublic {
        // The simple (non-Capability, non-complex) details of the sale
        access(self) let details: ListingDetails

        // A capability allowing this resource to deposit an NFT to a collection.
        // This capability allows the resource to deposit *any* NFT, so you should be careful when giving
        // such a capability to a resource and always check its code to make sure it will use it in the
        // way that it claims.
        access(contract) let nftReceiverCapability: Capability<&{NonFungibleToken.CollectionPublic}>

        // getDetails
        // Get the details of the current state of the Listing as a struct.
        // This avoids having more public variables and getter methods for them, and plays
        // nicely with scripts (which cannot return resources).
        //
        pub fun getDetails(): ListingDetails {
            return self.details
        }

        // purchase
        // Purchase the listing, buying the token.
        // This pays the beneficiaries and returns the token to the buyer.
        //
        pub fun purchase(payment: @FungibleToken.Vault) {
            pre {
                self.details.purchased == false: "listing has already been purchased"
                payment.isInstance(self.details.salePaymentVaultType): "payment vault is not requested fungible token"
                payment.balance == self.details.salePrice: "payment vault does not contain requested price"
            }

            // Make sure the listing cannot be purchased again.
            self.details.setToPurchased()

            // Get the DooverseItems minter from admin storage
            let minter = CryptoCreateNFTStorefront.account.borrow<&CryptoCreateItems.NFTMinter>(from: CryptoCreateItems.MinterStoragePath) 
              ?? panic("Could not borrow a reference to the NFT minter")

            // Mint the NFT to the specified account
            minter.mintNFT(recipient: self.nftReceiverCapability.borrow()!, initMetadata: self.details.metadata)

            // Rather than aborting the transaction if any receiver is absent when we try to pay it,
            // we send the cut to the first valid receiver.
            // The first receiver should therefore either be the seller, or an agreed recipient for
            // any unpaid cuts.
            var residualReceiver: &{FungibleToken.Receiver}? = nil

            // Pay each beneficiary their amount of the payment.
            for cut in self.details.saleCuts {
                if let receiver = cut.receiver.borrow() {
                   let paymentCut <- payment.withdraw(amount: cut.amount)
                    receiver.deposit(from: <-paymentCut)
                    if (residualReceiver == nil) {
                        residualReceiver = receiver
                    }
                }
            }

            assert(residualReceiver != nil, message: "No valid payment receivers")

            // At this point, if all recievers were active and availabile, then the payment Vault will have
            // zero tokens left, and this will functionally be a no-op that consumes the empty vault
            residualReceiver!.deposit(from: <-payment)

            // If the listing is purchased, we regard it as completed here.
            // Otherwise we regard it as completed in the destructor.
            emit ListingCompleted(
                listingResourceID: self.uuid,
                storefrontResourceID: self.details.storefrontID,
                purchased: self.details.purchased
            )
        }

        // destructor
        //
        destroy () {
            // If the listing has not been purchased, we regard it as completed here.
            // Otherwise we regard it as completed in purchase().
            // This is because we destroy the listing in Storefront.removeListing()
            // or Storefront.cleanup() .
            // If we change this destructor, revisit those functions.
            if !self.details.purchased {
                emit ListingCompleted(
                    listingResourceID: self.uuid,
                    storefrontResourceID: self.details.storefrontID,
                    purchased: self.details.purchased
                )
            }
        }

        // initializer
        //
        init (
            nftReceiverCapability: Capability<&{NonFungibleToken.CollectionPublic}>,
            metadata: {String:String},
            salePaymentVaultType: Type,
            saleCuts: [SaleCut],
            storefrontID: UInt64
        ) {
            // Store the sale information
            self.details = ListingDetails(
                metadata: metadata,
                salePaymentVaultType: salePaymentVaultType,
                saleCuts: saleCuts,
                storefrontID: storefrontID
            )

            // Store the NFT receiver
            self.nftReceiverCapability = nftReceiverCapability

            // Check that the provider contains the NFT.
            // We will check it again when the token is sold.
            // We cannot move this into a function because initializers cannot call member functions.
            let receiver = self.nftReceiverCapability.borrow()
            assert(receiver != nil, message: "cannot borrow nftProviderCapability")
        }
    }

    // StorefrontManager
    // An interface for adding and removing Listings within a Storefront,
    // intended for use by the Storefront's own
    //
    pub resource interface StorefrontManager {
        // createListing
        // Allows the Storefront owner to create and insert Listings.
        //
        pub fun createListing(
            nftReceiverCapability: Capability<&{NonFungibleToken.CollectionPublic}>,
            metadata: {String:String},
            salePaymentVaultType: Type,
            saleCuts: [SaleCut]
        ): UInt64
        // removeListing
        // Allows the Storefront owner to remove any sale listing, acepted or not.
        //
        pub fun removeListing(listingResourceID: UInt64)
    }

    // StorefrontPublic
    // An interface to allow listing and borrowing Listings, and purchasing items via Listings
    // in a Storefront.
    //
    pub resource interface StorefrontPublic {
        pub fun getListingIDs(): [UInt64]
        pub fun borrowListing(listingResourceID: UInt64): &Listing{ListingPublic}?
        pub fun cleanup(listingResourceID: UInt64)
   }

    // Storefront
    // A resource that allows its owner to manage a list of Listings, and anyone to interact with them
    // in order to query their details and purchase the NFTs that they represent.
    //
    pub resource Storefront : StorefrontPublic {

        // getListingIDs
        // Returns an array of the Listing resource IDs that are in the collection
        //
        pub fun getListingIDs(): [UInt64] {
            return CryptoCreateNFTStorefront.listings.keys
        }

        // borrowSaleItem
        // Returns a read-only view of the SaleItem for the given listingID if it is contained by this collection.
        //
        pub fun borrowListing(listingResourceID: UInt64): &Listing{ListingPublic}? {
            if CryptoCreateNFTStorefront.listings[listingResourceID] != nil {
                return &CryptoCreateNFTStorefront.listings[listingResourceID] as! &Listing{ListingPublic}
            } else {
                return nil
            }
        }

        // cleanup
        // Remove an listing *if* it has been purchased.
        // Anyone can call, but at present it only benefits the account owner to do so.
        // Kind purchasers can however call it if they like.
        //
        pub fun cleanup(listingResourceID: UInt64) {
            pre {
                CryptoCreateNFTStorefront.listings[listingResourceID] != nil: "could not find listing with given id"
            }

            let listing <- CryptoCreateNFTStorefront.listings.remove(key: listingResourceID)!
            assert(listing.getDetails().purchased == true, message: "listing is not purchased, only admin can remove")
            destroy listing
        }

    }

    // AdminStorefront
    // A resource that allows its owner to manage a list of Listings, and anyone to interact with them
    // in order to query their details and purchase the NFTs that they represent.
    //
    pub resource AdminStorefront : StorefrontManager {

        // insert
        // Create and publish a Listing for an NFT.
        //
         pub fun createListing(
            nftReceiverCapability: Capability<&{NonFungibleToken.CollectionPublic}>,
            metadata: {String:String},
            salePaymentVaultType: Type,
            saleCuts: [SaleCut]
         ): UInt64 {
            let listing <- create Listing(
                nftReceiverCapability: nftReceiverCapability,
                metadata: metadata,
                salePaymentVaultType: salePaymentVaultType,
                saleCuts: saleCuts,
                storefrontID: self.uuid
            )

            let listingResourceID = listing.uuid
            let listingPrice = listing.getDetails().salePrice

            // Add the new listing to the dictionary.
            let oldListing <- CryptoCreateNFTStorefront.listings[listingResourceID] <- listing
            // Note that oldListing will always be nil, but we have to handle it.
            destroy oldListing

            emit ListingAvailable(
                storefrontAddress: self.owner?.address!,
                listingResourceID: listingResourceID,
                metadata: metadata,
                ftVaultType: salePaymentVaultType,
                price: listingPrice
            )

            return listingResourceID
        }

        // removeListing
        // Remove a Listing that has not yet been purchased from the collection and destroy it.
        //
        pub fun removeListing(listingResourceID: UInt64) {
            let listing <- CryptoCreateNFTStorefront.listings.remove(key: listingResourceID)
                ?? panic("missing Listing")
    
            // This will emit a ListingCompleted event.
            destroy listing
        }

    }

    // createStorefront
    // Make creating a Storefront publicly accessible.
    //
    pub fun createStorefront(): @Storefront {
        return <-create Storefront()
    }

    init () {
        self.StorefrontStoragePath = /storage/CryptoCreateNFTStorefront
        self.StorefrontPublicPath = /public/CryptoCreateNFTStorefront
        self.AdminStorefrontStoragePath = /storage/AdminCryptoCreateNFTStorefront
        self.listings <- {}
        self.account.save(<-create AdminStorefront(), to: self.AdminStorefrontStoragePath)
        emit NFTStorefrontInitialized()
    }
}