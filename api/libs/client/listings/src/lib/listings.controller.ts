import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RateLimiterGuard } from '@api/rate-limiter'
import {
  DrawingPoolIdWithNftId,
  ListingsService,
  NftWithAdminListingDto,
} from '@api/listings'

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
}
