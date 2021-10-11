import { Module } from '@nestjs/common'
import { FlowStorefrontService } from './storefront.service'
import { FlowAuthModule } from '@api/flow/flow-auth'

@Module({
  imports: [FlowAuthModule],
  providers: [FlowStorefrontService],
  exports: [FlowStorefrontService],
})
export class FlowStorefrontModule {}
