import { ApiProperty } from '@nestjs/swagger'

export class TransactionIdDto {
  @ApiProperty({
    type: 'string',
    example: '5f029af08395942d55715108a9a56b6fbd46819fe9bf06b9622c4c03a9457567',
  })
  readonly transactionId!: string
}
