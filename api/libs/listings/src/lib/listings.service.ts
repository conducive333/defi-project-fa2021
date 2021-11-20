import { AdminStorefrontService } from '@api/flow/flow-admin-storefront'
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
    private readonly nftsService: NftsService
  ) {}

  async create(nftSubmissionId: string) {
    const openSpaceItem = await this.nftsService.create(nftSubmissionId)
    const listing = await this.adminStorefrontService.borrowListing(
      openSpaceItem.nftSubmission.drawingPoolId,
      openSpaceItem.id
    )
    if (!listing) {
      await this.adminStorefrontService.sell(
        openSpaceItem.nftSubmission.drawingPoolId,
        openSpaceItem.id,
        ListingsService.NFT_PRICE,
        openSpaceItem.nftSubmission.address,
        ListingsService.CREATOR_CUT,
        [{ openSpaceItemId: openSpaceItem.id }]
      )
    }
    return openSpaceItem
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

  async findOneAdminListing(
    openSpaceItemId: string
  ): Promise<NftWithAdminListingDto> {
    const openSpaceItem = await this.nftsService.findOne(openSpaceItemId)
    if (openSpaceItem) {
      const listing = await this.adminStorefrontService.borrowListing(
        openSpaceItem.nftSubmission.drawingPoolId,
        openSpaceItemId
      )
      if (listing) {
        return {
          ...openSpaceItem,
          listing,
        }
      }
      throw new NotFoundException(
        'Listing does not exist on the primary storefront.'
      )
    }
    throw new NotFoundException('Could not find listing.')
  }

  async remove(openSpaceItemId: string) {
    await this.nftsService.remove(openSpaceItemId, async (nft) => {
      await this.adminStorefrontService.remove(
        nft.nftSubmission.drawingPoolId,
        openSpaceItemId
      )
    })
  }
}
