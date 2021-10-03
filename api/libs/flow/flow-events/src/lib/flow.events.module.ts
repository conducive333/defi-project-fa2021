import { FlowEventsService } from './flow.events.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [FlowEventsService],
  exports: [FlowEventsService],
})
export class FlowEventsModule {}
