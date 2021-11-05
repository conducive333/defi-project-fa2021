import { UploadedFileDto } from '../uploaded-file/uploaded-file.dto'
import { NftSubmissionDto } from './nft-submission.dto'
import { ApiProperty } from '@nestjs/swagger'

export class NftSubmissionWithFileDto extends NftSubmissionDto {
  @ApiProperty({ type: UploadedFileDto })
  readonly file: UploadedFileDto
}
