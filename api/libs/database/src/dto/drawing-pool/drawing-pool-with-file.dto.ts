import { UploadedFileDto } from '../uploaded-file/uploaded-file.dto'
import { DrawingPoolDto } from './drawing-pool.dto'
import { ApiProperty } from '@nestjs/swagger'

export class DrawingPoolWithFileDto extends DrawingPoolDto {
  @ApiProperty({ type: UploadedFileDto })
  readonly file: UploadedFileDto
}
