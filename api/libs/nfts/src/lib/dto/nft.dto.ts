import { OpenSpaceItemWithSubmissionAndFileDto } from '@api/database'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator'

export class NftDto extends OpenSpaceItemWithSubmissionAndFileDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(2 ** 64 - 1)
  @ApiProperty({ type: 'integer', example: 14207279 })
  readonly nftId!: number
}
