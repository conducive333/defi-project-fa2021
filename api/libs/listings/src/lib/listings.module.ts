import { AdminStorefrontModule } from '@api/flow/flow-admin-storefront'
import { ListingsService } from './listings.service'
import { Module } from '@nestjs/common'
import { NftsModule } from '@api/nfts'

@Module({
  imports: [AdminStorefrontModule, NftsModule],
  providers: [ListingsService],
  exports: [ListingsService],
})
export class ListingsModule {}
