export type SaleOfferAvailableFields = [
  {
    name: 'storefrontAddress'
    value: {
      type: 'Address'
      value: string
    }
  },
  {
    name: 'saleOfferResourceID'
    value: {
      type: 'UInt64'
      value: string
    }
  },
  {
    name: 'nftType'
    value: {
      type: 'Type'
      value: {
        staticType: string
      }
    }
  },
  {
    name: 'nftID'
    value: {
      type: 'UInt64'
      value: string
    }
  },
  {
    name: 'ftVaultType'
    value: {
      type: 'Type'
      value: {
        staticType: string
      }
    }
  },
  {
    name: 'price'
    value: {
      type: 'UFix64'
      value: string
    }
  },
  {
    name: 'sftrxMeta'
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

export type SaleOfferCompletedFields = [
  {
    name: 'saleOfferResourceID'
    value: {
      type: 'UInt64'
      value: string
    }
  },
  {
    name: 'storefrontResourceID'
    value: {
      type: 'UInt64'
      value: string
    }
  },
  {
    name: 'accepted'
    value: {
      type: 'Bool'
      value: boolean
    }
  },
  {
    name: 'sftrxMeta'
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
