import { ApiProperty } from '@nestjs/swagger'
import { User } from '@api/database'

export class UserDto
  implements Omit<User, 'drawingPool' | 'submissions' | 'userToDrawingPools'>
{
  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly id: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  readonly createdAt: Date

  @ApiProperty({ type: 'string', format: 'email' })
  readonly email: string

  @ApiProperty({ type: 'string' })
  readonly username: string

  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly drawingPoolId: string
}
