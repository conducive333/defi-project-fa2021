import { AdminStorefrontService } from '@api/flow/flow-admin-storefront'
import { FlowStorefrontService } from '@api/flow/flow-storefront'
import { NftWithAdminListingDto } from './dto/nft-with-admin-listing.dto'
import { Injectable, NotFoundException } from '@nestjs/common'
import { LimitOffsetOrderQueryDto } from '@api/utils'
import { NftsService } from '@api/nfts'

@Injectable()
export class ListingsService {
  private static readonly NFT_PRICE = 1.0
  private static readonly CREATOR_CUT = 0.5

  constructor(
    private readonly adminStorefrontService: AdminStorefrontService,
    private readonly flowStorefrontService: FlowStorefrontService,
    private readonly nftsService: NftsService
  ) {}

  async create(nftSubmissionId: string): Promise<NftWithAdminListingDto> {
    const nft = await this.nftsService.create(nftSubmissionId)
    const listing = await this.adminStorefrontService.borrowListing(
      nft.nftSubmission.drawingPoolId,
      nft.id
    )
    if (!listing) {
      await this.adminStorefrontService.sell(
        nft.nftSubmission.drawingPoolId,
        nft.id,
        ListingsService.NFT_PRICE,
        nft.nftSubmission.address,
        ListingsService.CREATOR_CUT,
        [{ openSpaceItemId: nft.id }]
      )
    }
    return {
      ...nft,
      listing,
    }
  }

  async findAllAdminListings(
    drawingPoolId: string,
    filterOpts: LimitOffsetOrderQueryDto
  ) {
    return await this.nftsService.findAll(filterOpts, {
      nftSubmission: {
        drawingPoolId,
      },
    })
  }

  // TODO
  // async findAllUserListings(filterOpts: LimitOffsetOrderQueryDto) {
  //   return await this.flowStorefrontService.getSaleOffers(
  //     address,
  //     filterOpts.limit,
  //     filterOpts.offset
  //   )
  // }

  async findOneAdminListing(nftId: string): Promise<NftWithAdminListingDto> {
    const nft = await this.nftsService.findOne(nftId)
    if (nft) {
      const listing = await this.adminStorefrontService.borrowListing(
        nft.nftSubmission.drawingPoolId,
        nftId
      )
      if (listing) {
        return {
          ...nft,
          listing,
        }
      }
      throw new NotFoundException(
        'Listing does not exist on the primary storefront.'
      )
    }
    throw new NotFoundException('Could not find listing.')
  }

  // TODO
  // async findOneUserListing(nftId: string): Promise<NftWithAdminListingDto> {
  //   const nft = await this.nftsService.findOne(nftId)
  //   if (nft) {
  //     const listing = await this.adminStorefrontService.borrowListing(nft.nftSubmission.drawingPoolId, nftId)
  //     if (listing) {
  //       return {
  //         ...nft,
  //         listing
  //       }
  //     }
  //     throw new NotFoundException('Listing does not exist on the primary storefront.')
  //   }
  //   throw new NotFoundException('Could not find listing.')
  // }

  async remove(nftId: string) {
    await this.nftsService.remove(nftId, async (nft) => {
      await this.adminStorefrontService.remove(
        nft.nftSubmission.drawingPoolId,
        nftId
      )
    })
  }
}
