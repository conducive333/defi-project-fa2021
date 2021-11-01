import { FlowAddressDto } from '@api/flow/flow-service'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class FlowAddressAndNftIdDto extends FlowAddressDto {
  @IsNotEmpty()
  @IsUUID(4)
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id!: string
}
