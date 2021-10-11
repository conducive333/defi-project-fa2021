import { Module } from '@nestjs/common'
import { FlowAdminStorefrontService } from './admin-storefront.service'
import { FlowAuthModule } from '@api/flow/flow-auth'

@Module({
  imports: [FlowAuthModule],
  providers: [FlowAdminStorefrontService],
  exports: [FlowAdminStorefrontService],
})
export class FlowAdminStorefrontModule {}
