import { FlowAuthModule } from '../auth/authorizer.module'
import { FlowAccountService } from './account.service'
import { FlowModule } from '../flow/flow.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [FlowModule, FlowAuthModule],
  providers: [FlowAccountService],
  exports: [FlowAccountService],
})
export class FlowAccountModule {}
