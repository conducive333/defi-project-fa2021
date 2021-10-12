import { MigrationInterface, QueryRunner } from 'typeorm'
import { resetPermissions } from '../../utils/permissions'
import { clientRole } from '../../utils/roles'

export class createRateLimitRecordPermissions1629438288082
  implements MigrationInterface
{
  private readonly TABLE = 'rate_limit_record'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { CLIENT_DB_USER } = clientRole
    await queryRunner.query(
      `GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE "${this.TABLE}" TO "${CLIENT_DB_USER}"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { CLIENT_DB_USER } = clientRole
    await resetPermissions(queryRunner, this.TABLE, CLIENT_DB_USER)
  }
}
