import { SaleOfferAvailableEvent } from '../entity/SaleOfferAvailableEvent.entity'
import { SaleOfferCompletedEvent } from '../entity/SaleOfferCompletedEvent.entity'
import { SimpleNftTransfer } from '../entity/SimpleNftTransfer.entity'
import { BlockCursor } from '../entity/BlockCursor.entity'
import { OpenSpaceItem } from '../entity/OpenSpaceItem.entity'
import { FlowKey } from '../entity/FlowKey.entity'
import { FlowTransaction } from '../entity/FlowTransaction.entity'
import { NftEvent } from '../entity/NftEvent.entity'
import { RateLimitRecord } from '../entity/RateLimitRecord.entity'
import { User } from '../entity/User.entity'
import { UserSession } from '../entity/UserSession.entity'
import { DrawingPool } from '../entity/DrawingPool.entity'
import { NftSubmission } from '../entity/NftSubmission.entity'
import { UserToDrawingPool } from '../entity/UserToDrawingPool.entity'
import { UploadedFile } from '../entity/UploadedFile.entity'

export const entities = [
  BlockCursor,
  UploadedFile,
  OpenSpaceItem,
  DrawingPool,
  FlowKey,
  FlowTransaction,
  NftEvent,
  NftSubmission,
  RateLimitRecord,
  SaleOfferAvailableEvent,
  SaleOfferCompletedEvent,
  SimpleNftTransfer,
  User,
  UserSession,
  UserToDrawingPool,
]
