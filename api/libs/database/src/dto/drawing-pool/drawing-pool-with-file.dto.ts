import { CryptoCreateFileDto } from '../crypto-create-file/crypto-create-file.dto'
import { DrawingPoolDto } from './drawing-pool.dto'
import { ApiProperty } from '@nestjs/swagger'

export class DrawingPoolWithFileDto extends DrawingPoolDto {
  @ApiProperty({ type: CryptoCreateFileDto })
  readonly file: CryptoCreateFileDto
}
