import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  ServiceUnavailableException,
} from '@nestjs/common'
import { FlowService } from '@api/flow/flow-service'
import { ConfigService } from '@nestjs/config'
import { FlowKey } from '@api/database'
import { EntityManager, getConnection, LessThanOrEqual } from 'typeorm'

@Injectable()
export class FlowKeyCyclerService implements OnApplicationBootstrap {
  // The PG advisory lock identifier. Transaction-level lock requests for the
  // same advisory lock identifier will block each other in the expected way.
  private static readonly LOCK_ID = 4

  // Max number of milliseconds a key can remain in use
  private static readonly MAX_IN_USE_TIME_MS = 5 * (60 * 1000)

  constructor(private readonly configService: ConfigService) {}

  async onApplicationBootstrap() {
    const numKeys = await FlowService.countKeys(
      this.configService.get<string>('FLOW_DEV_ADDRESS')
    )
    if (numKeys <= 1) {
      Logger.error(
        '[KeyCyclerService] Developer account does not have enough keys. Some services will be unavailable.'
      )
    }
    const tableName = getConnection().getRepository(FlowKey).metadata.tableName
    await getConnection().transaction(async (tx) => {
      await tx.query(
        `
        INSERT INTO ${tableName} 
          SELECT * 
          FROM generate_series(1, $1) 
        ON CONFLICT ("id") 
        DO NOTHING`,
        [numKeys - 1] // We reserve the key at index 0 for developer use only.
      )
    })
  }

  async acquire(index?: number) {
    return await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [
        FlowKeyCyclerService.LOCK_ID,
      ])
      await this.clean(tx)
      const key = await tx.findOne(FlowKey, {
        where:
          index == null ? { isInUse: false } : { isInUse: false, id: index },
      })
      if (key) {
        await tx.update(FlowKey, key.id, { isInUse: true })
        return key.id
      } else {
        throw new ServiceUnavailableException(
          'Cannot process this request right now. Please try again at a later time.'
        )
      }
    })
  }

  async release(id: number) {
    await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [
        FlowKeyCyclerService.LOCK_ID,
      ])
      await tx.update(FlowKey, id, { isInUse: false })
      await this.clean(tx)
    })
  }

  async clean(tx: EntityManager) {
    return await tx
      .createQueryBuilder()
      .update(FlowKey)
      .where({
        isInUse: true,
        updatedAt: LessThanOrEqual(
          new Date(Date.now() - FlowKeyCyclerService.MAX_IN_USE_TIME_MS)
        ),
      })
      .set({ isInUse: false })
      .execute()
  }
}
