import { ApiProperty } from '@nestjs/swagger'
import { SaleCutsDto } from './sale-cuts.dto'

export class ListingDetailsDto {
  @ApiProperty({
    type: 'integer',
    minimum: 0,
    maximum: 2 ** 64 - 1,
    example: 14184069,
  })
  readonly storefrontID: number

  @ApiProperty({ type: 'boolean', example: false })
  readonly purchased: boolean

  @ApiProperty({
    type: 'string',
    example: 'A.543c936653c95e57.CryptoCreate.NFT',
  })
  readonly nftType: string

  @ApiProperty({ type: 'integer', example: 75 })
  readonly nftID: string

  @ApiProperty({
    type: 'string',
    example: 'A.7e60df042a9c0868.FlowToken.Vault',
  })
  readonly salePaymentVaultType: string

  @ApiProperty({ type: 'string', example: '10.12732000' })
  readonly salePrice: string

  @ApiProperty({ type: SaleCutsDto, isArray: true })
  readonly saleCuts: SaleCutsDto[]
}
