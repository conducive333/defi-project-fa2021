import { MigrationInterface, QueryRunner } from 'typeorm'

export class createTables1627860201306 implements MigrationInterface {
  name = 'createTables1627860201306'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "block_cursor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_name" text NOT NULL, "current_block_height" bigint NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_f60e689896bdc102ac4b99cd340" UNIQUE ("event_name"), CONSTRAINT "PK_dacaf004fee2c87d0a37278335f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "nft_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "event_type" character varying NOT NULL, "event_index" integer NOT NULL, "nft_id" text NOT NULL, "address" text, "flow_transaction_id" text NOT NULL, "crypto_create_item_id" uuid, CONSTRAINT "UQ_33b9cf93128e10b6aaf6c1233a0" UNIQUE ("crypto_create_item_id", "nft_id"), CONSTRAINT "UQ_fdc00bbf2f45a99b9a25f238b85" UNIQUE ("crypto_create_item_id"), CONSTRAINT "PK_eca59e3d53ba2009252626e64d9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "flow_transaction" ("transaction_id" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "block_id" text NOT NULL, "block_height" bigint NOT NULL, "block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_9a52fae35f8449be77e1b097f35" PRIMARY KEY ("transaction_id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "sale_offer_completed_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sale_offer_resource_id" text NOT NULL, "storefront_resource_id" text NOT NULL, "accepted" boolean NOT NULL, "flow_transaction_id" text NOT NULL, CONSTRAINT "PK_94dd279f02214e1dc5309d2225a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "sale_offer_available_event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "storefront_address" text NOT NULL, "sale_offer_resource_id" text NOT NULL, "nft_type" text NOT NULL, "crypto_create_item_id" uuid NOT NULL, "ft_vault_type" text NOT NULL, "price" text NOT NULL, "flow_transaction_id" text NOT NULL, "sale_offer_completed_event_id" uuid, CONSTRAINT "REL_ac8f7d13a7a8bcb353c9c30ff3" UNIQUE ("sale_offer_completed_event_id"), CONSTRAINT "PK_200331bbf4b22bfaf1cbbdfc702" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "crypto_create_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text NOT NULL, "image" text NOT NULL, CONSTRAINT "PK_8d0ebf4b6fc9cbcdc71d68de18f" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" text NOT NULL, "username" text NOT NULL, "drawing_pool_id" uuid, "drawingPoolId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "nft_submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text NOT NULL, "image" text NOT NULL, "address" text NOT NULL, "drawing_pool_id" uuid NOT NULL, "creator_id" uuid NOT NULL, "drawingPoolId" uuid, "creatorId" text, CONSTRAINT "CHK_906599a110828be59b8bba5930" CHECK ("address" ~ '^0x[a-z0-9]{16}$'), CONSTRAINT "PK_c00c01dddbba44df97e70080028" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "drawing_pool" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text NOT NULL, "image" text NOT NULL, "release_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, "size" integer NOT NULL, CONSTRAINT "PK_f57d44f8372a1c26aa0c32d74fa" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "flow_key" ("id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_in_use" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_4ddc07d5b7cabacb45ce362492e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "rate_limit_record" ("key" character varying(255) NOT NULL, "points" integer NOT NULL DEFAULT '0', "expire" bigint NOT NULL, CONSTRAINT "PK_65620a37d4ad3289eef76c73e1f" PRIMARY KEY ("key"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user_session" ("id" character varying NOT NULL, "expires_at" integer NOT NULL, "data" character varying NOT NULL, CONSTRAINT "PK_adf3b49590842ac3cf54cac451a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_event" ADD CONSTRAINT "FK_fe471d2f439fa69a7f9acbf0655" FOREIGN KEY ("flow_transaction_id") REFERENCES "flow_transaction"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_event" ADD CONSTRAINT "FK_fdc00bbf2f45a99b9a25f238b85" FOREIGN KEY ("crypto_create_item_id") REFERENCES "crypto_create_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_completed_event" ADD CONSTRAINT "FK_2c2aa3e529ba62642013768237c" FOREIGN KEY ("flow_transaction_id") REFERENCES "flow_transaction"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" ADD CONSTRAINT "FK_b42370b70e6203a37afd62f9112" FOREIGN KEY ("crypto_create_item_id") REFERENCES "crypto_create_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" ADD CONSTRAINT "FK_7d03bdadb06cc2d68313fbf893e" FOREIGN KEY ("flow_transaction_id") REFERENCES "flow_transaction"("transaction_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" ADD CONSTRAINT "FK_ac8f7d13a7a8bcb353c9c30ff3a" FOREIGN KEY ("sale_offer_completed_event_id") REFERENCES "sale_offer_completed_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_a6fd0d3f9cff45885e7eb784c4b" FOREIGN KEY ("drawingPoolId") REFERENCES "drawing_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_submission" ADD CONSTRAINT "FK_0c526fa40b2407b75de4a930f6f" FOREIGN KEY ("drawingPoolId") REFERENCES "drawing_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_submission" ADD CONSTRAINT "FK_8f8ef0e4336b8227b95dae2a2fd" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
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
  mint_event.crypto_create_item_id AS crypto_create_item_id
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
    nft_event.crypto_create_item_id, 
    nft_event.nft_id 
  FROM nft_event
  WHERE nft_id IS NOT NULL
) AS mint_event ON history.nft_id = mint_event.nft_id
INNER JOIN crypto_create_item ON crypto_create_item.id = mint_event.crypto_create_item_id
`)
    await queryRunner.query(
      `INSERT INTO "typeorm_metadata"("type", "schema", "name", "value") VALUES ($1, $2, $3, $4)`,
      [
        'VIEW',
        'public',
        'simple_nft_transfer',
        "WITH simple_event AS (\n      SELECT * FROM nft_event WHERE flow_transaction_id IN (\n        SELECT flow_transaction_id\n        FROM nft_event\n        WHERE event_type != 'Minted'\n        GROUP BY flow_transaction_id\n        HAVING COUNT(DISTINCT event_type) = 2 and COUNT(event_type) = 2\n      )\n    ), simple_withdraw AS (\n      SELECT * FROM simple_event WHERE event_type = 'Withdraw'\n    ), simple_deposit AS (\n      SELECT * FROM simple_event WHERE event_type = 'Deposit'\n    )\n    SELECT\n      history.*, \n      mint_event.crypto_create_item_id AS crypto_create_item_id\n    FROM (\n      SELECT\n        simple_withdraw.created_at AS created_at,\n        simple_withdraw.nft_id AS nft_id,\n        simple_withdraw.address AS sender,\n        simple_deposit.address AS receiver,\n        simple_withdraw.flow_transaction_id AS flow_transaction_id\n      FROM simple_withdraw\n      INNER JOIN simple_deposit\n      ON simple_withdraw.flow_transaction_id = simple_deposit.flow_transaction_id\n    ) AS history\n    INNER JOIN (\n      SELECT\n        nft_event.crypto_create_item_id, \n        nft_event.nft_id \n      FROM nft_event\n      WHERE nft_id IS NOT NULL\n    ) AS mint_event ON history.nft_id = mint_event.nft_id\n    INNER JOIN crypto_create_item ON crypto_create_item.id = mint_event.crypto_create_item_id",
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
      `ALTER TABLE "nft_submission" DROP CONSTRAINT "FK_8f8ef0e4336b8227b95dae2a2fd"`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_submission" DROP CONSTRAINT "FK_0c526fa40b2407b75de4a930f6f"`
    )
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_a6fd0d3f9cff45885e7eb784c4b"`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" DROP CONSTRAINT "FK_ac8f7d13a7a8bcb353c9c30ff3a"`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" DROP CONSTRAINT "FK_7d03bdadb06cc2d68313fbf893e"`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_available_event" DROP CONSTRAINT "FK_b42370b70e6203a37afd62f9112"`
    )
    await queryRunner.query(
      `ALTER TABLE "sale_offer_completed_event" DROP CONSTRAINT "FK_2c2aa3e529ba62642013768237c"`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_event" DROP CONSTRAINT "FK_fdc00bbf2f45a99b9a25f238b85"`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_event" DROP CONSTRAINT "FK_fe471d2f439fa69a7f9acbf0655"`
    )
    await queryRunner.query(`DROP TABLE "user_session"`)
    await queryRunner.query(`DROP TABLE "rate_limit_record"`)
    await queryRunner.query(`DROP TABLE "flow_key"`)
    await queryRunner.query(`DROP TABLE "drawing_pool"`)
    await queryRunner.query(`DROP TABLE "nft_submission"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "crypto_create_item"`)
    await queryRunner.query(`DROP TABLE "sale_offer_available_event"`)
    await queryRunner.query(`DROP TABLE "sale_offer_completed_event"`)
    await queryRunner.query(`DROP TABLE "flow_transaction"`)
    await queryRunner.query(`DROP TABLE "nft_event"`)
    await queryRunner.query(`DROP TABLE "block_cursor"`)
  }
}
