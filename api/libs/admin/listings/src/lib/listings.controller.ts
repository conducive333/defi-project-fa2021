import { Controller, Param, Delete, Post, Body } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateListingDto } from './dto/create-listing.dto'
import { SuccessDto, UUIDv4Dto } from '@api/utils'
import { ListingsService, NftWithAdminListingDto } from '@api/listings'

@ApiTags('Listings')
@Controller('listings')
export class AdminListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @ApiOperation({
    summary: 'Creates a listing for this submission on the primary storefront.',
  })
  @ApiResponse({ status: 200, type: NftWithAdminListingDto })
  @Post()
  async create(
    @Body() { nftSubmissionId }: CreateListingDto
  ): Promise<NftWithAdminListingDto> {
    return await this.listingsService.create(nftSubmissionId)
  }

  @ApiOperation({
    summary: 'Removes a listing from the primary storefront.',
  })
  @ApiResponse({ status: 200, type: SuccessDto })
  @Delete(':id')
  async remove(@Param('id') { id }: UUIDv4Dto): Promise<SuccessDto> {
    await this.listingsService.remove(id)
    return { data: 'SUCCESS' }
  }
}
