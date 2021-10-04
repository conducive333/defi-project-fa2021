import { FlowTypes } from '@api/flow/flow-service'

export interface TokensWithdrawnData {
  amount: number
  from: string
}
export type TokensWithdrawnEvent = FlowTypes.BaseEvent<TokensWithdrawnData>

export interface TokensDepositedData {
  amount: number
  to: string
}
export type TokensDepositedEvent = FlowTypes.BaseEvent<TokensDepositedData>
