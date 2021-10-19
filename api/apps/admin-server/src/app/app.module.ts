import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { entities } from '@api/database'
import { Module } from '@nestjs/common'
import * as path from 'path'
import * as Joi from 'joi'
import {
  adminConfigSchema,
  firebaseConfigSchema,
  flowConfigSchema,
  miscConfigSchema,
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
        path.join(env, '.env.admin'),
        path.join(env, '.env.misc'),
        path.join(env, '.env.flow'),
        path.join(env, '.env.firebase'),
      ],
      validationSchema: Joi.object({
        ...adminConfigSchema,
        ...miscConfigSchema,
        ...flowConfigSchema,
        ...firebaseConfigSchema,
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
        host: configService.get('ADMIN_DB_HOST'),
        port: configService.get('ADMIN_DB_PORT'),
        username: configService.get('ADMIN_DB_USER'),
        password: configService.get('ADMIN_DB_PASS'),
        database: configService.get('ADMIN_DB_NAME'),
        entities: entities,
      }),
    }),
  ],
})
export class AppModule {}
