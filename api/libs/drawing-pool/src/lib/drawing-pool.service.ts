import {
  DrawingPool,
  FileType,
  NftSubmission,
  User,
  UserToDrawingPool,
} from '@api/database'
import { FileService } from '@api/file'
import { LimitOffsetOrderQueryDto } from '@api/utils'
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { EntityManager, FindConditions, getConnection, ILike } from 'typeorm'
import { CreateEmptyDrawingPoolDto } from './dto/create-empty-drawing-pool.dto'

@Injectable()
export class DrawingPoolService {
  // The PG advisory lock identifier. Transaction-level lock requests for the
  // same advisory lock identifier will block each other in the expected way.
  private static readonly LOCK_ID = 3

  constructor(private readonly fileService: FileService) {}

  async create(
    createDrawingPoolDto: CreateEmptyDrawingPoolDto,
    file: Express.Multer.File,
    filetype: FileType,
    size = 0
  ) {
    if (createDrawingPoolDto.releaseDate < new Date()) {
      throw new BadRequestException('releaseDate must be in the future')
    }
    if (createDrawingPoolDto.releaseDate > createDrawingPoolDto.endDate) {
      throw new BadRequestException('endDate must be a time after releaseDate')
    }
    return await getConnection().transaction(async (tx) => {
      const drawingPoolFile = await this.fileService.firebaseUpload(
        file,
        filetype
      )
      const result = await tx
        .createQueryBuilder()
        .insert()
        .into(DrawingPool)
        .values({
          ...createDrawingPoolDto,
          fileId: drawingPoolFile.id,
        })
        .returning('*')
        .execute()
      const drawingPool = result.generatedMaps[0] as DrawingPool
      if (size !== 0) {
        await this.addRandomUsersToPool(
          tx,
          drawingPool.id,
          size
        )
      }
      return {
        ...drawingPool,
        file: drawingPoolFile,
      }
    })
  }

  async addRandomUsersToPool(
    tx: EntityManager,
    drawingPoolId: string,
    poolSize: number
  ) {
    const userTable = tx.getRepository(User).metadata.tableName
    return await tx
      .createQueryBuilder()
      .insert()
      .into(UserToDrawingPool)
      .values({
        user: () =>
          `(SELECT "${userTable}".id FROM "${userTable}" ORDER BY RANDOM() LIMIT :limit)`,
        drawingPoolId: drawingPoolId,
      })
      .setParameter('limit', poolSize)
      .execute()
  }

  async findAll(
    filterOpts: LimitOffsetOrderQueryDto,
    whereOpts: FindConditions<DrawingPool> = {}
  ) {
    // Apparently LIMIT 0 means NO LIMIT in SQL: https://github.com/typeorm/typeorm/issues/4883
    // This if statement makes sure we don't do an unnecessary database call.
    if (filterOpts.limit === 0) return []
    return await getConnection().transaction(async (tx) => {
      if (filterOpts.query) {
        return await tx.find(DrawingPool, {
          where: {
            ...whereOpts,
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
        return await tx.find(DrawingPool, {
          where: {
            ...whereOpts,
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

  async findOne(id: string, whereOpts: FindConditions<DrawingPool> = {}) {
    return await getConnection().transaction(async (tx) => {
      return await tx.findOne(DrawingPool, id, {
        where: whereOpts,
        relations: ['file'],
      })
    })
  }

  async remove(id: string) {
    return await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [
        DrawingPoolService.LOCK_ID,
      ])

      // Double check that the pool can be deleted
      const drawingPool = await tx.findOne(DrawingPool, id)
      const now = new Date()
      if (!drawingPool) {
        throw new NotFoundException('Drawing pool not found.')
      }
      if (now >= drawingPool.releaseDate) {
        throw new BadRequestException('Drawing pool has already started.')
      }

      // Double check that the pool has no submissions
      const submissionCount = await tx.count(NftSubmission, {
        where: { drawingPoolId: id },
      })
      if (submissionCount > 0) {
        throw new BadRequestException('Drawing pool has submissions.')
      }

      // Double check that the pool has no users
      const userCount = await tx.count(UserToDrawingPool, {
        where: { drawingPoolId: id },
      })
      if (userCount > 0) {
        throw new BadRequestException('Drawing pool has users.')
      }

      // Delete the pool!
      await this.fileService.firebaseRemove(drawingPool.fileId)
      await tx.delete(DrawingPool, drawingPool)
      return drawingPool
    })
  }

  async appendUser(drawingPoolId: string, userId: string) {
    return await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [
        DrawingPoolService.LOCK_ID,
      ])

      // Double check that users can be added to this pool
      const drawingPool = await tx.findOne(DrawingPool, drawingPoolId)
      const now = new Date()
      if (!drawingPool) {
        throw new NotFoundException('Drawing pool not found.')
      }
      if (now >= drawingPool.endDate) {
        throw new BadRequestException('Drawing pool has already ended.')
      }

      // Check that the user exists
      const user = await tx.findOne(User, userId)
      if (!user) {
        throw new NotFoundException('User not found.')
      }

      // Double check that the user is not in the drawing pool already
      const userInPool = await tx.findOne(UserToDrawingPool, {
        where: {
          userId,
          drawingPoolId,
        },
      })
      if (userInPool) {
        throw new BadRequestException('User is already in drawing pool.')
      } else {
        const result = await tx
          .createQueryBuilder()
          .insert()
          .into(UserToDrawingPool)
          .values({
            userId,
            drawingPoolId,
          })
          .returning('*')
          .execute()
        return result.generatedMaps[0] as UserToDrawingPool
      }
    })
  }

  async removeUser(drawingPoolId: string, userId: string) {
    return await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [
        DrawingPoolService.LOCK_ID,
      ])

      // Double check that users can be removed from this pool
      const drawingPool = await tx.findOne(DrawingPool, drawingPoolId)
      const now = new Date()
      if (!drawingPool) {
        throw new NotFoundException('Drawing pool not found.')
      }
      if (now >= drawingPool.releaseDate) {
        throw new BadRequestException('Drawing pool has already started.')
      }

      // Check that the user exists
      const user = await tx.findOne(User, userId)
      if (!user) {
        throw new NotFoundException('User not found.')
      }

      // Double check that the user is in the drawing pool
      const userInPool = await tx.findOne(UserToDrawingPool, {
        where: {
          userId,
          drawingPoolId,
        },
      })
      if (!userInPool) {
        throw new BadRequestException('User is not in drawing pool.')
      } else {
        await tx.delete(UserToDrawingPool, userInPool)
        return userInPool
      }
    })
  }
}
