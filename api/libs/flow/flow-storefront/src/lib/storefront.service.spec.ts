import { Test, TestingModule } from '@nestjs/testing'
import { FlowStorefrontService } from './storefront.service'

describe('FlowStorefrontService', () => {
  let service: FlowStorefrontService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowStorefrontService],
    }).compile()

    service = module.get<FlowStorefrontService>(FlowStorefrontService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
