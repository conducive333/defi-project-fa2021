import { NftSubmissionWithFileDto } from '../nft-submission/nft-submission-with-file.dto'
import { OpenSpaceItemDto } from './open-space-item.dto'
import { ApiProperty } from '@nestjs/swagger'

export class OpenSpaceItemWithSubmissionAndFileDto extends OpenSpaceItemDto {
  @ApiProperty({ type: NftSubmissionWithFileDto })
  readonly nftSubmission: NftSubmissionWithFileDto
}
