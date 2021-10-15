import { Test, TestingModule } from '@nestjs/testing'
import { DrawingPoolController } from './drawing-pool.controller'
import { DrawingPoolService } from './drawing-pool.service'

describe('DrawingPoolController', () => {
  let controller: DrawingPoolController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrawingPoolController],
      providers: [DrawingPoolService],
    }).compile()

    controller = module.get<DrawingPoolController>(DrawingPoolController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
