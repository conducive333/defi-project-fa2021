import { IsNotEmpty, IsString, IsUUID, Length, Matches, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DrawingPoolIdUserIdDto {
  @IsNotEmpty()
  @IsUUID(4)
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id: string

  @IsNotEmpty()
  @IsString()
  @Length(21, 21)
  @ApiProperty({ type: 'string', example: '118336225259807388658' })
  readonly userId: string
}
