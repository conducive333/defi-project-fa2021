import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Request } from 'express'

@Catch()
export class LoggingFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  private formatMessage(req: Request, exception: HttpException) {
    // Sometimes generic Error objects will be passed
    // to this function instead of an HttpException.
    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : '???'
    return `${req.ip} ${req.method} ${req.originalUrl} - ${statusCode}`
  }

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    Logger.log(this.formatMessage(req, exception))
    super.catch(exception, host)
  }
}
