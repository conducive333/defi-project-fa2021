import { Controller, Get, Param } from '@nestjs/common'
import { MarketService } from './market.service'

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  getAdminListings() {
    return this.marketService.findAll()
  }

  @Get(':id')
  getAdminListing(@Param('id') id: string) {
    return this.marketService.findOne(+id)
  }

  @Get('user/:address')
  getUserListings(@Param('address') id: string) {
    return this.marketService.findOne(+id)
  }

  @Get('user/:address/listings/:id')
  getUserListing(@Param('id') id: string) {
    return this.marketService.findOne(+id)
  }
}
