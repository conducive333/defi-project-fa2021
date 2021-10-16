import { SaleOfferAvailableEvent } from '../entity/SaleOfferAvailableEvent.entity'
import { SaleOfferCompletedEvent } from '../entity/SaleOfferCompletedEvent.entity'
import { SimpleNftTransfer } from '../entity/SimpleNftTransfer.entity'
import { BlockCursor } from '../entity/BlockCursor.entity'
import { CryptoCreateItem } from '../entity/CryptoCreateItem.entity'
import { FlowKey } from '../entity/FlowKey.entity'
import { FlowTransaction } from '../entity/FlowTransaction.entity'
import { NftEvent } from '../entity/NftEvent.entity'
import { RateLimitRecord } from '../entity/RateLimitRecord.entity'
import { User } from '../entity/User.entity'
import { UserSession } from '../entity/UserSession.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DrawingPool } from '../entity/DrawingPool.entity'
import { NftSubmission } from '../entity/NftSubmission.entity'
import { UserToDrawingPool } from '../entity/UserToDrawingPool.entity'

export const registry = [
  TypeOrmModule.forFeature([BlockCursor]),
  TypeOrmModule.forFeature([CryptoCreateItem]),
  TypeOrmModule.forFeature([DrawingPool]),
  TypeOrmModule.forFeature([FlowKey]),
  TypeOrmModule.forFeature([FlowTransaction]),
  TypeOrmModule.forFeature([NftEvent]),
  TypeOrmModule.forFeature([NftSubmission]),
  TypeOrmModule.forFeature([RateLimitRecord]),
  TypeOrmModule.forFeature([SaleOfferAvailableEvent]),
  TypeOrmModule.forFeature([SaleOfferCompletedEvent]),
  TypeOrmModule.forFeature([SimpleNftTransfer]),
  TypeOrmModule.forFeature([User]),
  TypeOrmModule.forFeature([UserSession]),
  TypeOrmModule.forFeature([UserToDrawingPool]),
]
