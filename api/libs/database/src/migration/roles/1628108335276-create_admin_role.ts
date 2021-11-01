import { MigrationInterface, QueryRunner } from 'typeorm'
import { adminRole } from '../../utils/roles'

export class createAdminRole1628108335276 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // NOTE: A parameterized SQL query will fail for the statment below
    // TODO: Find a better way to do this
    const { ADMIN_DB_USER, ADMIN_DB_PASS } = adminRole
    await queryRunner.query(`
      DO $$
      BEGIN
        CREATE ROLE ${ADMIN_DB_USER} WITH LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION PASSWORD '${ADMIN_DB_PASS}';
        EXCEPTION WHEN DUPLICATE_OBJECT THEN
        RAISE NOTICE 'not creating role ${ADMIN_DB_USER} -- it already exists';
      END
      $$
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // NOTE: A parameterized SQL query will fail for the statment below
    // TODO: Find a better way to do this
    const { ADMIN_DB_USER } = adminRole
    await queryRunner.query(`DROP ROLE IF EXISTS ${ADMIN_DB_USER}`)
  }
}
