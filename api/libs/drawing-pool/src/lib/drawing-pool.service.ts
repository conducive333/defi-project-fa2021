import { DrawingPool, NftSubmission } from '@api/database'
import { LimitOffsetOrderQueryDto } from '@api/utils'
import { Injectable } from '@nestjs/common'
import { getConnection, ILike } from 'typeorm'
import { CreateDrawingPoolDto } from './dto/create-drawing-pool.dto'

@Injectable()
export class DrawingPoolService {
  // TODO:
  async create(createDrawingPoolDto: CreateDrawingPoolDto) {
    return 'This action adds a new drawingPool'
  }

  async findAll(filterOpts: LimitOffsetOrderQueryDto) {
    // Apparently LIMIT 0 means NO LIMIT in SQL: https://github.com/typeorm/typeorm/issues/4883
    // This if statement makes sure we don't do an unnecessary database call.
    if (filterOpts.limit === 0) return []
    return await getConnection().transaction(async (tx) => {
      if (filterOpts.query) {
        return await tx.find(DrawingPool, {
          where: {
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
      return await tx.findOne(DrawingPool, id, { relations: ['file'] })
    })
  }
}
