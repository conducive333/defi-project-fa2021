import { FlowTypes, FlowService } from '@api/flow/flow-service'
import { BlockCursor, FlowTransaction } from '@api/database'
import { EntityManager, getConnection, In } from 'typeorm'
import * as fcl from '@onflow/fcl'

export abstract class BaseEventListener {
  // Controls how many milliseconds to wait before re-syncing with FLOW
  private readonly stepTimeMs = 1000

  // The following variable controls the MAX number of blocks to process
  // on each sync up. Any number of blocks can arrive while we wait for
  // another sync up, so sometimes our cursor will be behind and sometimes
  // it will be up to date. We don't want to process too large of a block
  // range otherwise we'll have too many events to parse. The max value
  // for this is currently 250.
  private readonly stepSize = 200

  // See the discussion here: https://discord.com/channels/613813861610684416/621847426201944074/841416577961689159
  // Basically, we can't fetch all the events up to and including the latest
  // block or we will encounter errors. To remedy this, we need to closely
  // follow the most recent block. What this means is whenever we compute the
  // height of the last block we want to process, we need to reduce its value
  // by a small amount so that we still capture a sufficient number of recent
  // events and avoid errors.
  private readonly latestBlockOffset = 1

  // Stores the FLOW-formatted version of the events passed into the constructor.
  private readonly eventNames: string[] = []

  // Controls logging frequency
  private readonly logFreq = 3600000 // 1 hour in milliseconds
  private lastLog = Number.MIN_SAFE_INTEGER

  // Child classes should use this parameter to specify the event names they
  // are interested in receiving.
  protected constructor(
    protected devAddress: string,
    protected smartContractName: string,
    events: string[]
  ) {
    if (events.length === 0) {
      throw new Error('Must specify at least one event to listen for.')
    }
    this.eventNames = events.map((event) => this.formatEvent(event))
  }

  // Child classes will receive a series of transactions
  // every `stepTimeMs` milliseconds for processing.
  abstract processTransaction(
    txInfo: FlowTransaction,
    events: FlowTypes.TransactionEvent[]
  ): Promise<void>

  private sleep = async (ms?: number) => {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  protected formatEvent = (eventName: string) => {
    return `A.${fcl.sansPrefix(this.devAddress)}.${
      this.smartContractName
    }.${eventName}`
  }

  private getLatestBlockHeight = async () => {
    return (await FlowService.getLatestBlock()).height - this.latestBlockOffset
  }

  private refreshCursor = async (cursor: BlockCursor, newHeight?: number) => {
    const height = newHeight ?? (await this.getLatestBlockHeight())
    await getConnection().transaction(async (tx) => {
      await tx.save(BlockCursor, {
        ...cursor,
        currentBlockHeight: height.toString(),
      })
    })
  }

  private incrementCursors = async (cursors: BlockCursor[], incr = 1) => {
    const currentHeight = parseInt(cursors[0].currentBlockHeight, 10)
    const latestHeight = await this.getLatestBlockHeight()
    if (currentHeight + incr < latestHeight) {
      await getConnection().transaction(async (tx) => {
        await tx
          .createQueryBuilder()
          .update(BlockCursor)
          .set({
            currentBlockHeight: () => 'current_block_height + 1',
          })
          .where('event_name IN (:...names)', { names: this.eventNames })
          .execute()
      })
    }
  }

  private insertCursors = async (tx: EntityManager, cursors: BlockCursor[]) => {
    const result = await tx
      .createQueryBuilder()
      .insert()
      .into(BlockCursor)
      .values(cursors)
      .returning('*')
      .execute()
    return result.generatedMaps as BlockCursor[]
  }

  private setupOrFetchCursors = async () => {
    return await getConnection().transaction(async (tx) => {
      const cursors = await tx.find(BlockCursor, {
        where: { eventName: In(this.eventNames) },
      })
      if (cursors.length === 0) {
        const latestBlockHeight = await this.getLatestBlockHeight()
        return await this.insertCursors(
          tx,
          this.eventNames.map((ev) => {
            return tx.create(BlockCursor, {
              eventName: ev,
              currentBlockHeight: latestBlockHeight.toString(),
            })
          })
        )
      } else if (cursors.length !== this.eventNames.length) {
        const existingEvents = new Set<String>(cursors.map((c) => c.eventName))
        const currentHeight = cursors[0].currentBlockHeight
        const newCursors: BlockCursor[] = []
        for (const ev of this.eventNames) {
          if (!existingEvents.has(ev)) {
            newCursors.push(
              tx.create(BlockCursor, {
                eventName: ev,
                currentBlockHeight: currentHeight,
              })
            )
          }
        }
        return [...cursors, ...(await this.insertCursors(tx, newCursors))]
      } else {
        return cursors
      }
    })
  }

  private getBlockRange = async (cursor: BlockCursor) => {
    const latestHeight = await this.getLatestBlockHeight()
    const fromBlock = parseInt(cursor.currentBlockHeight, 10)
    const nextBlock = fromBlock + this.stepSize
    const toBlock = Math.min(latestHeight, nextBlock)
    if (Date.now() - this.lastLog > this.logFreq) {
      const timestamp = new Date().toISOString()
      const eventLengths = Math.max(...this.eventNames.map((s) => s.length))
      const padding = timestamp.length + eventLengths
      process.stdout.write(
        '[' + `${timestamp}, ${cursor.eventName}`.padEnd(padding + 2) + ']: '
      )
      console.log(
        `fromBlock=${fromBlock} toBlock=${toBlock} latestBlockHeight=${latestHeight}`
      )
      this.lastLog = Date.now()
    }
    return { fromBlock, toBlock }
  }

  private run = async (cb: () => void) => {
    return new Promise((_, reject) => {
      const poll = async () => {
        const cursors = await this.setupOrFetchCursors()
        try {
          await Promise.all(
            cursors.map(async (cursor) => {
              const { fromBlock, toBlock } = await this.getBlockRange(cursor)
              if (fromBlock <= toBlock) {
                // Get events
                const events = await fcl.decode(
                  await fcl.send([
                    fcl.getEventsAtBlockHeightRange(
                      cursor.eventName,
                      fromBlock,
                      toBlock
                    ),
                  ])
                )

                // Re-format events for easier processing
                const trxMap = new Map<string, FlowTransaction>()
                events.forEach((e: FlowTypes.Event<unknown>) => {
                  if (!trxMap.has(e.transactionId)) {
                    trxMap[e.transactionId] = {
                      id: e.transactionId,
                      blockId: e.blockId,
                      blockHeight: e.blockHeight.toString(),
                      blockTimestamp: e.blockTimestamp,
                    }
                  }
                })

                // Run processing function
                await Promise.all(
                  Object.keys(trxMap).map(async (tid: string) => {
                    const transaction = await FlowService.getTransaction(tid)
                    const events = transaction.transactionStatus.events
                    await this.processTransaction(trxMap[tid], events)
                  })
                )

                // If processing was successful, increment the cursor
                this.refreshCursor(cursor, toBlock)
              }
            })
          ).then(() => {
            cb()
            setTimeout(poll, this.stepTimeMs)
          })
        } catch (err) {
          await this.sleep(150) // Waiting a little bit here allows for more readable error messages
          reject(`Error retrieving block range: ${err.toString()}`)
        }
      }
      poll()
    })
  }

  /**
   *
   * Listens for smart contract events.
   *
   * @param maxRetries The max number of times to re-process a block range that threw an error.
   * @param retryMillis The number of seconds to wait before retrying an operation when an error occurs.
   */
  public listen = async (maxRetries = 5, retryMillis = 5000) => {
    let currentRetries = maxRetries
    const relisten = async () => {
      if (currentRetries === 0) {
        // If we run out of retries for re-processing a block range AND
        // incrementing our cursors by 1 doesn't put us over the latest
        // block height, then we increment the current cursor height by
        // 1 and try again.
        console.log('Number of retries exhausted. Refreshing cursors...')
        let retry = true
        while (retry) {
          try {
            const cursors = await this.setupOrFetchCursors()
            await this.incrementCursors(cursors)
            retry = false
          } catch (err) {
            console.error('Could not refresh cursors:\n', err.toString())
            await this.sleep(retryMillis)
          }
        }
        currentRetries = maxRetries
        relisten()
      } else {
        // If we have enough attempts, we process the block range and all
        // events within the range. If an error occurs while processing,
        // we wait a bit before attempting to re-process the same range.
        try {
          await this.run(() => (currentRetries = maxRetries))
        } catch (err) {
          currentRetries -= 1
          console.error(err)
          console.log(`Number of retries: ${currentRetries}`)
          if (currentRetries !== 0) {
            console.log(`Restarting in ${retryMillis / 1000} second(s)...\n`)
            setTimeout(relisten, retryMillis)
          } else {
            relisten()
          }
        }
      }
    }
    relisten()
  }
}
