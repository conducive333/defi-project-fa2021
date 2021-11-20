import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { catchError, tap } from 'rxjs/operators'
import { Observable, throwError } from 'rxjs'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private formatMessage(req: Request, startTime: number) {
    return `${req.ip} ${req.method} ${req.originalUrl} - ${
      Date.now() - startTime
    } ms`
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const request = context.switchToHttp().getRequest<Request>()
    const startTime = Date.now()
    return next.handle().pipe(
      tap(() => {
        Logger.log(this.formatMessage(request, startTime))
      })
    )
  }
}
