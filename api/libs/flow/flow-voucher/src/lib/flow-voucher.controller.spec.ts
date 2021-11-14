import { Test, TestingModule } from '@nestjs/testing';
import { FlowVoucherController } from './flow-voucher.controller';
import { FlowVoucherService } from './flow-voucher.service';

describe('FlowVoucherController', () => {
  let controller: FlowVoucherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlowVoucherController],
      providers: [FlowVoucherService],
    }).compile();

    controller = module.get<FlowVoucherController>(FlowVoucherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
