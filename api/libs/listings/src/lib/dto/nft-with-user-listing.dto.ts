import { OpenSpaceItemWithSubmissionAndFileDto } from '@api/database'
import { ListingDto } from '@api/flow/flow-storefront'
import { ApiProperty } from '@nestjs/swagger'

export class NftWithUserListingDto extends OpenSpaceItemWithSubmissionAndFileDto {
  @ApiProperty({ type: ListingDto })
  readonly listing!: ListingDto
}
