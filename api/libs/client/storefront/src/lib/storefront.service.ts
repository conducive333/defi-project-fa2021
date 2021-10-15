import { AdminStorefrontService } from '@api/flow/flow-admin-storefront'
import { FlowStorefrontService } from '@api/flow/flow-storefront'
import { LimitOffsetDto } from '@api/utils'
import { Injectable } from '@nestjs/common'
import { FlowAddressAndListingIdDto } from './dto/address-and-id.dto'

@Injectable()
export class StorefrontService {
  constructor(
    private readonly adminStorefrontService: AdminStorefrontService,
    private readonly flowStorefrontService: FlowStorefrontService
  ) {}

  async getAdminListing(id: number) {
    return await this.adminStorefrontService.getSaleOffer(id)
  }

  async getAdminListings(filterOpts: LimitOffsetDto) {
    return await this.adminStorefrontService.getSaleOffers(
      filterOpts.limit,
      filterOpts.offset
    )
  }

  async getClientListing(addressAndId: FlowAddressAndListingIdDto) {
    return await this.flowStorefrontService.getSaleOffer(
      addressAndId.address,
      addressAndId.id
    )
  }

  async getClientListings(address: string, filterOpts: LimitOffsetDto) {
    return await this.flowStorefrontService.getSaleOffers(
      address,
      filterOpts.limit,
      filterOpts.offset
    )
  }
}
