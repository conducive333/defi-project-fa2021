import { FlowAddressDto } from '@api/flow/flow-service'
import { DrawingPoolDto } from '@api/database'
import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class CreateDrawingPoolDto
  extends FlowAddressDto
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

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(1000)
  @ApiProperty({
    type: 'string',
    minLength: 0,
    maxLength: 1000,
  })
  readonly size!: number
}
