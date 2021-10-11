import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { Request, Response, NextFunction } from 'express'
import { ExpressAdapter } from '@nestjs/platform-express'
import { Logger, ValidationPipe } from '@nestjs/common'
import { FlowService } from '@api/flow/flow-service'
import { LoggingFilter, LoggingInterceptor } from '@api/logger'
import * as basicAuth from 'express-basic-auth'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app/app.module'
import * as compression from 'compression'
import * as helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const env = process.env['NODE' + '_ENV']
  const { httpAdapter } = app.get(HttpAdapterHost)
  const conf = app.get(ConfigService)
  const globalPrefix = 'v1'

  // Special configs
  if (env === 'production') {
    const express = app.getHttpAdapter().getInstance() as ExpressAdapter
    express.set('trust proxy', true)
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
    const username = conf.get<string>('MISC_DOCS_USERNAME')
    const password = conf.get<string>('MISC_DOCS_PASSWORD')
    app.use(
      ['/api', '/api-json'],
      basicAuth({
        users: {
          [username]: password,
        },
        challenge: true,
      })
    )
    const config = new swagger.DocumentBuilder()
      .setTitle('API')
      .setDescription('Specifications for DeFi Marketplace API')
      .setVersion('1.0.0-alpha')
      .addTag('API Specification')
      .build()
    const document = swagger.SwaggerModule.createDocument(app, config)
    swagger.SwaggerModule.setup('api', app, document)
  }

  FlowService.setAccessNode(conf.get<string>('FLOW_ACCESS_API'))
  const port = conf.get<string>('SERVER_PORT')
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix)
  })
}

bootstrap()
