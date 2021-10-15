import { Module } from '@nestjs/common'
import { StorefrontService } from './storefront.service'
import { StorefrontController } from './storefront.controller'
import { AdminStorefrontModule } from '@api/flow/flow-admin-storefront'
import { FlowStorefrontModule } from '@api/flow/flow-storefront'

@Module({
  imports: [FlowStorefrontModule, AdminStorefrontModule],
  controllers: [StorefrontController],
  providers: [StorefrontService],
})
export class StorefrontModule {}
