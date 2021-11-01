import { OpenSpaceItemWithSubmissionAndFileDto } from '@api/database'
import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Max, Min } from 'class-validator'

export class NftDto extends OpenSpaceItemWithSubmissionAndFileDto {
  @IsInt()
  @Min(0)
  @Max(2 ** 64 - 1)
  @ApiProperty({ type: 'integer', example: 14207279 })
  readonly nftId!: number
}
