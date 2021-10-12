import { RateLimitStrategy } from './enums/rate-limiter.strategies'
import { RateLimiterPostgres } from 'rate-limiter-flexible'
import {
  Injectable,
  InternalServerErrorException,
  OnApplicationBootstrap,
} from '@nestjs/common'
import { getConnection } from 'typeorm'
import { RateLimitRecord } from '@api/database'

@Injectable()
export class RateLimiterService implements OnApplicationBootstrap {
  public strategies: Record<RateLimitStrategy, RateLimiterPostgres>

  private createStrategy(
    name: string,
    points: number,
    duration: number,
    blockDuration: number
  ) {
    const conn = getConnection()
    const tableName = conn.getRepository(RateLimitRecord).metadata.tableName
    const storeType = 'typeorm'
    return new RateLimiterPostgres({
      storeClient: conn,
      tableName: tableName,
      storeType: storeType,
      tableCreated: true,
      keyPrefix: name,
      points: points,
      duration: duration,
      blockDuration: blockDuration,
    })
  }

  onApplicationBootstrap() {
    this.strategies = {
      // Sending more than 100 requests in 1 minute triggers a 1 hour IP ban.
      // Points reset after 1 hour.
      [RateLimitStrategy.DEFAULT]: this.createStrategy(
        RateLimitStrategy.DEFAULT,
        100,
        60,
        60 * 60
      ),
    }
  }

  async getRemainingPoints(key: string, ...strategies: RateLimitStrategy[]) {
    const points = await Promise.all(
      strategies.map(async (strategy) => {
        const rateLimiter = this.strategies[strategy]
        const rateLimitInfo = await rateLimiter.get(key)
        return Math.max(
          0,
          rateLimiter.points -
            (rateLimitInfo ? rateLimitInfo.consumedPoints : 1)
        )
      })
    )
    return Math.min(...points)
  }

  async getRetrySeconds(key: string, strategy: RateLimitStrategy) {
    const rateLimiter = this.strategies[strategy]
    const rateLimitInfo = await rateLimiter.get(key)
    let retrySeconds = 0
    if (rateLimitInfo && rateLimitInfo.consumedPoints >= rateLimiter.points) {
      retrySeconds = Math.round(rateLimitInfo.msBeforeNext / 1000) || 1
    }
    return retrySeconds
  }

  async consume(key: string, ...strategies: RateLimitStrategy[]) {
    await Promise.all(
      strategies.map(async (strategy) => {
        const rateLimiter = this.strategies[strategy]
        try {
          // If we go over the point limit, the rate limiter library
          // will throw its own type of error. This means we need to
          // catch and distinguish between normal errors and rate
          // limiter errors.
          await rateLimiter.consume(key)
        } catch (err) {
          if (err instanceof Error) {
            throw new InternalServerErrorException()
          }
        }
      })
    )
  }

  async resetPoints(key: string, ...strategies: RateLimitStrategy[]) {
    await Promise.all(
      strategies.map(async (strategy) => {
        const rateLimiter = this.strategies[strategy]
        const rateLimitInfo = await rateLimiter.get(key)
        if (rateLimitInfo && rateLimitInfo.consumedPoints > 0) {
          await rateLimiter.delete(key)
        }
      })
    )
  }
}
