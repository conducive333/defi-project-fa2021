import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { StorefrontService } from './storefront.service'
import { LimitOffsetDto } from '@api/utils'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AdminListingDto } from '@api/flow/flow-admin-storefront'
import { FlowAddressDto, IsValidFlowAddressGuard } from '@api/flow/flow-service'
import { HasFlowStorefront, ListingDto } from '@api/flow/flow-storefront'
import { RateLimiterGuard } from '@api/rate-limiter'
import { FlowAddressAndListingIdDto } from './dto/address-and-id.dto'

@UseGuards(RateLimiterGuard)
@ApiTags('Storefront')
@Controller('storefront')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @ApiOperation({
    summary: 'Finds a particular listing on the primary storefront.',
  })
  @ApiResponse({ status: 200, type: AdminListingDto })
  @Get(':id')
  async getAdminListing(id: number): Promise<AdminListingDto> {
    return await this.storefrontService.getAdminListing(id)
  }

  @ApiOperation({
    summary: 'Fetches multiple listings from the primary storefront.',
  })
  @ApiResponse({ status: 200, type: AdminListingDto, isArray: true })
  @Get()
  async getAdminListings(
    @Query() filterOpts: LimitOffsetDto
  ): Promise<AdminListingDto[]> {
    return await this.storefrontService.getAdminListings(filterOpts)
  }

  @ApiOperation({
    summary: 'Finds a particular listing on a user storefront.',
  })
  @ApiResponse({ status: 200, type: ListingDto })
  @UseGuards(IsValidFlowAddressGuard('params'), HasFlowStorefront)
  @Get('user/:address/listing/:id')
  async getClientListing(
    @Param() addressAndId: FlowAddressAndListingIdDto
  ): Promise<ListingDto> {
    return await this.storefrontService.getClientListing(addressAndId)
  }

  @ApiOperation({
    summary: 'Fetches multiple listings from a user storefront.',
  })
  @ApiResponse({ status: 200, type: ListingDto, isArray: true })
  @UseGuards(IsValidFlowAddressGuard('params'), HasFlowStorefront)
  @Get('user/:address')
  async getClientListings(
    @Param() flowAddress: FlowAddressDto,
    @Query() filterOpts: LimitOffsetDto
  ): Promise<ListingDto[]> {
    return await this.storefrontService.getClientListings(
      flowAddress.address,
      filterOpts
    )
  }
}
