import { ApiProperty } from '@nestjs/swagger'
import { User } from '@api/database'

export class UserDto implements User {
  @ApiProperty({ type: 'string', format: 'uuid' })
  id: string

  @ApiProperty({ type: 'string', format: 'date-time' })
  createdAt: Date

  @ApiProperty({ type: 'string', format: 'email' })
  email: string

  @ApiProperty({ type: 'string' })
  username: string
}
