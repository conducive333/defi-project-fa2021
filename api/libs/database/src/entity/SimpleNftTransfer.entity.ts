import { ViewColumn, ViewEntity } from 'typeorm'

/**
 *
 * Transactions can have a pretty complex sequence of events.
 * To keep things simple, we only consider the subset of events
 * that consist of exactly one NFT withdraw and exactly one NFT
 * deposit.
 */
@ViewEntity({
  name: 'simple_nft_transfer',
  expression: `
    WITH simple_event AS (
      SELECT * FROM nft_event WHERE flow_transaction_id IN (
        SELECT flow_transaction_id
        FROM nft_event
        WHERE event_type != 'Minted'
        GROUP BY flow_transaction_id
        HAVING COUNT(DISTINCT event_type) = 2 and COUNT(event_type) = 2
      )
    ), simple_withdraw AS (
      SELECT * FROM simple_event WHERE event_type = 'Withdraw'
    ), simple_deposit AS (
      SELECT * FROM simple_event WHERE event_type = 'Deposit'
    )
    SELECT
      history.*, 
      mint_event.market_item_id AS market_item_id
    FROM (
      SELECT
        simple_withdraw.created_at AS created_at,
        simple_withdraw.nft_id AS nft_id,
        simple_withdraw.address AS sender,
        simple_deposit.address AS receiver,
        simple_withdraw.flow_transaction_id AS flow_transaction_id
      FROM simple_withdraw
      INNER JOIN simple_deposit
      ON simple_withdraw.flow_transaction_id = simple_deposit.flow_transaction_id
    ) AS history
    INNER JOIN (
      SELECT
        nft_event.market_item_id, 
        nft_event.nft_id 
      FROM nft_event
      WHERE nft_id IS NOT NULL
    ) AS mint_event ON history.nft_id = mint_event.nft_id
    INNER JOIN market_item ON market_item.id = mint_event.market_item_id
  `,
})
export class SimpleMintedCardTransfer {
  @ViewColumn({ name: 'flow_transaction_id' })
  flowTransactionId: string

  @ViewColumn({ name: 'created_at' })
  createdAt: Date

  @ViewColumn({ name: 'nft_id' })
  nftId: string

  @ViewColumn({ name: 'sender' })
  sender: string

  @ViewColumn({ name: 'receiver' })
  receiver: string

  @ViewColumn({ name: 'market_item_id' })
  marketItemId: string
}
