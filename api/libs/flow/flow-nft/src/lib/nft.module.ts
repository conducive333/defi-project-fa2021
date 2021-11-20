import { FlowAccountModule } from '@api/flow/flow-utils'
import { NftService } from './nft.service'
import { Module } from '@nestjs/common'

@Module({
  imports: [FlowAccountModule],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
