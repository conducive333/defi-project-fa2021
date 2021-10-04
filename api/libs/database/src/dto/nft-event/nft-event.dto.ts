import { NftEventType } from '../../entity/NftEvent.entity'
import { ApiProperty } from '@nestjs/swagger'

export class NftEventDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  readonly createdAt: Date

  @ApiProperty({
    enum: NftEventType,
    example: NftEventType.deposit,
  })
  readonly eventType: string

  @ApiProperty({ type: 'integer' })
  readonly eventIndex: number

  @ApiProperty({ type: 'string' })
  readonly nftId: string

  @ApiProperty({ type: 'string', example: '0x2ac5d2fc4ce35073' })
  readonly address: string

  @ApiProperty({
    type: 'string',
    example: 'c18d8d58c0c1f100da0ed39eda3b989eb402f55c4c304de19242bf6b01742fec',
  })
  readonly flowTransactionId: string

  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly marketItemId: string
}
