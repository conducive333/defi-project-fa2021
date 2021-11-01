import { Injectable, NotFoundException } from '@nestjs/common'
import { LimitOffsetOrderQueryDto } from '@api/utils'
import { FindConditions, getConnection, ILike } from 'typeorm'
import { NftSubmission, OpenSpaceItem } from '@api/database'

@Injectable()
export class NftsService {
  // The PG advisory lock identifier. Transaction-level lock requests for the
  // same advisory lock identifier will block each other in the expected way.
  private static readonly LOCK_ID = 5

  async create(nftSubmissionId: string) {
    return await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [NftsService.LOCK_ID])
      const item = await tx.findOne(OpenSpaceItem, {
        where: {
          nftSubmissionId: nftSubmissionId,
        },
        relations: ['nftSubmission', 'nftSubmission.file'],
      })
      if (!item) {
        const submission = await tx.findOne(NftSubmission, nftSubmissionId)
        if (submission) {
          const result = await tx
            .createQueryBuilder()
            .insert()
            .into(OpenSpaceItem)
            .values({ nftSubmissionId })
            .returning('*')
            .execute()
          return {
            ...(result.generatedMaps[0] as OpenSpaceItem),
            nftSubmission: submission,
          } as OpenSpaceItem
        }
        throw new NotFoundException('NFT submission does not exist.')
      } else {
        return item
      }
    })
  }

  async findAll(
    filterOpts: LimitOffsetOrderQueryDto,
    whereOpts: FindConditions<OpenSpaceItem> = {}
  ) {
    // Apparently LIMIT 0 means NO LIMIT in SQL: https://github.com/typeorm/typeorm/issues/4883
    // This if statement makes sure we don't do an unnecessary database call.
    if (filterOpts.limit === 0) return []
    return await getConnection().transaction(async (tx) => {
      if (filterOpts.query) {
        return await tx.find(OpenSpaceItem, {
          where: {
            ...whereOpts,
            name: ILike(`%${filterOpts.query}%`),
          },
          order: {
            createdAt: filterOpts.order,
            id: 'DESC',
          },
          relations: ['nftSubmission', 'nftSubmission.file'],
          take: filterOpts.limit,
          skip: filterOpts.offset,
        })
      } else {
        return await tx.find(OpenSpaceItem, {
          where: whereOpts,
          order: {
            createdAt: filterOpts.order,
            id: 'DESC',
          },
          relations: ['nftSubmission', 'nftSubmission.file'],
          take: filterOpts.limit,
          skip: filterOpts.offset,
        })
      }
    })
  }

  async findOne(id: string) {
    return await getConnection().transaction(async (tx) => {
      return await tx.findOne(OpenSpaceItem, id, {
        relations: ['nftSubmission', 'nftSubmission.file'],
      })
    })
  }

  async remove<T>(id: string, cb: (nft: OpenSpaceItem) => Promise<T>) {
    return await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [NftsService.LOCK_ID])
      const item = await tx.findOne(OpenSpaceItem, id, {
        relations: ['nftSubmission', 'nftSubmission.file'],
      })
      if (item) {
        await tx.delete(OpenSpaceItem, id)
        return await cb(item)
      }
      return item
    })
  }
}
