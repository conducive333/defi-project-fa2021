import { CreateDrawingPoolDto } from './create-drawing-pool.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Express } from 'express'
import 'multer'

export class CreateDrawingPoolWithFileDto extends CreateDrawingPoolDto {
  @ApiProperty({ type: 'file' })
  readonly file?: Express.Multer.File
}
