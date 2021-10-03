import { Module } from '@nestjs/common'
import { FlowAuthService } from './authorizer.service'
import { DefaultAuthorizer } from './authorizer.default.service'

const flowAuthServiceProvider = {
  provide: FlowAuthService,
  useClass: DefaultAuthorizer,
}

@Module({
  providers: [flowAuthServiceProvider],
  exports: [flowAuthServiceProvider],
})
export class FlowAuthModule {}
