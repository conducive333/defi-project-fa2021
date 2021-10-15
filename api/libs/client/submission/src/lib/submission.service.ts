import { NftSubmission, NftSubmissionDto, User } from '@api/database'
import { LimitOffsetOrderQueryDto } from '@api/utils'
import { Injectable } from '@nestjs/common'
import { getConnection, ILike } from 'typeorm'
import { UpdateSubmissionDto } from './dto/update-submission.dto'

@Injectable()
export class SubmissionService {
  async create(
    nftSubmission: Omit<
      NftSubmission,
      'id' | 'createdAt' | 'drawingPool' | 'creator'
    >
  ) {
    const result = await getConnection().transaction(async (tx) => {
      // NOTE: using await tx.save(...) will not return
      // the ID of the inserted entity. As a result, we'll
      // need to perform another query afterwards, which
      // is inefficient. To resolve this, we need to use
      // the query builder interface and cast the result
      // before returning.
      return await tx
        .createQueryBuilder()
        .insert()
        .into(NftSubmissionDto)
        .values(nftSubmission)
        .returning('*')
        .execute()
    })
    return result.generatedMaps[0] as NftSubmission
  }

  async findAll(
    user: User,
    filterOpts: LimitOffsetOrderQueryDto
  ) {
    // Apparently LIMIT 0 means NO LIMIT in SQL: https://github.com/typeorm/typeorm/issues/4883
    // This if statement makes sure we don't do an unnecessary database call.
    if (filterOpts.limit === 0) return []
    return await getConnection().transaction(async (tx) => {
      if (filterOpts.query) {
        return await tx.find(NftSubmission, {
          where: {
            creatorId: user.id,
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
            creatorId: user.id,
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

  async findOne(user: User, id: string) {
    return await getConnection().transaction(async (tx) => {
      return await tx.findOne(NftSubmission, id, {
        where: {
          creatorId: user.id,
        },
      })
    })
  }

  async update(
    user: User,
    id: string,
    updateSubmissionDto: UpdateSubmissionDto
  ) {
    return await getConnection().transaction(async (tx) => {
      return await tx
        .createQueryBuilder()
        .setLock('pessimistic_write')
        .update(NftSubmission)
        .where({
          id: id,
          creatorId: user.id,
        })
        .set(updateSubmissionDto)
        .returning('*')
        .execute()
    })
  }

  async remove(user: User, id: string) {
    return await getConnection().transaction(async (tx) => {
      return await tx.delete(NftSubmission, {
        id: id,
        creatorId: user.id,
      })
    })
  }
}
