import { Test, TestingModule } from '@nestjs/testing'
import { FlowVoucherService } from './voucher.service'

describe('FlowVoucherService', () => {
  let service: FlowVoucherService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowVoucherService],
    }).compile()

    service = module.get<FlowVoucherService>(FlowVoucherService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
