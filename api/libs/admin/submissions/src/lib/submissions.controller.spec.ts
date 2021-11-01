import { SubmissionsModule } from '@api/submissions'
import { Test, TestingModule } from '@nestjs/testing'
import { AdminSubmissionsController } from './submissions.controller'

describe('AdminSubmissionsController', () => {
  let controller: AdminSubmissionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SubmissionsModule],
      controllers: [AdminSubmissionsController],
    }).compile()

    controller = module.get<AdminSubmissionsController>(
      AdminSubmissionsController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
