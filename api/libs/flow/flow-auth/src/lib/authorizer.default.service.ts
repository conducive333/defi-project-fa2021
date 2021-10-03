import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FlowAuthService } from './authorizer.service'

@Injectable()
export class DefaultAuthorizer extends FlowAuthService {
  protected readonly privateKey: string

  constructor(readonly configService: ConfigService) {
    super(
      configService.get<string>('FLOW_DEV_ADDRESS'),
      configService.get<string>('FLOW_TREASURY_ADDRESS')
    )
    this.privateKey = configService.get<string>('FLOW_MASTER_KEY')
  }

  developerAuthenticate = (index: number) => {
    return this.authenticate(this.developerAddress, index, this.privateKey)
  }

  treasuryAuthenticate = () => {
    return this.authenticate(
      this.treasuryAddress,
      DefaultAuthorizer.MASTER_KEY_INDEX,
      this.privateKey
    )
  }
}
