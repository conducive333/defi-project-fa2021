import { FlowAddressDto } from '@api/flow/flow-service'
import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Max, Min } from 'class-validator'

export class FlowAddressAndListingIdDto extends FlowAddressDto {
  @IsInt()
  @Min(0)
  @Max(2 ** 64 - 1)
  @ApiProperty({ type: 'integer', example: 14207279 })
  readonly id: number
}
