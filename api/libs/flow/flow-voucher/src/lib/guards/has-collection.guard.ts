import { NftService } from '../nft.service'
import { Response } from 'express'
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'

@Injectable()
export class HasCollectionGuard implements CanActivate {
  constructor(private readonly nftService: NftService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const res = context.switchToHttp().getResponse<Response>()
    const addr = res.locals.flowAddress
    if (addr) {
      let hasCollection = false
      try {
        hasCollection = await this.nftService.hasCollection(addr)
      } catch (err) {
        console.error(err)
        throw new BadRequestException(
          'Could not verify if account has a collection installed.'
        )
      }
      if (hasCollection) {
        return true
      } else {
        throw new BadRequestException(
          'This account does not have a collection installed.'
        )
      }
    } else {
      throw new BadRequestException('Address is required.')
    }
  }
}
