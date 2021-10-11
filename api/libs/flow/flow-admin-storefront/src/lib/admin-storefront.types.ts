// TODO: fix
export interface SaleOffer {
  uuid: number
  details: {
    storefrontID: number
    purchased: boolean
    nftType: string
    nftID: number
    salePaymentVaultType: string
    salePrice: string
    saleCuts: [
      {
        receiver: {
          path: {
            type: string
            value: {
              domain: string
              identifier: string
            }
          }
          address: string
          borrowType: string
        }
        amount: string
      }
    ]
  }
}
