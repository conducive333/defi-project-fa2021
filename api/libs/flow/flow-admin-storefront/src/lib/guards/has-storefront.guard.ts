import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { AdminStorefrontService } from '../admin-storefront.service'
import { Response } from 'express'

@Injectable()
export class HasAdminStorefront implements CanActivate {
  constructor(
    private readonly adminStorefrontService: AdminStorefrontService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const res = context.switchToHttp().getResponse<Response>()
    const addr = res.locals.flowAddress
    if (addr) {
      let hasStorefront = false
      try {
        hasStorefront = await this.adminStorefrontService.hasStorefront(addr)
      } catch (err) {
        console.error(err)
        throw new BadRequestException(
          'Could not verify if this account has a storefront installed.'
        )
      }
      if (hasStorefront) {
        return true
      } else {
        throw new BadRequestException(
          'This account does not have a storefront installed.'
        )
      }
    } else {
      throw new BadRequestException('Address is required.')
    }
  }
}
