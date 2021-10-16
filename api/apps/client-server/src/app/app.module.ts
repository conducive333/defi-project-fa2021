import { ConfigModule, ConfigService } from '@nestjs/config'
import { StorefrontModule } from '@api/client/storefront'
import { DrawingPoolModule } from '@api/client/drawing-pool'
import { SubmissionModule } from '@api/client/submission'
import { AuthModule } from '@api/client/auth'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { registry } from '@api/database'
import * as path from 'path'
import * as Joi from 'joi'
import {
  clientConfigSchema,
  flowConfigSchema,
  miscConfigSchema,
  googleConfigSchema,
} from '@api/utils'

// https://stackoverflow.com/questions/58090082/process-env-node-env-always-development-when-building-nestjs-app-with-nrwl-nx
const env = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'env',
  process.env['NODE' + '_ENV']
)

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.join(env, '.env.client'),
        path.join(env, '.env.misc'),
        path.join(env, '.env.flow'),
        path.join(env, '.env.google'),
      ],
      validationSchema: Joi.object({
        ...clientConfigSchema,
        ...miscConfigSchema,
        ...flowConfigSchema,
        ...googleConfigSchema,
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    ...registry,
    PassportModule.register({
      defaultStrategy: 'local',
      session: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('CLIENT_DB_HOST'),
        port: configService.get('CLIENT_DB_PORT'),
        username: configService.get('CLIENT_DB_USER'),
        password: configService.get('CLIENT_DB_PASS'),
        database: configService.get('CLIENT_DB_NAME'),
        autoLoadEntities: true,
      }),
    }),
    DrawingPoolModule,
    SubmissionModule,
    StorefrontModule,
    AuthModule,
  ],
})
export class AppModule {}
