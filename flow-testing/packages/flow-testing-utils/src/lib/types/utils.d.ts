export class SendScriptArgs {
  readonly script!: string
  readonly args!: unknown[]
}

export class SendTxArgs {
  readonly transaction!: string
  readonly args!: unknown[]
  readonly proposer!: unknown
  readonly authorizations!: unknown[]
  readonly payer!: unknown
}

export interface BaseEvent<T> {
  type: string
  transactionId: string
  transactionIndex: number
  eventIndex: number
  data: T
}

export interface TransactionStatus {
  status: number
  statusCode: number
  errorMessage: string
  events: BaseEvent<unknown>[]
}
