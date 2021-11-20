import { ClientListingsController } from './listings.controller'
import { RateLimiterModule } from '@api/rate-limiter'
import { Module } from '@nestjs/common'
import { ListingsModule } from '@api/listings'

@Module({
  imports: [RateLimiterModule, ListingsModule],
  controllers: [ClientListingsController],
})
export class ClientListingsModule {}
