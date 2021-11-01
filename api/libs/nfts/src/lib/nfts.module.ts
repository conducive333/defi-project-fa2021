import { NftModule } from '@api/flow/flow-nft'
import { Module } from '@nestjs/common'
import { NftsService } from './nfts.service'

@Module({
  imports: [NftModule],
  providers: [NftsService],
  exports: [NftsService],
})
export class NftsModule {}
