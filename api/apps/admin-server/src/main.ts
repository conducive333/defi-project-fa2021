import { LoggingFilter, LoggingInterceptor } from '@api/utils'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { Request, Response, NextFunction } from 'express'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app/app.module'
import * as compression from 'compression'
import * as helmet from 'helmet'
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const env = process.env['NODE' + '_ENV']
  const { httpAdapter } = app.get(HttpAdapterHost)
  const globalPrefix = 'v1'

  // Special configs
  if (env === 'staging' || env === 'production') {
    const expressAdapter = app.getHttpAdapter().getInstance() as ExpressAdapter
    expressAdapter.set('trust proxy', true)
  } else {
    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  }

  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalFilters(new LoggingFilter(httpAdapter))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  app.setGlobalPrefix(globalPrefix)
  app.use(compression())
  app.use(helmet())
  app.use(helmet.frameguard({ action: 'deny' }))
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.set('X-XSS-Protection', '1; mode=block')
    res.set('Cache-Control', 'no-store')
    next()
  })

  if (env !== 'production') {
    const swagger = await import('@nestjs/swagger')
    const config = new swagger.DocumentBuilder()
      .setTitle('Admin API')
      .setVersion('1.0.0-alpha')
      .addTag('API Specification')
      .build()
    const document = swagger.SwaggerModule.createDocument(app, config)
    swagger.SwaggerModule.setup('api', app, document)
  }
  const port = app.get(ConfigService).get<string>('ADMIN_PORT')
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix)
  })
}

bootstrap()
