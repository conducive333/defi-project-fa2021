import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { registry } from '@api/database'
import { Module } from '@nestjs/common'
import { AuthModule } from '@api/auth'
import { UserModule } from '@api/user'
import * as path from 'path'
import * as Joi from 'joi'
import {
  serverConfigSchema,
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
        path.join(env, '.env.server'),
        path.join(env, '.env.misc'),
        path.join(env, '.env.flow'),
        path.join(env, '.env.google'),
      ],
      validationSchema: Joi.object({
        ...serverConfigSchema,
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
        host: configService.get('SERVER_DB_HOST'),
        port: configService.get('SERVER_DB_PORT'),
        username: configService.get('SERVER_DB_USER'),
        password: configService.get('SERVER_DB_PASS'),
        database: configService.get('SERVER_DB_NAME'),
        autoLoadEntities: true,
      }),
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
