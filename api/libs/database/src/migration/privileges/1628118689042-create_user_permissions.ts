import { MigrationInterface, QueryRunner } from 'typeorm'
import { resetPermissions } from '../../utils/permissions'
import { clientRole } from '../../utils/roles'

export class createUserPermissions1628118689042 implements MigrationInterface {
  private readonly TABLE = 'user'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { CLIENT_DB_USER } = clientRole
    await queryRunner.query(
      `GRANT SELECT, INSERT, UPDATE(username) ON TABLE "${this.TABLE}" TO "${CLIENT_DB_USER}"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { CLIENT_DB_USER } = clientRole
    await resetPermissions(queryRunner, this.TABLE, CLIENT_DB_USER)
  }
}
