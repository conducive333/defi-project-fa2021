import { Test, TestingModule } from '@nestjs/testing'
import { FlowKeyCyclerService } from './flow-key-cycler.service'

describe('FlowKeyCyclerService', () => {
  let service: FlowKeyCyclerService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowKeyCyclerService],
    }).compile()

    service = module.get<FlowKeyCyclerService>(FlowKeyCyclerService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
