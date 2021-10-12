import { HttpException, HttpStatus } from '@nestjs/common'
export class RateLimiterException extends HttpException {
  constructor() {
    super('Too many requests.', HttpStatus.TOO_MANY_REQUESTS)
  }
}
