import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { RateLimiterException } from '../exceptions/rate-limiter.exception'
import { RateLimiterService } from '../rate-limiter.service'
import { Request, Response } from 'express'
import { RateLimitStrategy } from '../enums/rate-limiter.strategies'

/**
 * This guard performs the following:
 *
 *  1.  First, a point check is performed against the **default**
 *      rate limits to ensure that the request can be completed.
 *
 *  2.  If we are within the point limit, an API point is
 *      consumed. Otherwise, we throw an error.
 *
 *  3.  If consuming this point puts us over the point limit,
 *      an error is raised. Otherwise, the guard returns true.
 *
 */
@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(private readonly rateLimiterService: RateLimiterService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const strategy = RateLimitStrategy.DEFAULT
    const req = context.switchToHttp().getRequest<Request>()
    const res = context.switchToHttp().getResponse<Response>()
    const retrySeconds = await this.rateLimiterService.getRetrySeconds(
      req.ip,
      strategy
    )
    if (retrySeconds > 0) {
      res.header('Retry-After', String(retrySeconds))
      throw new RateLimiterException()
    } else {
      await this.rateLimiterService.consume(req.ip, strategy)
    }
    return true
  }
}
