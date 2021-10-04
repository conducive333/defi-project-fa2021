import { MigrationInterface, QueryRunner } from 'typeorm'
import { clientRole } from '../../utils/roles'

export class createClientRole1628115093365 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // NOTE: A parameterized SQL query will fail for the statment below
    // TODO: Find a better way to do this
    const { CLIENT_DB_USER, CLIENT_DB_PASS } = clientRole
    await queryRunner.query(`
      DO $$
      BEGIN
        CREATE ROLE ${CLIENT_DB_USER} WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION PASSWORD '${CLIENT_DB_PASS}';
        EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'not creating role ${CLIENT_DB_USER} -- it already exists';
      END
      $$
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // NOTE: A parameterized SQL query will fail for the statment below
    // TODO: Find a better way to do this
    const { CLIENT_DB_USER } = clientRole
    await queryRunner.query(`DROP ROLE IF EXISTS ${CLIENT_DB_USER}`)
  }
}
