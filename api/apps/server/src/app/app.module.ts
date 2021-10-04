import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  SaleOfferAvailableEvent,
  SaleOfferCompletedEvent,
  SimpleNftTransfer,
  FlowTransaction,
  MarketItem,
  NftEvent,
  FlowKey,
} from '@api/database'
import { Module } from '@nestjs/common'
import * as path from 'path'
import * as Joi from 'joi'
import {
  awsConfigSchema,
  serverConfigSchema,
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
        path.join(env, '.env.server'),
        path.join(env, '.env.misc'),
        path.join(env, '.env.flow'),
        path.join(env, '.env.aws'),
      ],
      validationSchema: Joi.object({
        ...serverConfigSchema,
        ...miscConfigSchema,
        ...flowConfigSchema,
        ...awsConfigSchema,
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    TypeOrmModule.forFeature([SaleOfferAvailableEvent]),
    TypeOrmModule.forFeature([SaleOfferCompletedEvent]),
    TypeOrmModule.forFeature([SimpleNftTransfer]),
    TypeOrmModule.forFeature([FlowTransaction]),
    TypeOrmModule.forFeature([MarketItem]),
    TypeOrmModule.forFeature([NftEvent]),
    TypeOrmModule.forFeature([FlowKey]),
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
  ],
})
export class AppModule {}
