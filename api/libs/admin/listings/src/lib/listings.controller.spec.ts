import { AdminStorefrontModule } from '@api/flow/flow-admin-storefront'
import { AdminListingsController } from './listings.controller'
import { Test, TestingModule } from '@nestjs/testing'

describe('AdminListingsController', () => {
  let controller: AdminListingsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AdminStorefrontModule],
      controllers: [AdminListingsController],
    }).compile()

    controller = module.get<AdminListingsController>(AdminListingsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
