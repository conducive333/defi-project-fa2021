import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  SaleOfferAvailableEvent,
  SaleOfferCompletedEvent,
  MintedCardEvent,
  FlowTransaction,
  MintedCard,
  MintedCardSet,
  CardSet,
  Card,
  PlayerStat,
  Player,
  BlockCursor,
  Notification,
  MintedCardSetOrder,
  User,
  MintToken,
  IpAddress,
} from '@doosan/database'
import { Module } from '@nestjs/common'
import * as path from 'path'
import * as Joi from 'joi'
import { clientConfigSchema, flowConfigSchema } from '@doosan/utils'
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
    TypeOrmModule.forFeature([SaleOfferAvailableEvent]),
    TypeOrmModule.forFeature([SaleOfferCompletedEvent]),
    TypeOrmModule.forFeature([MintedCardSetOrder]),
    TypeOrmModule.forFeature([MintedCardEvent]),
    TypeOrmModule.forFeature([FlowTransaction]),
    TypeOrmModule.forFeature([MintedCardSet]),
    TypeOrmModule.forFeature([Notification]),
    TypeOrmModule.forFeature([BlockCursor]),
    TypeOrmModule.forFeature([MintedCard]),
    TypeOrmModule.forFeature([PlayerStat]),
    TypeOrmModule.forFeature([MintToken]),
    TypeOrmModule.forFeature([IpAddress]),
    TypeOrmModule.forFeature([CardSet]),
    TypeOrmModule.forFeature([Player]),
    TypeOrmModule.forFeature([Card]),
    TypeOrmModule.forFeature([User]),
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
