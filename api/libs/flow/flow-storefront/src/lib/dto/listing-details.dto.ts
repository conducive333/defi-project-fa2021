import { ApiProperty } from '@nestjs/swagger'
import { NftMetadataDto } from './metadata.dto'
import { SaleCutsDto } from './sale-cuts.dto'

export class ListingDetailsDto {
  @ApiProperty({ type: 'integer', example: 14184069 })
  readonly storefrontID: number

  @ApiProperty({ type: 'boolean', example: false })
  readonly purchased: boolean

  @ApiProperty({
    type: 'string',
    example: 'A.543c936653c95e57.CryptoCreate.NFT',
  })
  nftType: string

  @ApiProperty({ type: 'integer', example: 75 })
  nftID: string

  @ApiProperty({
    type: 'string',
    example: 'A.7e60df042a9c0868.FlowToken.Vault',
  })
  readonly salePaymentVaultType: string

  @ApiProperty({ type: 'string', example: '10.12732000' })
  readonly salePrice: string

  @ApiProperty({ type: 'string' })
  readonly saleCuts: SaleCutsDto[]
}
