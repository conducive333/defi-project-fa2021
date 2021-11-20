import { DefaultAuthorizer } from './authorizer.default.service'
import { FlowAuthService } from './authorizer.service'
import { Module } from '@nestjs/common'

const flowAuthServiceProvider = {
  provide: FlowAuthService,
  useClass: DefaultAuthorizer,
}

@Module({
  providers: [flowAuthServiceProvider],
  exports: [flowAuthServiceProvider],
})
export class FlowAuthModule {}
