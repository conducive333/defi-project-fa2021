import { NftSubmissionDto } from './nft-submission.dto'
import { CryptoCreateFileDto } from '../crypto-create-file/crypto-create-file.dto'
import { ApiProperty } from '@nestjs/swagger'

export class NftSubmissionWithFileDto extends NftSubmissionDto {
  @ApiProperty({ type: CryptoCreateFileDto })
  readonly file: CryptoCreateFileDto
}
