import { DrawingPool, NftSubmission, UserToDrawingPool } from '@api/database'
import { LimitOffsetOrderQueryDto } from '@api/utils'
import { getConnection, ILike } from 'typeorm'
import { FileType } from '@api/database'
import { FileService } from '@api/file'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class SubmissionService {
  private static readonly LOCK_ID = 2
  constructor(private readonly fileService: FileService) {}

  isValidDrawingPool(drawingPool: DrawingPool | undefined) {
    const now = new Date()
    if (!drawingPool) {
      throw new NotFoundException('Drawing pool not found.')
    }
    if (now < drawingPool.releaseDate || now >= drawingPool.endDate) {
      throw new BadRequestException('Drawing pool is not available.')
    }
    return true
  }

  async create(
    nftSubmission: Omit<
      NftSubmission,
      'id' | 'createdAt' | 'fileId' | 'file' | 'drawingPool' | 'creator'
    >,
    file: Express.Multer.File,
    fileType: FileType
  ) {
    return await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [
        SubmissionService.LOCK_ID,
      ])
      const dp = await tx.findOne(DrawingPool, nftSubmission.drawingPoolId)
      if (this.isValidDrawingPool(dp)) {
        const userIsInPool = await tx.findOne(UserToDrawingPool, {
          where: {
            drawingPoolId: nftSubmission.drawingPoolId,
            userId: nftSubmission.creatorId,
          },
        })
        if (userIsInPool) {
          const hasSubmission = await tx.findOne(NftSubmission, {
            where: {
              drawingPoolId: nftSubmission.drawingPoolId,
              creatorId: nftSubmission.creatorId,
            },
          })
          if (!hasSubmission) {
            const nftFile = await this.fileService.firebaseUpload(
              file,
              fileType
            )
            const result = await tx
              .createQueryBuilder()
              .insert()
              .into(NftSubmission)
              .values({
                ...nftSubmission,
                fileId: nftFile.id,
              })
              .returning('*')
              .execute()
            return {
              ...(result.generatedMaps[0] as NftSubmission),
              file: nftFile,
            }
          } else {
            throw new BadRequestException('Already submitted to drawing pool.')
          }
        } else {
          throw new UnauthorizedException('Cannot submit to this drawing pool.')
        }
      }
      throw new BadRequestException('Invalid drawing pool.')
    })
  }

  async findAllForUser(userId: string, filterOpts: LimitOffsetOrderQueryDto) {
    // Apparently LIMIT 0 means NO LIMIT in SQL: https://github.com/typeorm/typeorm/issues/4883
    // This if statement makes sure we don't do an unnecessary database call.
    if (filterOpts.limit === 0) return []
    return await getConnection().transaction(async (tx) => {
      if (filterOpts.query) {
        return await tx.find(NftSubmission, {
          where: {
            creatorId: userId,
            name: ILike(`%${filterOpts.query}%`),
          },
          order: {
            createdAt: filterOpts.order,
            id: 'DESC',
          },
          relations: ['file'],
          take: filterOpts.limit,
          skip: filterOpts.offset,
        })
      } else {
        return await tx.find(NftSubmission, {
          where: {
            creatorId: userId,
          },
          order: {
            createdAt: filterOpts.order,
            id: 'DESC',
          },
          relations: ['file'],
          take: filterOpts.limit,
          skip: filterOpts.offset,
        })
      }
    })
  }

  async findOneByUser(userId: string, id: string) {
    return await getConnection().transaction(async (tx) => {
      return await tx.findOne(NftSubmission, id, {
        where: { creatorId: userId },
        relations: ['file'],
      })
    })
  }

  async findAllForDrawingPool(
    drawingPoolId: string,
    filterOpts: LimitOffsetOrderQueryDto
  ) {
    // Apparently LIMIT 0 means NO LIMIT in SQL: https://github.com/typeorm/typeorm/issues/4883
    // This if statement makes sure we don't do an unnecessary database call.
    if (filterOpts.limit === 0) return []
    return await getConnection().transaction(async (tx) => {
      if (filterOpts.query) {
        return await tx.find(NftSubmission, {
          where: {
            drawingPoolId: drawingPoolId,
            name: ILike(`%${filterOpts.query}%`),
          },
          order: {
            createdAt: filterOpts.order,
            id: 'DESC',
          },
          relations: ['file'],
          take: filterOpts.limit,
          skip: filterOpts.offset,
        })
      } else {
        return await tx.find(NftSubmission, {
          where: {
            drawingPoolId: drawingPoolId,
          },
          order: {
            createdAt: filterOpts.order,
            id: 'DESC',
          },
          relations: ['file'],
          take: filterOpts.limit,
          skip: filterOpts.offset,
        })
      }
    })
  }

  async findOne(id: string) {
    return await getConnection().transaction(async (tx) => {
      return await tx.findOne(NftSubmission, id, { relations: ['file'] })
    })
  }
}
