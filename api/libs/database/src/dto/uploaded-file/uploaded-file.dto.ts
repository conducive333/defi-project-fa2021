import { UploadedFile, FileType } from '../../entity/UploadedFile.entity'
import { ApiProperty } from '@nestjs/swagger'

export class UploadedFileDto implements UploadedFile {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  readonly createdAt: Date

  @ApiProperty({ type: 'string' })
  readonly key: string

  @ApiProperty({ type: 'string' })
  readonly name: string

  @ApiProperty({ type: 'string' })
  readonly url: string

  @ApiProperty({ type: 'string' })
  readonly mimetype: string

  @ApiProperty({ enum: FileType, example: FileType.IMAGE })
  readonly category: FileType

  @ApiProperty({ type: 'integer' })
  readonly size: number
}
