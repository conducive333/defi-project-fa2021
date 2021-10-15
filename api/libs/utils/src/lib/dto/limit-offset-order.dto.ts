import { IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LimitOffsetDto } from './limit-offset.dto'
import { OrderBy } from '../enums/order-by.enum'

export class LimitOffsetOrderDto extends LimitOffsetDto {
  @IsOptional()
  @IsEnum(OrderBy)
  @ApiProperty({
    enum: OrderBy,
    required: false,
    default: OrderBy.DESC,
  })
  readonly order: OrderBy = OrderBy.DESC
}
