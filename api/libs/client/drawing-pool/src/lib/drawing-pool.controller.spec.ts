import { Test, TestingModule } from '@nestjs/testing'
import { ClientDrawingPoolController } from './drawing-pool.controller'
import { DrawingPoolService } from '@api/drawing-pool'

describe('ClientDrawingPoolController', () => {
  let controller: ClientDrawingPoolController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientDrawingPoolController],
      providers: [DrawingPoolService],
    }).compile()

    controller = module.get<ClientDrawingPoolController>(
      ClientDrawingPoolController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
