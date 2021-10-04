import { FlowTypes } from '@api/flow/flow-service'

export interface TokenFeesData {
  amount: number
}
export type TokenFeesEvent = FlowTypes.BaseEvent<TokenFeesData>
