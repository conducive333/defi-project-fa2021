import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common'
import { RateLimiterGuard } from '@api/rate-limiter'
import { AuthenticatedGuard } from '@api/client/auth'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NftSubmissionWithFileDto, User } from '@api/database'
import { LimitOffsetOrderQueryDto, UUIDv4Dto } from '@api/utils'
import { SubmissionService } from '@api/submission'
import { ApiUser } from '@api/client/user'

@UseGuards(RateLimiterGuard)
@ApiTags('NFT Submissions')
@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @ApiOperation({
    summary: 'Lists all NFT submissions made by the logged in user.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionWithFileDto, isArray: true })
  @UseGuards(AuthenticatedGuard)
  @Get()
  async findAll(
    @ApiUser() user: User,
    @Query() filterOpts: LimitOffsetOrderQueryDto
  ): Promise<NftSubmissionWithFileDto[]> {
    return await this.submissionService.findAllForUser(user.id, filterOpts)
  }

  @ApiOperation({
    summary:
      'Finds an NFT submission by ID. Users can only look up their own submissions.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionWithFileDto })
  @UseGuards(AuthenticatedGuard)
  @Get(':id')
  async findOne(
    @ApiUser() user: User,
    @Param() { id }: UUIDv4Dto
  ): Promise<NftSubmissionWithFileDto> {
    const submission = await this.submissionService.findOneByUser(user.id, id)
    if (submission) {
      return submission
    }
    throw new NotFoundException()
  }
}
