import { FlowAddressDto } from '@api/flow/flow-service'
import { NftSubmissionDto } from '@api/database'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class CreateSubmissionDto
  extends FlowAddressDto
  implements
    Omit<
      NftSubmissionDto,
      'id' | 'createdAt' | 'fileId' | 'drawingPoolId' | 'creatorId'
    >
{
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ type: 'string' })
  readonly name: string

  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(160)
  @ApiProperty({ type: 'string' })
  readonly description: string
}
