import { AdminDrawingPoolController } from './drawing-pool.controller'
import { DrawingPoolService } from '@api/drawing-pool'
import { Test, TestingModule } from '@nestjs/testing'

describe('AdminDrawingPoolController', () => {
  let controller: AdminDrawingPoolController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminDrawingPoolController],
      providers: [DrawingPoolService],
    }).compile()

    controller = module.get<AdminDrawingPoolController>(
      AdminDrawingPoolController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
