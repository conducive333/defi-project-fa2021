import { MigrationInterface, QueryRunner } from 'typeorm'

export class createTables1627860201306 implements MigrationInterface {
  name = 'createTables1627860201306'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "block_cursor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_name" text NOT NULL, "current_block_height" bigint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f60e689896bdc102ac4b99cd340" UNIQUE ("event_name"), CONSTRAINT "PK_dacaf004fee2c87d0a37278335f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "flow_key" ("id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_in_use" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_4ddc07d5b7cabacb45ce362492e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "sale_offer_completed_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sale_offer_resource_id" text NOT NULL, "storefront_resource_id" text NOT NULL, "accepted" boolean NOT NULL, "flow_transaction_id" text NOT NULL, CONSTRAINT "PK_94dd279f02214e1dc5309d2225a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "sale_offer_available_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "storefront_address" text NOT NULL, "sale_offer_resource_id" text NOT NULL, "nft_type" text NOT NULL, "market_item_id" uuid NOT NULL, "ft_vault_type" text NOT NULL, "price" text NOT NULL, "flow_transaction_id" text NOT NULL, "sale_offer_completed_event_id" uuid, CONSTRAINT "REL_ac8f7d13a7a8bcb353c9c30ff3" UNIQUE ("sale_offer_completed_event_id"), CONSTRAINT "PK_200331bbf4b22bfaf1cbbdfc702" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "market_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text NOT NULL, "image" text NOT NULL, CONSTRAINT "PK_fc9f91dbb8a0d0675d00d292471" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "nft_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "event_type" character varying NOT NULL, "event_index" integer NOT NULL, "nft_id" text NOT NULL, "address" text, "flow_transaction_id" text NOT NULL, "market_item_id" uuid, CONSTRAINT "UQ_dc631fff112fd18993e6ad46cd9" UNIQUE ("market_item_id", "nft_id"), CONSTRAINT "UQ_00660c1e2c7c906ff6ecddb9d46" UNIQUE ("market_item_id"), CONSTRAINT "PK_eca59e3d53ba2009252626e64d9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "flow_transaction" ("transaction_id" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "block_id" text NOT NULL, "block_height" bigint NOT NULL, "block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_9a52fae35f8449be77e1b097f35" PRIMARY KEY ("transaction_id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_completed_event" ADD CONSTRAINT "FK_2c2aa3e529ba62642013768237c" FOREIGN KEY ("flow_transaction_id") REFERENCES "flow_transaction"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" ADD CONSTRAINT "FK_6d0def4683db207b62a0f18a3ea" FOREIGN KEY ("market_item_id") REFERENCES "market_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" ADD CONSTRAINT "FK_7d03bdadb06cc2d68313fbf893e" FOREIGN KEY ("flow_transaction_id") REFERENCES "flow_transaction"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" ADD CONSTRAINT "FK_ac8f7d13a7a8bcb353c9c30ff3a" FOREIGN KEY ("sale_offer_completed_event_id") REFERENCES "sale_offer_completed_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_event" ADD CONSTRAINT "FK_fe471d2f439fa69a7f9acbf0655" FOREIGN KEY ("flow_transaction_id") REFERENCES "flow_transaction"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_event" ADD CONSTRAINT "FK_00660c1e2c7c906ff6ecddb9d46" FOREIGN KEY ("market_item_id") REFERENCES "market_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`CREATE VIEW "simple_nft_transfer" AS 
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
`)
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
      [
        'VIEW',
        'public',
        'simple_nft_transfer',
        "WITH simple_event AS (\n      SELECT * FROM nft_event WHERE flow_transaction_id IN (\n        SELECT flow_transaction_id\n        FROM nft_event\n        WHERE event_type != 'Minted'\n        GROUP BY flow_transaction_id\n        HAVING COUNT(DISTINCT event_type) = 2 and COUNT(event_type) = 2\n      )\n    ), simple_withdraw AS (\n      SELECT * FROM simple_event WHERE event_type = 'Withdraw'\n    ), simple_deposit AS (\n      SELECT * FROM simple_event WHERE event_type = 'Deposit'\n    )\n    SELECT\n      history.*, \n      mint_event.market_item_id AS market_item_id\n    FROM (\n      SELECT\n        simple_withdraw.created_at AS created_at,\n        simple_withdraw.nft_id AS nft_id,\n        simple_withdraw.address AS sender,\n        simple_deposit.address AS receiver,\n        simple_withdraw.flow_transaction_id AS flow_transaction_id\n      FROM simple_withdraw\n      INNER JOIN simple_deposit\n      ON simple_withdraw.flow_transaction_id = simple_deposit.flow_transaction_id\n    ) AS history\n    INNER JOIN (\n      SELECT\n        nft_event.market_item_id, \n        nft_event.nft_id \n      FROM nft_event\n      WHERE nft_id IS NOT NULL\n    ) AS mint_event ON history.nft_id = mint_event.nft_id\n    INNER JOIN market_item ON market_item.id = mint_event.market_item_id",
      ]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "schema" = $2 AND "name" = $3`,
      ['VIEW', 'public', 'simple_nft_transfer']
    )
    await queryRunner.query(`DROP VIEW "simple_nft_transfer"`)
    await queryRunner.query(
      `ALTER TABLE "nft_event" DROP CONSTRAINT "FK_00660c1e2c7c906ff6ecddb9d46"`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_event" DROP CONSTRAINT "FK_fe471d2f439fa69a7f9acbf0655"`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" DROP CONSTRAINT "FK_ac8f7d13a7a8bcb353c9c30ff3a"`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" DROP CONSTRAINT "FK_7d03bdadb06cc2d68313fbf893e"`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" DROP CONSTRAINT "FK_6d0def4683db207b62a0f18a3ea"`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_completed_event" DROP CONSTRAINT "FK_2c2aa3e529ba62642013768237c"`
    )
    await queryRunner.query(`DROP TABLE "flow_transaction"`)
    await queryRunner.query(`DROP TABLE "nft_event"`)
    await queryRunner.query(`DROP TABLE "market_item"`)
    await queryRunner.query(`DROP TABLE "sale_offer_available_event"`)
    await queryRunner.query(`DROP TABLE "sale_offer_completed_event"`)
    await queryRunner.query(`DROP TABLE "flow_key"`)
    await queryRunner.query(`DROP TABLE "block_cursor"`)
  }
}
