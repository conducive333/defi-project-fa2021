import { ConfigModule, ConfigService } from '@nestjs/config'
import { StorefrontModule } from '@api/client/storefront'
import { ClientDrawingPoolModule } from '@api/client/drawing-pool'
import { ClientSubmissionModule } from '@api/client/submission'
import { AuthModule } from '@api/client/auth'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { entities } from '@api/database'
import * as path from 'path'
import * as Joi from 'joi'
import {
  clientConfigSchema,
  flowConfigSchema,
  miscConfigSchema,
  googleConfigSchema,
  firebaseConfigSchema,
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
        path.join(env, '.env.firebase'),
      ],
      validationSchema: Joi.object({
        ...clientConfigSchema,
        ...miscConfigSchema,
        ...flowConfigSchema,
        ...googleConfigSchema,
        ...firebaseConfigSchema,
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
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
        entities: entities,
      }),
    }),
    ClientDrawingPoolModule,
    ClientSubmissionModule,
    StorefrontModule,
    AuthModule,
  ],
})
export class AppModule {}
