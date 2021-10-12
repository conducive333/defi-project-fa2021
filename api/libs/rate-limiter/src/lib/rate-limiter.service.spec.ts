import { RateLimiterService } from './rate-limiter.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { dbConfigSchema } from '@api/utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getConnection } from 'typeorm'
import * as path from 'path'
import * as Joi from 'joi'

const env = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'env',
  process.env.NODE_ENV
)

// TODO:
describe('RateLimiterService', () => {
  let service: RateLimiterService
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [path.join(env, '.env.db')],
          validationSchema: Joi.object({
            ...dbConfigSchema,
          }),
          validationOptions: {
            abortEarly: true,
          },
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USER'),
            password: configService.get('DB_PASS'),
            database: configService.get('DB_NAME'),
            autoLoadEntities: true,
          }),
        }),
        RateLimiterService,
      ],
    }).compile()
    service = module.get<RateLimiterService>(RateLimiterService)
  })

  afterAll(async () => {
    await module.close()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
