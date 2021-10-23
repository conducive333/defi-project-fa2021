import { Controller, Get, Param, NotFoundException } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NftSubmissionWithFileDto } from '@api/database'
import { SubmissionService } from '@api/submission'
import { UUIDv4Dto } from '@api/utils'

@ApiTags('NFT Submissions')
@Controller('submission')
export class AdminSubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @ApiOperation({
    summary: 'Finds an NFT submission by ID.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionWithFileDto })
  @Get(':id')
  async findOne(@Param() { id }: UUIDv4Dto): Promise<NftSubmissionWithFileDto> {
    const submission = await this.submissionService.findOne(id)
    if (submission) {
      return submission
    }
    throw new NotFoundException()
  }
}
