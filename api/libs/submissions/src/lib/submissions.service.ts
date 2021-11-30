import { DrawingPool, NftSubmission, UserToDrawingPool } from '@api/database'
import { LimitOffsetOrderQueryDto } from '@api/utils'
import { getConnection, ILike } from 'typeorm'
import { FileType } from '@api/database'
import { FileService } from '@api/file'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

@Injectable()
export class SubmissionsService {
  // The PG advisory lock identifier. Transaction-level lock requests for the
  // same advisory lock identifier will block each other in the expected way.
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
        SubmissionsService.LOCK_ID,
      ])

      // Validate drawing pool
      const dp = await tx.findOne(DrawingPool, nftSubmission.drawingPoolId)
      const now = new Date()
      if (!dp) {
        throw new NotFoundException('Drawing pool not found.')
      }
      if (now < dp.releaseDate || now >= dp.endDate) {
        throw new BadRequestException('Drawing pool is not available.')
      }

      // Add the user to the drawing pool
      await tx.save(UserToDrawingPool, {
        drawingPoolId: nftSubmission.drawingPoolId,
        userId: nftSubmission.creatorId,
      })

      // Check that the user does not have a submission for this drawing pool
      const hasSubmission = await tx.findOne(NftSubmission, {
        where: {
          drawingPoolId: nftSubmission.drawingPoolId,
          creatorId: nftSubmission.creatorId,
        },
      })
      if (hasSubmission) {
        throw new BadRequestException('Already submitted to drawing pool.')
      }

      // Upload file and create submission in database
      const nftFile = await this.fileService.firebaseUpload(file, fileType)
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

      // Return drawing pool details
      return {
        ...(result.generatedMaps[0] as NftSubmission),
        file: nftFile,
      }
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
