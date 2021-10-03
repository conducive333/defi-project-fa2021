import { FlowTypes } from '@doosan/flow/flow-service'

export interface NftMetadata extends FlowTypes.SimpleDictionary {
  mintedCardId: string
}

export interface NftType {
  uuid: number
  id: number
  metadata: NftMetadata
}
