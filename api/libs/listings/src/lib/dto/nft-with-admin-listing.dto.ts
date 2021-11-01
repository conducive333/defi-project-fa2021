import { AdminListingDto } from '@api/flow/flow-admin-storefront'
import { OpenSpaceItemWithSubmissionAndFileDto } from '@api/database'
import { ApiProperty } from '@nestjs/swagger'

export class NftWithAdminListingDto extends OpenSpaceItemWithSubmissionAndFileDto {
  @ApiProperty({ type: AdminListingDto })
  readonly listing!: AdminListingDto
}
