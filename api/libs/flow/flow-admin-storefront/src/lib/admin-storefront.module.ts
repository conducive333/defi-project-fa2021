import { AdminStorefrontService } from './admin-storefront.service'
import { FlowAccountModule } from '@api/flow/flow-utils'
import { Module } from '@nestjs/common'

@Module({
  imports: [FlowAccountModule],
  providers: [AdminStorefrontService],
  exports: [AdminStorefrontService],
})
export class AdminStorefrontModule {}
