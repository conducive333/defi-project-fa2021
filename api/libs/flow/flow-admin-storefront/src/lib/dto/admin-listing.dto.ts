import { ApiProperty } from '@nestjs/swagger'
import { ListingDetailsDto } from './listing-details.dto'

export class AdminListingDto {
  @ApiProperty({ type: 'integer', example: '14202571' })
  readonly uuid: number

  @ApiProperty({ type: ListingDetailsDto })
  readonly details: ListingDetailsDto
}
