import { CreateSubmissionDto } from './create-submission.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Express } from 'express'
import 'multer'

export class CreateImageSubmissionDto extends CreateSubmissionDto {
  @ApiProperty({ type: 'file' })
  readonly image: Express.Multer.File
}
