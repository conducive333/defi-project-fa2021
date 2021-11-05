import { CreateEmptyDrawingPoolDto } from './create-empty-drawing-pool.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Express } from 'express'
import 'multer'

export class CreateEmptyDrawingPoolWithFileDto extends CreateEmptyDrawingPoolDto {
  @ApiProperty({ type: 'file' })
  readonly file?: Express.Multer.File
}
