import { RateLimiterModule } from '@api/rate-limiter'
import { StorefrontService } from './storefront.service'
import { StorefrontController } from './storefront.controller'
import { AdminStorefrontModule } from '@api/flow/flow-admin-storefront'
import { FlowStorefrontModule } from '@api/flow/flow-storefront'
import { Module } from '@nestjs/common'

@Module({
  imports: [RateLimiterModule, FlowStorefrontModule, AdminStorefrontModule],
  controllers: [StorefrontController],
  providers: [StorefrontService],
})
export class StorefrontModule {}
