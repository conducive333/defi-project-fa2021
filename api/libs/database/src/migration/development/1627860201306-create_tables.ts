import { MigrationInterface, QueryRunner } from 'typeorm'

export class createTables1627860201306 implements MigrationInterface {
  name = 'createTables1627860201306'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."uploaded_file_category_enum" AS ENUM('IMAGE', 'VIDEO')`
    )
    await queryRunner.query(
      `CREATE TABLE "uploaded_file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "key" text NOT NULL, "name" text NOT NULL, "url" text NOT NULL, "mimetype" text NOT NULL, "category" "public"."uploaded_file_category_enum" NOT NULL, "size" integer NOT NULL, CONSTRAINT "UQ_9790bf46c4d0ec737e2c869abb1" UNIQUE ("key"), CONSTRAINT "PK_e2aa19a0c9b98da779d8eb571fa" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user_to_drawing_pool" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "drawing_pool_id" uuid NOT NULL, "user_id" text NOT NULL, CONSTRAINT "PK_f4445f50f92ff49fe1d082119d8" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" text NOT NULL, "username" text NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "nft_submission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text NOT NULL, "file_id" uuid NOT NULL, "address" text NOT NULL, "drawing_pool_id" uuid NOT NULL, "creator_id" text NOT NULL, CONSTRAINT "CHK_906599a110828be59b8bba5930" CHECK ("address" ~ '^0x[a-z0-9]{16}$'), CONSTRAINT "PK_c00c01dddbba44df97e70080028" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "drawing_pool" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text NOT NULL, "file_id" uuid NOT NULL, "release_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "REL_ee5548c1a3d0c8db43009a955a" UNIQUE ("file_id"), CONSTRAINT "PK_f57d44f8372a1c26aa0c32d74fa" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "flow_key" ("id" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_in_use" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_4ddc07d5b7cabacb45ce362492e" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "open_space_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nft_submission_id" uuid NOT NULL, CONSTRAINT "REL_4d60e66ff69d34579259d79e18" UNIQUE ("nft_submission_id"), CONSTRAINT "PK_e2e26ef08c4400cd28a71e55630" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "rate_limit_record" ("key" character varying(255) NOT NULL, "points" integer NOT NULL DEFAULT '0', "expire" bigint NOT NULL, CONSTRAINT "PK_65620a37d4ad3289eef76c73e1f" PRIMARY KEY ("key"))`
    )
    await queryRunner.query(
      `CREATE TABLE "user_session" ("id" character varying NOT NULL, "expires_at" integer NOT NULL, "data" character varying NOT NULL, CONSTRAINT "PK_adf3b49590842ac3cf54cac451a" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "user_to_drawing_pool" ADD CONSTRAINT "FK_1209ab6e2629855f5e36a35fafe" FOREIGN KEY ("drawing_pool_id") REFERENCES "drawing_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_to_drawing_pool" ADD CONSTRAINT "FK_0b81b65a0b8030c561a7c69fb47" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_submission" ADD CONSTRAINT "FK_4db8dc75ba1c6b429cfb2308215" FOREIGN KEY ("file_id") REFERENCES "uploaded_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_submission" ADD CONSTRAINT "FK_4d51ea042fe80295e0159002841" FOREIGN KEY ("drawing_pool_id") REFERENCES "drawing_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_submission" ADD CONSTRAINT "FK_9136b5fe577389094313f1b7e26" FOREIGN KEY ("creator_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "drawing_pool" ADD CONSTRAINT "FK_ee5548c1a3d0c8db43009a955aa" FOREIGN KEY ("file_id") REFERENCES "uploaded_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "open_space_item" ADD CONSTRAINT "FK_4d60e66ff69d34579259d79e189" FOREIGN KEY ("nft_submission_id") REFERENCES "nft_submission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "open_space_item" DROP CONSTRAINT "FK_4d60e66ff69d34579259d79e189"`
    )
    await queryRunner.query(
      `ALTER TABLE "drawing_pool" DROP CONSTRAINT "FK_ee5548c1a3d0c8db43009a955aa"`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_submission" DROP CONSTRAINT "FK_9136b5fe577389094313f1b7e26"`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_submission" DROP CONSTRAINT "FK_4d51ea042fe80295e0159002841"`
    )
    await queryRunner.query(
      `ALTER TABLE "nft_submission" DROP CONSTRAINT "FK_4db8dc75ba1c6b429cfb2308215"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_to_drawing_pool" DROP CONSTRAINT "FK_0b81b65a0b8030c561a7c69fb47"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_to_drawing_pool" DROP CONSTRAINT "FK_1209ab6e2629855f5e36a35fafe"`
    )
    await queryRunner.query(`DROP TABLE "user_session"`)
    await queryRunner.query(`DROP TABLE "rate_limit_record"`)
    await queryRunner.query(`DROP TABLE "open_space_item"`)
    await queryRunner.query(`DROP TABLE "flow_key"`)
    await queryRunner.query(`DROP TABLE "drawing_pool"`)
    await queryRunner.query(`DROP TABLE "nft_submission"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "user_to_drawing_pool"`)
    await queryRunner.query(`DROP TABLE "uploaded_file"`)
    await queryRunner.query(`DROP TYPE "public"."uploaded_file_category_enum"`)
  }
}
