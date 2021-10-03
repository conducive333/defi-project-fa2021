export type SimpleDictionary = Record<string, string>

export interface Key {
  index: number
  publicKey: string
  signAlgo: 2 | 3
  hashAlgo: 1 | 3
  weight: number
  sequenceNumber: number
  revoked: boolean
}

export interface Account {
  address: string
  balance: number
  code: string
  contracts: Record<string, string>
  keys: Key[]
}

export interface PublicAccount {
  address: string
  balance: string
  availableBalance: string
  storageUsed: number
  storageCapacity: number
  keys: Key[]
}

export interface AuthAccount {
  kind: string
  tempId: string
  addr: string
  keyId: number
  sequenceNum: string | number
  signature: unknown
  signingFunction: (data: unknown) => Promise<unknown>
  resolve: unknown
  role: {
    proposer: boolean
    authorizer: boolean
    payer: boolean
    param: boolean
  }
}

export interface User {
  address: string
  balance: number
  code: string
  contracts: Record<string, string>
  keys: Key[]
}

export interface Ping {
  tag: string
  transaction: null
  transactionStatus: null
  transactionId: null
  encodedData: null
  events: null
  account: null
  block: null
  blockHeader: null
  latestBlock: null
  collection: null
}

export interface Block {
  id: string
  parentId: string
  height: number
  timestamp: string | Date
  collectionGuarantees: unknown[]
  blockSeals: {
    blockId: string
    executionReceiptId: string
    executionReceiptSignatures: unknown[]
    resultApprovalSignatures: unknown[]
  }[]
  signatures: string[]
}

export interface BaseEvent<T> {
  type: string
  transactionId: string
  transactionIndex: number
  eventIndex: number
  data: T
}

export interface Event<T> extends BaseEvent<T> {
  blockId: string
  blockHeight: bigint
  blockTimestamp: Date
}

export interface TransactionStatus {
  status: number
  statusCode: number
  errorMessage: string
  events: BaseEvent<unknown>[]
}

export interface Field {
  name: string
  value: {
    type: string
    value: unknown
  }
}

export interface TransactionEvent extends Omit<BaseEvent<unknown>, 'data'> {
  payload: {
    type: 'Event'
    value: {
      id: string
      fields: Field[]
    }
  }
}

export interface Transaction {
  tag: string
  transaction: null
  transactionStatus: {
    status: number
    statusCode: number
    errorMessage: string
    events: TransactionEvent[]
  }
  transactionId: null
  encodedData: null
  events: null
  account: null
  block: null
  blockHeader: null
  latestBlock: null
  collection: null
}
