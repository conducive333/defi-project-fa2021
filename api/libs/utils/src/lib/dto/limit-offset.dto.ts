import { IsInt, Min, Max, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

export class LimitOffsetDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(10)
  @ApiProperty({
    type: 'integer',
    description: 'Limits the number of records returned.',
    required: false,
    minimum: 0,
    maximum: 10,
    default: 10,
  })
  readonly limit: number = 10

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty({
    type: 'integer',
    description: 'Skips the first `offset` records before fetching results.',
    required: false,
    minimum: 0,
    default: 0,
  })
  readonly offset: number = 0
}
