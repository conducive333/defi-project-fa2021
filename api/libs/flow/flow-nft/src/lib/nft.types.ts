import { SimpleDictionary } from '@api/flow/flow-utils'

export interface NftMetadata extends SimpleDictionary {
  openSpaceItemId: string
}

export interface NftType {
  uuid: number
  id: number
  metadata: NftMetadata
}
