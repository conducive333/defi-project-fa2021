import { AdminStorefrontService } from './admin-storefront.service'
import { FlowAuthModule } from '@api/flow/flow-auth'
import { Module } from '@nestjs/common'

@Module({
  imports: [FlowAuthModule],
  providers: [AdminStorefrontService],
  exports: [AdminStorefrontService],
})
export class AdminStorefrontModule {}
