import { MigrationInterface, QueryRunner } from 'typeorm'
import { resetPermissions } from '../../utils/permissions'
import { clientRole, adminRole } from '../../utils/roles'

export class createOpenSpaceItemPermissions1628120404233
  implements MigrationInterface
{
  private readonly TABLE = 'open_space_item'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { CLIENT_DB_USER } = clientRole
    await queryRunner.query(
      `GRANT SELECT ON TABLE "${this.TABLE}" TO "${CLIENT_DB_USER}"`
    )
    const { ADMIN_DB_USER } = adminRole
    await queryRunner.query(
      `GRANT SELECT, INSERT, DELETE ON TABLE "${this.TABLE}" TO "${ADMIN_DB_USER}"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { CLIENT_DB_USER } = clientRole
    await resetPermissions(queryRunner, this.TABLE, CLIENT_DB_USER)
    const { ADMIN_DB_USER } = adminRole
    await resetPermissions(queryRunner, this.TABLE, ADMIN_DB_USER)
  }
}
