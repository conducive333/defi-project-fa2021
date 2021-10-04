import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { FlowTransaction } from '@api/database'
import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'

@Injectable()
export class FlowTransactionService {
  public static readonly LOCK_ID = 4

  async findOne(tx: EntityManager, id: string) {
    return await tx.findOne(FlowTransaction, id)
  }

  async create(
    tx: EntityManager,
    trx: QueryDeepPartialEntity<FlowTransaction>
  ) {
    const result = await tx
      .createQueryBuilder()
      .insert()
      .into(FlowTransaction)
      .values(trx)
      .orIgnore()
      .returning('*')
      .execute()
    return result.generatedMaps[0] as FlowTransaction
  }
}
