import { QueryRunner } from 'typeorm'

export const resetPermissions = async (
  queryRunner: QueryRunner,
  table: string,
  user: string
) =>
  await queryRunner.query(`REVOKE ALL PRIVILEGES ON "${table}" FROM "${user}"`)
