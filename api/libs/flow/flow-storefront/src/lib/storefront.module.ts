import { StorefrontService } from './storefront.service'
import { FlowAuthModule } from '@doosan/flow/flow-auth'
import { Module } from '@nestjs/common'

@Module({
  imports: [FlowAuthModule],
  providers: [StorefrontService],
  exports: [StorefrontService],
})
export class StorefrontModule {}
