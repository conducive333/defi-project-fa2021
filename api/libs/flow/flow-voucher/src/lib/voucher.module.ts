import { Module } from '@nestjs/common'
import { FlowVoucherService } from './voucher.service'

@Module({
  providers: [FlowVoucherService],
  exports: [FlowVoucherService],
})
export class FlowVoucherModule {}
