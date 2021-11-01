import { FlowStorefrontModule } from '@api/flow/flow-storefront'
import { ClientListingsController } from './listings.controller'
import { RateLimiterModule } from '@api/rate-limiter'
import { Module } from '@nestjs/common'
import { ListingsModule } from '@api/listings'

@Module({
  imports: [RateLimiterModule, FlowStorefrontModule, ListingsModule],
  controllers: [ClientListingsController],
})
export class ClientListingsModule {}
