import { MigrationInterface, QueryRunner } from 'typeorm'

// https://github.com/typeorm/typeorm/issues/4923
export class createTypeormMetadata1627860201305 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS typeorm_metadata (
        "type" varchar(255) NOT NULL,
        "database" varchar(255) DEFAULT NULL,
        "schema" varchar(255) DEFAULT NULL,
        "table" varchar(255) DEFAULT NULL,
        "name" varchar(255) DEFAULT NULL,
        "value" text
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS typeorm_metadata`)
  }
}
