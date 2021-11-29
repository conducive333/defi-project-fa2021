import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { RateLimiterGuard } from '@api/rate-limiter'
import {
  ListingsService,
  NftWithAdminListingDto,
} from '@api/listings'
import { UUIDv4Dto } from '@api/utils'

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
  async getAdminListing(@Param() { id }: UUIDv4Dto): Promise<NftWithAdminListingDto> {
    return await this.listingsService.findOneAdminListing(id)
  }
}
