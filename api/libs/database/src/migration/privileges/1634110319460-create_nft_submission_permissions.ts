import { MigrationInterface, QueryRunner } from 'typeorm'
import { resetPermissions } from '../../utils/permissions'
import { clientRole } from '../../utils/roles'

export class createNftSubmissionPermissions1634110319460
  implements MigrationInterface
{
  private readonly TABLE = 'nft_submission'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { CLIENT_DB_USER } = clientRole
    await queryRunner.query(
      `GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "${this.TABLE}" TO "${CLIENT_DB_USER}"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { CLIENT_DB_USER } = clientRole
    await resetPermissions(queryRunner, this.TABLE, CLIENT_DB_USER)
  }
}
