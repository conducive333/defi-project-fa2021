import { CreateSubmissionDto } from './create-submission.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Express } from 'express'
import 'multer'

export class CreateFileSubmissionDto extends CreateSubmissionDto {
  @ApiProperty({ type: 'file' })
  readonly file?: Express.Multer.File
}
