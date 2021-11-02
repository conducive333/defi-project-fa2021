import { IsDate, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { DrawingPoolDto } from '@api/database'
import { ApiProperty } from '@nestjs/swagger'

export class CreateEmptyDrawingPoolDto
  implements
    Omit<DrawingPoolDto, 'id' | 'createdAt' | 'fileId' | 'drawingPoolId'>
{
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({
    type: 'string',
    minLength: 3,
    maxLength: 50,
  })
  readonly name!: string

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(160)
  @ApiProperty({
    type: 'string',
    minLength: 0,
    maxLength: 160,
  })
  readonly description!: string

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  readonly releaseDate!: Date

  @IsNotEmpty()
  @IsDate()
  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  readonly endDate!: Date

}
