import {
  DrawingPool,
  NftSubmission,
  NftSubmissionDto,
  User,
} from '@api/database'
import { LimitOffsetOrderQueryDto, UUIDv4Dto } from '@api/utils'
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { UserToDrawingPool } from 'libs/database/src/entity/UserToDrawingPool.entity'
import { getConnection, ILike } from 'typeorm'

@Injectable()
export class SubmissionService {
  private static readonly LOCK_ID = 2
  async create(
    nftSubmission: Omit<
      NftSubmission,
      'id' | 'createdAt' | 'drawingPool' | 'creator'
    >
  ) {
    const result = await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [
        SubmissionService.LOCK_ID,
      ])
      const dp = await tx.findOne(DrawingPool, nftSubmission.drawingPoolId)
      if (dp) {
        const now = new Date()
        if (dp.releaseDate <= now && dp.endDate > now) {
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
              return await tx
                .createQueryBuilder()
                .insert()
                .into(NftSubmissionDto)
                .values(nftSubmission)
                .returning('*')
                .execute()
            } else {
              throw new BadRequestException(
                'User already has a submission for this drawing pool.'
              )
            }
          } else {
            throw new UnauthorizedException(
              'User does not have permission to make a submission to this drawing pool.'
            )
          }
        } else {
          throw new BadRequestException('Drawing pool is not available.')
        }
      } else {
        throw new NotFoundException('Drawing pool not found.')
      }
    })
    return result.generatedMaps[0] as NftSubmission
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
          take: filterOpts.limit,
          skip: filterOpts.offset,
        })
      }
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
          take: filterOpts.limit,
          skip: filterOpts.offset,
        })
      }
    })
  }

  async findOne(id: string) {
    return await getConnection().transaction(async (tx) => {
      return await tx.findOne(NftSubmission, id)
    })
  }
}
