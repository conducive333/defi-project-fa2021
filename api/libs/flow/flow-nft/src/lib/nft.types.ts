import { FlowTypes } from '@api/flow/flow-service'

export interface NftMetadata extends FlowTypes.SimpleDictionary {
  openSpaceItemId: string
}

export interface NftType {
  uuid: number
  id: number
  metadata: NftMetadata
}
