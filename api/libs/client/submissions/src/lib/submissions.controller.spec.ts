import { SubmissionsModule } from '@api/submissions'
import { Test, TestingModule } from '@nestjs/testing'
import { ClientSubmissionsController } from './submissions.controller'

describe('ClientSubmissionsController', () => {
  let controller: ClientSubmissionsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SubmissionsModule],
      controllers: [ClientSubmissionsController],
    }).compile()

    controller = module.get<ClientSubmissionsController>(
      ClientSubmissionsController
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
