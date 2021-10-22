import { Request, Response, NextFunction } from 'express'
import { ExpressAdapter } from '@nestjs/platform-express'
import { Logger, ValidationPipe } from '@nestjs/common'
import { FlowService } from '@api/flow/flow-service'
import { LoggingFilter, LoggingInterceptor } from '@api/logger'
import { UserSession } from '@api/database'
import { ConfigService } from '@nestjs/config'
import { TypeormStore } from 'typeorm-store'
import { AppModule } from './app/app.module'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import * as session from 'express-session'
import * as compression from 'compression'
import { getConnection } from 'typeorm'
import * as passport from 'passport'
import * as helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const env = process.env['NODE' + '_ENV']
  const { httpAdapter } = app.get(HttpAdapterHost)
  const conf = app.get(ConfigService)
  const maxCookieAge = 3600000 // 1 hour in milliseconds
  const globalPrefix = 'v1'
  const sessionStore = new TypeormStore({
    repository: getConnection().getRepository(UserSession),
    clearExpired: true,
    ttl: maxCookieAge,
    expirationInterval: 86400, // clear expired sessions every 24 hours
  })
  sessionStore.clearExpiredSessions() // clear any existing expired sessions

  // Special configs
  if (env === 'staging' || env === 'production') {
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
  app.use(
    session({
      name: 'session',
      secret: conf.get<string>('MISC_COOKIE_SECRET'),
      resave: false, // TypeormStore implements the touch method, so this should be false
      saveUninitialized: false,
      unset: 'destroy',
      store: sessionStore,
      rolling: true,
      cookie: {
        path: '/',
        maxAge: maxCookieAge,
        secure: 'auto',
        httpOnly: true,
        signed: true,
        sameSite: true, // helps mitigate csrf attacks
      },
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  if (env !== 'production') {
    const swagger = await import('@nestjs/swagger')
    const config = new swagger.DocumentBuilder()
      .setTitle('CryptoCreate Client API')
      .setDescription('The CryptoCreate Client API')
      .setVersion('1.0.0-alpha')
      .addTag('API Specification')
      .build()
    const document = swagger.SwaggerModule.createDocument(app, config)
    swagger.SwaggerModule.setup('api', app, document)
  }

  FlowService.setAccessNode(conf.get<string>('FLOW_ACCESS_API'))
  const port = conf.get<string>('CLIENT_PORT')
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix)
  })
}

bootstrap()