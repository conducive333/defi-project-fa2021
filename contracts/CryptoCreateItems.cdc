/**
 This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
**/
import NonFungibleToken from 0x02

// CryptoCreateItems
// NFT items for Crypto Create!
//
pub contract CryptoCreateItems: NonFungibleToken {

    // Events
    //
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Minted(id: UInt64, initMeta: {String: String})

    // Named Paths
    //
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let MinterStoragePath: StoragePath

    // totalSupply
    // The total number of CryptoCreateItems that have been minted
    //
    pub var totalSupply: UInt64

    // NFT
    // A Crypto Gnome as an NFT
    //
    pub resource NFT: NonFungibleToken.INFT {
        // The token's ID
        pub let id: UInt64

        // The token's metadata in dict format
        access(self) let metadata: {String: String}

        // initializer
        //
        init(initID: UInt64, initMeta: {String: String}) {
            self.id = initID
            self.metadata = initMeta
        }

        pub fun getMetadata(): {String: String} {
            return self.metadata
        }
    }

    // This is the interface that users can cast their CryptoCreateItems Collection as
    // to allow others to deposit CryptoCreateItems into their Collection. It also allows for reading
    // the details of CryptoCreateItems in the Collection.
    pub resource interface CryptoCreateItemsCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun getLength(): Int
        pub fun borrowNFT(id: UInt64): & NonFungibleToken.NFT
        pub fun borrowItem(id: UInt64): & CryptoCreateItems.NFT? {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id):
                "Cannot borrow reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // Collection
    // A collection of CryptoCreate NFTs owned by an account
    //
    pub resource Collection: CryptoCreateItemsCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an 'UInt64' ID field
        //
        pub var ownedNFTs: @ {UInt64: NonFungibleToken.NFT}

        // withdraw
        // Removes an NFT from the collection and moves it to the caller
        //
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token<-self.ownedNFTs.remove(key: withdrawID)?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner!.address)

            return <-token
        }

        // deposit
        // Takes an NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        //
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token<-token as!@CryptoCreateItems.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken<-self.ownedNFTs[id]<-token

            emit Deposit(id: id, to: self.owner!.address)

            destroy oldToken
        }

        // getIDs
        // Returns an array of the IDs that are in the collection
        //
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // getLength
        // Returns the length of the collection
        //
        pub fun getLength(): Int {
            return self.ownedNFTs.length
        }

        // borrowNFT
        // Gets a reference to an NFT in the collection using its ID
        // so that the caller can read its metadata and call its methods
        //
        pub fun borrowNFT(id: UInt64): & NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as & NonFungibleToken.NFT
        }

        // borrowItem
        // Gets a reference to an NFT in the collection as a CryptoCreate,
        // exposing all of its fields (including the typeID).
        // This is safe as there are no functions that can be called on the CryptoCreate.
        //
        pub fun borrowItem(id: UInt64): & CryptoCreateItems.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = & self.ownedNFTs[id] as auth & NonFungibleToken.NFT
                return ref as! & CryptoCreateItems.NFT
            } else {
                return nil
            }
        }

        // destructor
        destroy() {
            destroy self.ownedNFTs
        }

        // initializer
        //
        init() {
            self.ownedNFTs<-{}
        }
    }

    // createEmptyCollection
    // public function that anyone can call to create a new empty collection
    //
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <-create Collection()
    }

    // NFTMinter
    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
    pub resource NFTMinter {
        // mintNFT
        // Mints a new NFT with a new ID
        // and deposit it in the recipients collection using their collection reference
        //
        pub fun mintNFT(recipient: & {NonFungibleToken.CollectionPublic}, initMetadata: {String: String}) {
            let nftID = CryptoCreateItems.totalSupply
            emit Minted(id: nftID, initMeta: initMetadata)
            CryptoCreateItems.totalSupply = nftID + (1 as UInt64)
            recipient.deposit(token:<-create CryptoCreateItems.NFT(initID: nftID, initMeta: initMetadata))
        }
    }

    // initializer
    //
    init() {
        // Set our named paths
        self.CollectionStoragePath = /storage/CryptoCreateCollection
        self.CollectionPublicPath = /public/CryptoCreateCollection
        self.MinterStoragePath = /storage/CryptoCreateMinter

        // Initialize the total supply
        self.totalSupply = 0

        // Create a Minter resource and save it to storage
        let minter<-create NFTMinter()
        self.account.save(<-minter, to: self.MinterStoragePath)

        emit ContractInitialized()
    }
}