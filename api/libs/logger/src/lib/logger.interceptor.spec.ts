import { LoggingInterceptor } from './logger.interceptor'
import { Test, TestingModule } from '@nestjs/testing'

// TODO:
describe('LoggingInterceptor', () => {
  let service: LoggingInterceptor

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile()

    service = module.get<LoggingInterceptor>(LoggingInterceptor)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
