import { NftService } from './nft.service'
import { FlowAuthModule } from '@api/flow/flow-auth'
import { Module } from '@nestjs/common'

@Module({
  imports: [FlowAuthModule],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
