import { Test, TestingModule } from '@nestjs/testing'
import { DrawingPoolService } from './drawing-pool.service'

describe('DrawingPoolService', () => {
  let service: DrawingPoolService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DrawingPoolService],
    }).compile()

    service = module.get<DrawingPoolService>(DrawingPoolService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
