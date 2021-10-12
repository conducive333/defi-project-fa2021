import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

@Injectable()
export class GoogleLoginGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()
    const can = await super.canActivate(context)
    if (can) {
      super.logIn(req) // Triggers session storage
      return true
    }
    return false
  }
}
