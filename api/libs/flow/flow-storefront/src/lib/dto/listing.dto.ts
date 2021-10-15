import { ApiProperty } from '@nestjs/swagger'
import { ListingDetailsDto } from './listing-details.dto'

export class ListingDto {
  @ApiProperty({
    type: 'integer',
    minimum: 0,
    maximum: 2 ** 64 - 1,
    example: 14202571,
  })
  readonly uuid: number

  @ApiProperty({ type: ListingDetailsDto })
  readonly details: ListingDetailsDto
}
