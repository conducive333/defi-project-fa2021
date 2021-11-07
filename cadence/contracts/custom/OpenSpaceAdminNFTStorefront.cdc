import NonFungibleToken from ${nftAddress}
import FungibleToken from ${ftAddress}
import OpenSpaceItems from ${devAddress}

// OpenSpaceAdminNFTStorefront
//
// What's the difference between this contract and the general-purpose NFTStorefront contract?
//
//  1. The admin is the only one that can (1) create listings and (2) remove *active* listings.
//
//  2. The admin can remove a listing and set its "purchased" status to either true or false (
//     helps with fiat purchases).
//
//  3. Listings can now have a price of 0.
//
//  4. The admin can sell NFTs in groups of packs, and each pack can be further grouped under a set.
//
//  5. NFTs are minted directly to the user once a listing is purchased. When an admin creates a listing,
//     he/she will provide a list of NFT metadata dictionaries. The data in these dictionaries will 
//     become the NFT metadata when the listing is accepted. In the general-purpose NFTStorefront, 
//     NFTs need to be minted before they can be listed. This can be a bit constraining. To see why, 
//     suppose we wanted to sell 1,000,000+ NFTs. Not only would we need a large amount of FLOW
//     tokens to store them all in our account, but it isn't guaranteed that all 1,000,000+ will 
//     be bought. As a result, we'd be stuck with all the inventory in the event that no one buys
//     anything. Plus, if we wanted to list more NFTs for sale to make up for our tragic loss, we
//     would need to get even more FLOW tokens and use up even more space!
//
//  6. Users who install a storefront can only view and purchase the admin's listings. Once the
//     user purchases a listing from the Admin, they can re-sell their newly bought NFTs using 
//     the general-purpose Flow NFTStorefront contract.
//
// Besides that, this contract is mostly the same. Each account that wants to buy packs of NFTs
// from the admin account installs a Storefront. There is one Storefront per account, it handles 
// purchases of all NFT types for that account.
//
// Each Listing can have one or more "cut"s of the sale price that goes to one or more addresses. 
// Cuts can be used to pay listing fees or other considerations. Each NFT may be listed in one or 
// more Listings, the validity of each Listing can easily be checked.
// 
// Purchasers can watch for Listing events and check the NFT type and ID to see if they wish to buy
// the listed item. Marketplaces and other aggregators can watch for Listing events and list items 
// of interest.
//
pub contract OpenSpaceAdminNFTStorefront {
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
    setID: String,
    packID: String,
    metadatas: [{String: String}],
    ftVaultType: Type,
    price: UFix64
  )

  // ListingCompleted
  // The listing has been resolved. It has either been purchased, or removed and destroyed.
  //
  pub event ListingCompleted(packID: String, storefrontResourceID: UInt64, purchased: Bool)

  // StorefrontStoragePath
  // The location in storage that a Storefront resource should be located.
  pub let StorefrontStoragePath: StoragePath

  // StorefrontPublicPath
  // The public location for a Storefront link.
  pub let StorefrontPublicPath: PublicPath

  // AdminStorefrontStoragePath
  // The location in storage that an AdminStorefront resource should be located.
  pub let AdminStorefrontStoragePath: StoragePath

  // A dictionary of set IDs to a dictionary of pack IDs to Listing resources.
  access(self) var listings: @{String : {String: Listing}}

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

    // The pack ID.
    pub let packID: String

    // The metadata of the NFTs that will be minted.
    pub let metadatas: [{String: String}]

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
    init(
      packID: String,
      metadatas: [{String: String}],
      salePaymentVaultType: Type,
      saleCuts: [SaleCut],
      storefrontID: UInt64
    ) {
      self.packID = packID
      self.storefrontID = storefrontID
      self.purchased = false
      self.metadatas = metadatas
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
        cut.receiver.borrow() ?? panic("Cannot borrow receiver")
        // Add the cut amount to the total price
        salePrice = salePrice + cut.amount
      }
      assert(salePrice >= 0.0, message: "Listing must have nonnegative price")

      // Store the calculated sale price
      self.salePrice = salePrice
    }
  }

  // ListingPublic
  // An interface providing a useful public interface to a Listing
  //
  pub resource interface ListingPublic {
    // purchase
    // Purchase the listing, buying the token.
    // This pays the beneficiaries and mints the token to the buyer.
    //
    pub fun purchase(
      payment: @FungibleToken.Vault,
      nftCollectionCapability: Capability<&{NonFungibleToken.CollectionPublic}>,
    )
    
    // getDetails
    //
    pub fun getDetails(): ListingDetails
  }


  // Listing
  // A resource that allows users to view the details of an admin's listing.
  // 
  pub resource Listing: ListingPublic {
    // The simple (non-Capability, non-complex) details of the sale.
    access(self) let details: ListingDetails

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
    pub fun purchase(
      payment: @FungibleToken.Vault,
      nftCollectionCapability: Capability<&{NonFungibleToken.CollectionPublic}>,
    ) {
      pre {
        nftCollectionCapability.borrow() != nil: "Cannot borrow nftCollectionCapability"
        self.details.purchased == false: "listing has already been purchased"
        payment.isInstance(self.details.salePaymentVaultType): "payment vault is not requested fungible token"
        payment.balance == self.details.salePrice: "payment vault does not contain requested price"
      }

      // Make sure the listing cannot be purchased again
      self.details.setToPurchased()

      // Get the minter from admin storage
      let minter = OpenSpaceAdminNFTStorefront.account.borrow<&OpenSpaceItems.NFTMinter>(from: OpenSpaceItems.MinterStoragePath) ??
        panic("Could not borrow a reference to the NFT minter")

      // Mint the NFTs to the specified account
      for metadata in self.details.metadatas {
        minter.mintNFT(recipient: nftCollectionCapability.borrow()!, initMetadata: metadata)
      }

      // Rather than aborting the transaction if any receiver is absent when we try to pay it,
      // we send the cut to the first valid receiver.
      // The first receiver should therefore either be the seller, or an agreed recipient for
      // any unpaid cuts.
      var residualReceiver: &{FungibleToken.Receiver}? = nil

      // Pay each beneficiary their amount of the payment.
      for cut in self.details.saleCuts {
        if let receiver = cut.receiver.borrow() {
          let paymentCut <- payment.withdraw(amount: cut.amount)
          receiver.deposit(from: <- paymentCut)
          if (residualReceiver == nil) {
            residualReceiver = receiver
          }
        }
      }

      assert(residualReceiver != nil, message: "No valid payment receivers")

      // At this point, if all recievers were active and availabile, then the payment Vault will have
      // zero tokens left, and this will functionally be a no-op that consumes the empty vault
      residualReceiver!.deposit(from: <- payment)

      // If the listing is purchased, we regard it as completed here.
      // Otherwise we regard it as completed in the destructor.
      emit ListingCompleted(
        packID: self.details.packID,
        storefrontResourceID: self.details.storefrontID,
        purchased: self.details.purchased
      )
    }

    // initializer
    //
    init(
      packID: String,
      metadatas: [{String: String}],
      salePaymentVaultType: Type,
      saleCuts: [SaleCut],
      storefrontID: UInt64
    ) {
      // Store the sale information
      self.details = ListingDetails(
        packID: packID,
        metadatas: metadatas,
        salePaymentVaultType: salePaymentVaultType,
        saleCuts: saleCuts,
        storefrontID: storefrontID
      )
    }
  }

  // StorefrontPublic
  // An interface that allows users to query admin listings and purchase packs
  // of NFTs.
  //
  pub resource interface StorefrontPublic {
    pub fun getSetIDs(): [String]
    pub fun getPackIDs(setID: String): [String]
    pub fun borrowListings(setID: String): &{String: Listing{ListingPublic}}?
    pub fun borrowListing(setID: String, packID: String): &Listing{ListingPublic}?
    pub fun cleanup(setID: String, packID: String)
  }

  // Storefront
  // A resource that allows its owner to query admin listings and purchase them.
  //
  pub resource Storefront: StorefrontPublic {

    // getSetIDs
    // Returns an array of set IDs.
    //
    pub fun getSetIDs(): [String] {
      return OpenSpaceAdminNFTStorefront.listings.keys
    }

    // getPackIDs
    // Returns an array of the pack IDs that are linked to the given setID.
    //
    pub fun getPackIDs(setID: String): [String] {
      let setListings = self.borrowListings(setID: setID)
      if (setListings != nil) {
        return setListings!.keys
      }
      return []
    }

    // borrowListings
    // Returns a read-only view of the listings for the given setID if it is contained by this collection.
    //
    pub fun borrowListings(setID: String): &{String: Listing{ListingPublic}}? {
      if OpenSpaceAdminNFTStorefront.listings[setID] != nil {
        return &OpenSpaceAdminNFTStorefront.listings[setID] as! &{String: Listing{ListingPublic}}
      } else {
        return nil
      }
    }

    // borrowListing
    // Returns a read-only view of the Listing if it is contained by this collection.
    //
    pub fun borrowListing(setID: String, packID: String): &Listing{ListingPublic}? {
      let setListings = self.borrowListings(setID: setID)
      if (setListings != nil) {
        let listing = setListings!
        return &listing[packID] as! &Listing{ListingPublic}
      } else {
        return nil
      }
    }

    // cleanup
    // Remove an listing *if* it has been purchased.
    // Anyone can call, but at present it only benefits the admin to do so.
    // Kind purchasers can however call it if they like.
    //
    pub fun cleanup(setID: String, packID: String) {
      pre {
        OpenSpaceAdminNFTStorefront.listings.containsKey(setID): "Set ID does not exist"
      }
      let setListings <- OpenSpaceAdminNFTStorefront.listings.remove(key: setID)!
      let listing <- setListings.remove(key: packID) ?? panic("missing Listing")
      let details = listing.getDetails()
      assert(details.purchased == true, message: "listing is not purchased, only admin can remove")
      destroy listing
      emit ListingCompleted(
        packID: details.packID,
        storefrontResourceID: details.storefrontID,
        purchased: details.purchased
      )
      if (setListings.length == 0) {
        destroy setListings
      } else {
        OpenSpaceAdminNFTStorefront.listings[setID] <-! setListings
      }
    }

    // destructor
    //
    destroy () {
      // Let event consumers know that this storefront will no longer exist.
      emit StorefrontDestroyed(storefrontResourceID: self.uuid)
    }

  }

  // StorefrontManager
  // An interface for adding and removing Listings within a Storefront,
  // intended for use by the Storefront's owner.
  //
  pub resource interface StorefrontManager {
    // createListing
    // Allows the Storefront owner to create and insert Listings.
    //
    pub fun createListing(
      setID: String,
      packID: String,
      metadatas: [{String: String}],
      salePaymentVaultType: Type,
      saleCuts: [SaleCut]
    ): String
    // removeListing
    // Allows the Storefront owner to remove any sale listing, acepted or not.
    //
    pub fun removeListing(setID: String, packID: String)
    // resolveListing
    // Allows the Storefront owner to remove any sale listing, acepted or not, and resolve its puchase status.
    //
    pub fun resolveListing(setID: String, packID: String, wasPurchased: Bool)
  }

  // AdminStorefront
  // A resource that allows its owner to create and remove listings.
  //
  pub resource AdminStorefront: StorefrontManager {

    // insert
    // Create and publish a Listing for a pack of NFTs.
    //
    pub fun createListing(
      setID: String,
      packID: String,
      metadatas: [{String: String}],
      salePaymentVaultType: Type,
      saleCuts: [SaleCut]
    ): String {
      let listing <- create Listing(
        packID: packID,
        metadatas: metadatas,
        salePaymentVaultType: salePaymentVaultType,
        saleCuts: saleCuts,
        storefrontID: self.uuid
      )

      let listingPrice = listing.getDetails().salePrice

      // Add the new listing to the dictionary.
      if (OpenSpaceAdminNFTStorefront.listings.containsKey(setID)) {
        let setListings <- OpenSpaceAdminNFTStorefront.listings.remove(key: setID)!
        if setListings.containsKey(packID) {
          panic("packID already exists")
        } else {
          let oldListing <- setListings[packID] <-! listing
          destroy oldListing        
        }
        OpenSpaceAdminNFTStorefront.listings[setID] <-! setListings
      } else {
        let oldSetListing <- OpenSpaceAdminNFTStorefront.listings[setID] <- { packID: <- listing }
        // Note that oldSetListing will always be nil, but we have to handle it.
        destroy oldSetListing
      }

      emit ListingAvailable(
        storefrontAddress: self.owner?.address!,
        setID: setID,
        packID: packID,
        metadatas: metadatas,
        ftVaultType: salePaymentVaultType,
        price: listingPrice
      )

      return packID
    }

    // removeListing
    // Remove a Listing from the collection and destroy it.
    //
    pub fun removeListing(setID: String, packID: String) {
      let setListings <- OpenSpaceAdminNFTStorefront.listings.remove(key: setID)!
      let listing <- setListings.remove(key: packID) ?? panic("missing Listing")
      let details = listing.getDetails()
      destroy listing
      emit ListingCompleted(
        packID: details.packID,
        storefrontResourceID: details.storefrontID,
        purchased: details.purchased
      )
      if (setListings.length == 0) {
        destroy setListings
      } else {
        OpenSpaceAdminNFTStorefront.listings[setID] <-! setListings      
      }
    }

    // resolveListing
    // Remove a Listing from the collection, mark it as either purchased or un-purchased, and destroy it.
    //
    pub fun resolveListing(setID: String, packID: String, wasPurchased: Bool) {
      let setListings <- OpenSpaceAdminNFTStorefront.listings.remove(key: setID)!
      let listing <- setListings.remove(key: packID) ?? panic("missing Listing")
      let details = listing.getDetails()
      destroy listing
      emit ListingCompleted(
        packID: details.packID,
        storefrontResourceID: details.storefrontID,
        purchased: wasPurchased
      )
      if (setListings.length == 0) {
        destroy setListings
      } else {
        OpenSpaceAdminNFTStorefront.listings[setID] <-! setListings      
      }
    }

  }

  // createStorefront
  // Make creating a Storefront publicly accessible.
  //
  pub fun createStorefront(): @Storefront {
    return <- create Storefront()
  }

  init() {
    self.StorefrontStoragePath = /storage/OpenSpaceAdminNFTStorefront
    self.StorefrontPublicPath = /public/OpenSpaceAdminNFTStorefront
    self.AdminStorefrontStoragePath = /storage/AdminOpenSpaceAdminNFTStorefront
    self.listings <- {}
    self.account.save(<- create AdminStorefront(), to: self.AdminStorefrontStoragePath)
    emit NFTStorefrontInitialized()
  }
}