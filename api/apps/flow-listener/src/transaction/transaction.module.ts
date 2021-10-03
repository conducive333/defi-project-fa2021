import { FlowTransactionService } from './transaction.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [FlowTransactionService],
  exports: [FlowTransactionService],
})
export class FlowTransactionModule {}
