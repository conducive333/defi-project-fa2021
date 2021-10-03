import { FlowTransactionModule } from '../transaction/transaction.module'
import { StorefrontListener } from './storefront.listener'
import { Module } from '@nestjs/common'

@Module({
  imports: [FlowTransactionModule],
  providers: [StorefrontListener],
  exports: [StorefrontListener],
})
export class StorefrontModule {}
