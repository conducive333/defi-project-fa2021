import { IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DrawingPoolIdUserIdDto {
  @IsNotEmpty()
  @IsUUID(4)
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id: string

  @IsNotEmpty()
  @IsUUID(4)
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly userId: string
}
