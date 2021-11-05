import { CollectionController } from './collection.controller'
import { RateLimiterModule } from '@api/rate-limiter'
import { NftModule } from '@api/flow/flow-nft'
import { Module } from '@nestjs/common'
import { NftsModule } from '@api/nfts'

@Module({
  imports: [RateLimiterModule, NftModule, NftsModule],
  controllers: [CollectionController],
})
export class CollectionModule {}
