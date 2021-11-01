import { OpenSpaceItem } from '../entity/OpenSpaceItem.entity'
import { FlowKey } from '../entity/FlowKey.entity'
import { RateLimitRecord } from '../entity/RateLimitRecord.entity'
import { User } from '../entity/User.entity'
import { UserSession } from '../entity/UserSession.entity'
import { DrawingPool } from '../entity/DrawingPool.entity'
import { NftSubmission } from '../entity/NftSubmission.entity'
import { UserToDrawingPool } from '../entity/UserToDrawingPool.entity'
import { UploadedFile } from '../entity/UploadedFile.entity'

export const entities = [
  UploadedFile,
  OpenSpaceItem,
  DrawingPool,
  FlowKey,
  NftSubmission,
  RateLimitRecord,
  User,
  UserSession,
  UserToDrawingPool,
]
