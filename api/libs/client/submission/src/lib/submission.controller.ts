import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
} from '@nestjs/common'
import { SubmissionService } from './submission.service'
import { CreateSubmissionDto } from './dto/create-submission.dto'
import { UpdateSubmissionDto } from './dto/update-submission.dto'
import { RateLimiterGuard } from '@api/rate-limiter'
import { AuthenticatedGuard } from '@api/client/auth'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NftSubmissionDto, User } from '@api/database'
import { ApiUser } from '@api/client/user'
import { LimitOffsetOrderQueryDto, UUIDv4Dto } from '@api/utils'

// TODO:
//  - Should we prevent users from deleting / updating submissions once a drawing pool ends?
//  - POST:
//    - check that the user has entered in a drawing pool before creating a submission
//    - check that the drawing pool that the user is signed up for is valid
//      - current time is withing drawing pool dates
//      - anything else?

@UseGuards(AuthenticatedGuard, RateLimiterGuard)
@ApiTags('NFT Submissions')
@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @ApiOperation({ summary: 'Creates a submission for a particular drawing pool.' })
  @ApiResponse({ status: 200, type: NftSubmissionDto })
  @Post()
  async create(
    @ApiUser() user: User,
    @Body() createSubmissionDto: CreateSubmissionDto
  ): Promise<NftSubmissionDto> {
    return await this.submissionService.create({
      ...createSubmissionDto,
      drawingPoolId: user.drawingPoolId,
      creatorId: user.id,
    })
  }

  @ApiOperation({
    summary:
      'Lists all NFT submissions made by the user.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionDto, isArray: true })
  @Get()
  async findAll(
    @ApiUser() user: User,
    @Query() filterOpts: LimitOffsetOrderQueryDto
  ): Promise<NftSubmissionDto[]> {
    return await this.submissionService.findAll(
      user,
      filterOpts
    )
  }

  @ApiOperation({
    summary: 'Finds an NFT submission by ID.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionDto })
  @Get(':id')
  async findOne(
    @ApiUser() user: User,
    @Param() { id }: UUIDv4Dto
  ): Promise<NftSubmissionDto> {
    return await this.submissionService.findOne(user, id)
  }

  @ApiOperation({
    summary: 'Updates an NFT submission by ID.',
  })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Patch(':id')
  async update(
    @ApiUser() user: User,
    @Param() { id }: UUIDv4Dto,
    @Body() updateSubmissionDto: UpdateSubmissionDto
  ): Promise<void> {
    await this.submissionService.update(user, id, updateSubmissionDto)
  }

  @ApiOperation({
    summary: 'Deletes an NFT by ID.',
  })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  @Delete(':id')
  async remove(
    @ApiUser() user: User,
    @Param() { id }: UUIDv4Dto
  ): Promise<void> {
    await this.submissionService.remove(user, id)
  }
}
