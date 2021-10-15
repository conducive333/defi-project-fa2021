import { ApiProperty } from '@nestjs/swagger'
import { ReceiverDto } from './receiver.dto'

export class SaleCutsDto {
  @ApiProperty({ type: ReceiverDto })
  readonly receiver: ReceiverDto

  @ApiProperty({ type: 'string', example: '8.91204160' })
  readonly amount: string
}
