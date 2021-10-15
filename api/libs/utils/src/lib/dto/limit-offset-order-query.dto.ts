import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { LimitOffsetOrderDto } from './limit-offset-order.dto'

export class LimitOffsetOrderQueryDto extends LimitOffsetOrderDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: 'string',
    required: false,
  })
  readonly query: string
}
