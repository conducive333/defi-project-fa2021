import { Test, TestingModule } from '@nestjs/testing'
import { AdminSubmissionController } from './submission.controller'
import { SubmissionService } from '@api/submission'

describe('AdminSubmissionController', () => {
  let controller: AdminSubmissionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminSubmissionController],
      providers: [SubmissionService],
    }).compile()

    controller = module.get<AdminSubmissionController>(
      AdminSubmissionController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
