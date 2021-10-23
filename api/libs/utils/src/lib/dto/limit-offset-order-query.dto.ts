import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { LimitOffsetOrderDto } from './limit-offset-order.dto'

export class LimitOffsetOrderQueryDto extends LimitOffsetOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    type: 'string',
    required: false,
    maxLength: 50,
  })
  readonly query?: string
}
