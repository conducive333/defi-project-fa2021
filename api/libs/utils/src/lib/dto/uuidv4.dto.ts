import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UUIDv4Dto {
  @IsNotEmpty()
  @IsUUID(4)
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id: string
}
