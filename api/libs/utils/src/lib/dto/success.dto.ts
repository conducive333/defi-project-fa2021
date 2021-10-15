import { ApiProperty } from '@nestjs/swagger'
export class SuccessDto {
  @ApiProperty({ enum: ['SUCCESS'] })
  readonly data: 'SUCCESS'
}
