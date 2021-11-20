import { FlowKeyCyclerService } from './flow-key-cycler.service'
import { FlowAccountModule } from '@api/flow/flow-utils'
import { Module } from '@nestjs/common'

@Module({
  imports: [FlowAccountModule],
  providers: [FlowKeyCyclerService],
  exports: [FlowKeyCyclerService],
})
export class FlowKeyCyclerModule {}
