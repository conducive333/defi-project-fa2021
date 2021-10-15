import { Test, TestingModule } from '@nestjs/testing'
import { AdminStorefrontService } from './admin-storefront.service'

describe('AdminStorefrontService', () => {
  let service: AdminStorefrontService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminStorefrontService],
    }).compile()

    service = module.get<AdminStorefrontService>(AdminStorefrontService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
