import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common'
import { SubmissionService } from './submission.service'
import { RateLimiterGuard } from '@api/rate-limiter'
import { AuthenticatedGuard } from '@api/client/auth'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NftSubmissionDto, User } from '@api/database'
import { ApiUser } from '@api/client/user'
import { LimitOffsetOrderQueryDto, UUIDv4Dto } from '@api/utils'

@UseGuards(RateLimiterGuard)
@ApiTags('NFT Submissions')
@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @ApiOperation({
    summary: 'Lists all NFT submissions made by the logged in user.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionDto, isArray: true })
  @UseGuards(AuthenticatedGuard)
  @Get()
  async findAll(
    @ApiUser() user: User,
    @Query() filterOpts: LimitOffsetOrderQueryDto
  ): Promise<NftSubmissionDto[]> {
    return await this.submissionService.findAllForUser(user.id, filterOpts)
  }

  @ApiOperation({
    summary: 'Finds an NFT submission by ID.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionDto })
  @Get(':id')
  async findOne(@Param() { id }: UUIDv4Dto): Promise<NftSubmissionDto> {
    return await this.submissionService.findOne(id)
  }
}
