import { ApiProperty } from '@nestjs/swagger'

export class DrawingPoolDto {
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

  @ApiProperty({ type: 'string', format: 'date-time' })
  readonly releaseDate: Date

  @ApiProperty({ type: 'string', format: 'date-time' })
  readonly endDate: Date

  @ApiProperty({ type: 'integer' })
  readonly size: number
}
