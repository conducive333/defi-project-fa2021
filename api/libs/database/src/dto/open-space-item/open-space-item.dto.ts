import { OpenSpaceItem } from '../../entity/OpenSpaceItem.entity'
import { ApiProperty } from '@nestjs/swagger'

export class OpenSpaceItemDto
  implements
    Omit<OpenSpaceItem, 'nftSubmission' | 'events' | 'saleOfferAvailableEvent'>
{
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  readonly createdAt: Date

  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly nftSubmissionId: string
}
