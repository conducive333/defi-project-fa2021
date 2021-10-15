import { ApiProperty } from '@nestjs/swagger'

class ValueDto {
  @ApiProperty({ type: 'string', example: 'public' })
  readonly domain: string
  @ApiProperty({ type: 'string', example: 'flowTokenReceiver' })
  readonly identifier: string
}

class PathDto {
  @ApiProperty({ type: 'string', example: 'Path' })
  readonly type: string
  @ApiProperty({ type: 'string', example: 'Path' })
  readonly value: ValueDto
}

export class ReceiverDto {
  @ApiProperty({ type: PathDto })
  readonly path: PathDto
  @ApiProperty({ type: 'string', example: '0x543c936653c95e57' })
  readonly address: string
  @ApiProperty({
    type: 'string',
    example:
      '&A.7e60df042a9c0868.FlowToken.Vault{A.9a0766d93b6608b7.FungibleToken.Receiver}',
  })
  readonly borrowType: string
}
