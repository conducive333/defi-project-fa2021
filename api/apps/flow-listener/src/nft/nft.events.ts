export type DepositFields = [
  {
    name: 'id'
    value: {
      type: string
      value: string
    }
  },
  {
    name: 'to'
    value: {
      type: 'Optional'
      value: {
        type: 'Address'
        value: string
      }
    }
  }
]

export type WithdrawFields = [
  {
    name: 'id'
    value: {
      type: string
      value: string
    }
  },
  {
    name: 'from'
    value: {
      type: 'Optional'
      value: {
        type: 'Address'
        value: string
      }
    }
  }
]

export type MintedFields = [
  {
    name: 'id'
    value: {
      type: 'UInt64'
      value: string
    }
  },
  {
    name: 'initMeta'
    value: {
      type: 'Dictionary'
      value: {
        key: {
          type: 'String'
          value: string
        }
        value: {
          type: 'String'
          value: string
        }
      }[]
    }
  }
]
