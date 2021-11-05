import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FlowAddressDto, IsValidFlowAddressGuard } from '@api/flow/flow-service'
import { HasFlowStorefront } from '@api/flow/flow-storefront'
import { RateLimiterGuard } from '@api/rate-limiter'
import { FlowStorefrontService } from '@api/flow/flow-storefront'
import {
  DrawingPoolIdWithNftId,
  ListingsService,
  NftWithAdminListingDto,
  NftWithUserListingDto,
} from '@api/listings'
import { FlowAddressAndOpenSpaceItemIdDto } from './dto/address-and-id.dto'
import {
  OpenSpaceItemDto,
  OpenSpaceItemWithSubmissionAndFileDto,
} from '@api/database'
import { LimitOffsetOrderQueryDto } from '@api/utils'

@UseGuards(RateLimiterGuard)
@ApiTags('Listings')
@Controller('listings')
export class ClientListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @ApiOperation({
    summary:
      'Finds a listing on the primary storefront by its OpenSpaceItem ID.',
  })
  @ApiResponse({ status: 200, type: NftWithAdminListingDto })
  @Get(':id')
  async getAdminListing({
    id,
  }: DrawingPoolIdWithNftId): Promise<NftWithAdminListingDto> {
    return await this.listingsService.findOneAdminListing(id)
  }

  @ApiOperation({
    summary: 'Finds a listing on a user storefront by its OpenSpaceItem ID.',
  })
  @ApiResponse({ status: 200, type: NftWithUserListingDto })
  @UseGuards(IsValidFlowAddressGuard('params'), HasFlowStorefront)
  @Get(':address/nfts/:id')
  async getClientListing(
    @Param() { id, address }: FlowAddressAndOpenSpaceItemIdDto
  ): Promise<NftWithUserListingDto> {
    return await this.listingsService.findOneUserListing(address, id)
  }

  @ApiOperation({
    summary: 'Fetches multiple listings from a user storefront.',
  })
  @ApiResponse({
    status: 200,
    type: OpenSpaceItemWithSubmissionAndFileDto,
    isArray: true,
  })
  @UseGuards(IsValidFlowAddressGuard('params'), HasFlowStorefront)
  @Get(':address')
  async getClientListings(
    @Param() { address }: FlowAddressDto,
    @Query() filterOpts: LimitOffsetOrderQueryDto
  ): Promise<OpenSpaceItemWithSubmissionAndFileDto[]> {
    return await this.listingsService.findAllUserListings(address, filterOpts)
  }
}
