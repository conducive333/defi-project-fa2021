import { NFTListener } from './nft.listener'
import { Module } from '@nestjs/common'
import { FlowTransactionModule } from '../transaction/transaction.module'

@Module({
  imports: [FlowTransactionModule],
  providers: [NFTListener],
  exports: [NFTListener],
})
export class NFTModule {}
