import { CreateRandomDrawingPoolDto } from './create-random-drawing-pool.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Express } from 'express'
import 'multer'

export class CreateRandomDrawingPoolWithFileDto extends CreateRandomDrawingPoolDto {
  @ApiProperty({ type: 'file' })
  readonly file?: Express.Multer.File
}
