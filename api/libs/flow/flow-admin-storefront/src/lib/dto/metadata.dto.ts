import { NftMetadata } from '@api/flow/flow-nft'
import { ApiProperty } from '@nestjs/swagger'

export class NftMetadataDto implements NftMetadata {
  [x: string]: string

  @ApiProperty({ type: 'string', format: 'uuid' })
  readonly openSpaceItemId: string
}
