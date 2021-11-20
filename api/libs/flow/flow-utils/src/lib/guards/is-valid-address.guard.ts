import { FlowService } from '../flow/flow.service'
import { Request, Response } from 'express'
import { Account } from '../types/onflow.types'
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  mixin,
} from '@nestjs/common'

export const IsValidFlowAddressGuard = (location: 'params' | 'body') =>
  mixin(IsValidFlowAddress(location))

const IsValidFlowAddress = (location: 'params' | 'body') =>
  class IsValidFlowAddressMixin implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const req = context.switchToHttp().getRequest<Request>()
      const addr = req[location]?.address
      if (addr) {
        if (new RegExp('0x[a-z0-9]{16}').test(addr)) {
          let account: Account
          try {
            account = await FlowService.getAccount(addr)
          } catch (err) {
            throw new BadRequestException('Could not verify if account exists.')
          }
          if (account) {
            const res = context.switchToHttp().getResponse<Response>()
            res.locals.flowAddress = addr
            return true
          } else {
            throw new BadRequestException('Account not found.')
          }
        } else {
          throw new BadRequestException('Invalid wallet address format.')
        }
      } else {
        throw new BadRequestException('Address is required.')
      }
    }
  }
