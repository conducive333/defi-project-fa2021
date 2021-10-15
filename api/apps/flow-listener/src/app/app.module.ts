import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { registry } from '@api/database'
import { Module } from '@nestjs/common'
import * as path from 'path'
import * as Joi from 'joi'
import { clientConfigSchema, flowConfigSchema } from '@api/utils'
import { NFTModule } from '../nft/nft.module'
import { StorefrontModule } from '../storefront/storefront.module'

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
      envFilePath: [path.join(env, '.env.client'), path.join(env, '.env.flow')],
      validationSchema: Joi.object({
        ...clientConfigSchema,
        ...flowConfigSchema,
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    ...registry,
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
    NFTModule,
    StorefrontModule,
  ],
})
export class AppModule {}
