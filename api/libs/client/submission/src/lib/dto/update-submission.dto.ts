import { FlowAddressDto } from '@api/flow/flow-service'
import { NftSubmissionDto } from '@api/database'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, Matches, MaxLength, MinLength } from 'class-validator'

export class UpdateSubmissionDto
  extends FlowAddressDto
  implements
    Omit<NftSubmissionDto, 'id' | 'createdAt' | 'drawingPoolId' | 'creatorId'>
{
  @IsOptional()
  @MinLength(3)
  @MaxLength(50)
  @ApiProperty({ type: 'string', required: false })
  readonly name: string

  @IsOptional()
  @MinLength(0)
  @MaxLength(160)
  @ApiProperty({ type: 'string', required: false })
  readonly description: string

  @IsOptional()
  @MaxLength(2047)
  @ApiProperty({ type: 'string', required: false })
  readonly image: string

  @IsOptional()
  @Matches(new RegExp('0x[a-z0-9]{16}'))
  @ApiProperty({ name: 'address', example: '0x2ac5d2fc4ce35073', required: false })
  readonly address: string
}
