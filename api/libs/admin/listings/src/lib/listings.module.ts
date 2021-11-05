import { AdminListingsController } from './listings.controller'
import { ListingsModule } from '@api/listings'
import { Module } from '@nestjs/common'

@Module({
  imports: [ListingsModule],
  controllers: [AdminListingsController],
})
export class AdminListingsModule {}
