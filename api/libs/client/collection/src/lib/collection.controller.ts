import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, UseGuards, Query, Get, Param } from '@nestjs/common'
import { FlowAddressDto, IsValidFlowAddressGuard } from '@api/flow/flow-utils'
import { OpenSpaceItemWithSubmissionAndFileDto } from '@api/database'
import { FlowAddressAndNftIdDto } from './dto/address-and-id.dto'
import { HasCollectionGuard } from '@api/flow/flow-nft'
import { NftDto } from 'libs/nfts/src/lib/dto/nft.dto'
import { RateLimiterGuard } from '@api/rate-limiter'
import { LimitOffsetOrderDto } from '@api/utils'
import { NftsService } from '@api/nfts'

@UseGuards(RateLimiterGuard)
@ApiTags('Collection')
@Controller('collection')
export class CollectionController {
  constructor(private readonly nftsService: NftsService) {}

  @ApiOperation({ summary: 'Gets all Open Space NFTs in the given account.' })
  @ApiResponse({
    status: 200,
    type: OpenSpaceItemWithSubmissionAndFileDto,
    isArray: true,
  })
  @UseGuards(IsValidFlowAddressGuard('params'), HasCollectionGuard)
  @Get(':address')
  async getCollection(
    @Param() { address }: FlowAddressDto,
    @Query() filterOpts: LimitOffsetOrderDto
  ): Promise<OpenSpaceItemWithSubmissionAndFileDto[]> {
    return await this.nftsService.getCollection(address, filterOpts)
  }

  @ApiOperation({
    summary:
      'Gets the metadata for an Open Space NFT in the specified user collection.',
  })
  @ApiResponse({ status: 200, type: NftDto })
  @UseGuards(IsValidFlowAddressGuard('params'), HasCollectionGuard)
  @Get(':address/nfts/:id')
  async getNft(
    @Param() { address, id }: FlowAddressAndNftIdDto
  ): Promise<NftDto> {
    return await this.nftsService.getNft(address, id)
  }
}
