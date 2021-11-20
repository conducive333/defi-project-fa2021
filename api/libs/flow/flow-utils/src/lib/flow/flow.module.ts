import { FlowService } from './flow.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [FlowService],
  exports: [FlowService],
})
export class FlowModule {}
