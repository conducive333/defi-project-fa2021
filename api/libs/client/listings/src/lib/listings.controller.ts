import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FlowAddressDto, IsValidFlowAddressGuard } from '@api/flow/flow-service'
import { HasFlowStorefront, ListingDto } from '@api/flow/flow-storefront'
import { RateLimiterGuard } from '@api/rate-limiter'
import { FlowAddressAndListingIdDto } from './dto/address-and-id.dto'
import { FlowStorefrontService } from '@api/flow/flow-storefront'
import {
  DrawingPoolIdWithNftId,
  ListingsService,
  NftWithAdminListingDto,
} from '@api/listings'
import { LimitOffsetDto } from '@api/utils'

@UseGuards(RateLimiterGuard)
@ApiTags('Listings')
@Controller('listings')
export class ClientListingsController {
  constructor(
    private readonly flowStorefrontService: FlowStorefrontService,
    private readonly listingsService: ListingsService
  ) {}

  @ApiOperation({
    summary: 'Finds a particular listing on the primary storefront.',
  })
  @ApiResponse({ status: 200, type: NftWithAdminListingDto })
  @Get(':id')
  async getAdminListing({
    id,
  }: DrawingPoolIdWithNftId): Promise<NftWithAdminListingDto> {
    return await this.listingsService.findOneAdminListing(id)
  }

  // TODO
  // @ApiOperation({
  //   summary: 'Finds a particular listing on a user storefront.',
  // })
  // @ApiResponse({ status: 200, type: ListingDto })
  // @UseGuards(IsValidFlowAddressGuard('params'), HasFlowStorefront)
  // @Get(':id/user/:address')
  // async getClientListing(
  //   // TODO: fix + get item
  //   @Param() { id, address }: FlowAddressAndListingIdDto
  // ): Promise<ListingDto> {
  //   const saleOffer = await this.flowStorefrontService.getSaleOffer(
  //     address,
  //     id
  //   )
  //   if (saleOffer) {
  //     return saleOffer
  //   }
  //   throw new NotFoundException()
  // }

  // // TODO: get item as well
  // @ApiOperation({
  //   summary: 'Fetches multiple listings from a user storefront.',
  // })
  // @ApiResponse({ status: 200, type: ListingDto, isArray: true })
  // @UseGuards(IsValidFlowAddressGuard('params'), HasFlowStorefront)
  // @Get('user/:address')
  // async getClientListings(
  //   @Param() { address }: FlowAddressDto,
  //   @Query() filterOpts: LimitOffsetDto
  // ): Promise<ListingDto[]> {
  //   return await this.flowStorefrontService.getSaleOffers(
  //     address,
  //     filterOpts.limit,
  //     filterOpts.offset
  //   )
  // }
}
