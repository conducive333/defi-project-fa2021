import { NftSubmission } from '@api/database'
import { ApiProperty } from '@nestjs/swagger'

export class NftSubmissionDto
  implements Omit<NftSubmission, 'drawingPool' | 'creator'>
{
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  readonly createdAt: Date

  @ApiProperty({ type: 'string' })
  readonly name: string

  @ApiProperty({ type: 'string' })
  readonly description: string

  @ApiProperty({ type: 'string' })
  readonly image: string

  @ApiProperty({ type: 'string', example: '0x5a82ff7cd806d9fc' })
  readonly address: string

  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly drawingPoolId: string

  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly creatorId: string
}
