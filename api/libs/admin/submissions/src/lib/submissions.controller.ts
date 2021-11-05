import { Controller, Get, Param, NotFoundException, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NftSubmissionWithFileDto } from '@api/database'
import { SubmissionsService } from '@api/submissions'
import { UUIDv4Dto } from '@api/utils'

@ApiTags('NFT Submissions')
@Controller('submissions')
export class AdminSubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @ApiOperation({
    summary: 'Finds an NFT submission by ID.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionWithFileDto })
  @Get(':id')
  async findOne(@Param() { id }: UUIDv4Dto): Promise<NftSubmissionWithFileDto> {
    const submission = await this.submissionsService.findOne(id)
    if (submission) {
      return submission
    }
    throw new NotFoundException()
  }
}
