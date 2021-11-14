import { Module } from '@nestjs/common';
import { FlowVoucherService } from './flow-voucher.service';
import { FlowVoucherController } from './flow-voucher.controller';

@Module({
  controllers: [FlowVoucherController],
  providers: [FlowVoucherService]
})
export class FlowVoucherModule {}
