import { Module } from '@nestjs/common'
import { FlowKeyCyclerService } from './flow-key-cycler.service'

@Module({
  providers: [FlowKeyCyclerService],
  exports: [FlowKeyCyclerService],
})
export class FlowKeyCyclerModule {}
