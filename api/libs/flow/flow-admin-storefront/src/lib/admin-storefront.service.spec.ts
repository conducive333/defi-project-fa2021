import { Test, TestingModule } from '@nestjs/testing'
import { FlowAdminStorefrontService } from './admin-storefront.service'

describe('FlowAdminStorefrontService', () => {
  let service: FlowAdminStorefrontService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlowAdminStorefrontService],
    }).compile()

    service = module.get<FlowAdminStorefrontService>(FlowAdminStorefrontService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
