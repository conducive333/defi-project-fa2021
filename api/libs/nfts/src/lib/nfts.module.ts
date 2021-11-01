import { Module } from '@nestjs/common'
import { NftsService } from './nfts.service'

@Module({
  providers: [NftsService],
  exports: [NftsService],
})
export class NftsModule {}
