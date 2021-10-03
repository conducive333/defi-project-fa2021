import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Matches } from 'class-validator'

export class FlowAddressDto {
  @IsNotEmpty()
  @Matches(new RegExp('0x[a-z0-9]{16}'))
  @ApiProperty({ name: 'address', example: '0x2ac5d2fc4ce35073' })
  readonly address: string
}
