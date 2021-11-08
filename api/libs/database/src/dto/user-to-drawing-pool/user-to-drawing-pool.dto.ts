import { UserToDrawingPool } from '../../entity/UserToDrawingPool.entity'
import { ApiProperty } from '@nestjs/swagger'

export class UserToDrawingPoolDto
  implements Omit<UserToDrawingPool, 'user' | 'drawingPool'>
{
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  readonly createdAt: Date

  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly drawingPoolId: string

  @ApiProperty({ type: 'string' })
  readonly userId: string
}
