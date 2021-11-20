import { FlowAddressDto } from '@api/flow/flow-utils'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FlowAddressAndNftIdDto extends FlowAddressDto {
  @IsNotEmpty()
  @IsUUID(4)
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id!: string
}
