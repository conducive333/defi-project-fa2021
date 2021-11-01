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
import { SubmissionsService } from '@api/submissions'
import { ApiUser } from '@api/client/user'

@UseGuards(RateLimiterGuard)
@ApiTags('NFT Submissions')
@Controller('submissions')
export class ClientSubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

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
    return await this.submissionsService.findAllForUser(user.id, filterOpts)
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
    const submission = await this.submissionsService.findOneByUser(user.id, id)
    if (submission) {
      return submission
    }
    throw new NotFoundException()
  }
}
