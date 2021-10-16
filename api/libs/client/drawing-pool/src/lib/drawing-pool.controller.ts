import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common'
import { DrawingPoolService } from './drawing-pool.service'
import { RateLimiterGuard } from '@api/rate-limiter'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DrawingPoolDto, NftSubmissionDto, User } from '@api/database'
import { LimitOffsetOrderQueryDto, UUIDv4Dto } from '@api/utils'
import { AuthenticatedGuard } from '@api/client/auth'
import { CreateSubmissionDto, SubmissionService } from '@api/client/submission'
import { ApiUser } from '@api/client/user'

@UseGuards(RateLimiterGuard)
@ApiTags('Drawing Pools')
@Controller('drawing-pool')
export class DrawingPoolController {
  constructor(
    private readonly drawingPoolService: DrawingPoolService,
    private readonly submissionService: SubmissionService
  ) {}

  @ApiOperation({
    summary: 'Lists all drawing pools.',
  })
  @ApiResponse({ status: 200, type: DrawingPoolDto, isArray: true })
  @Get()
  async findAll(
    @Query() filterOpts: LimitOffsetOrderQueryDto
  ): Promise<DrawingPoolDto[]> {
    return await this.drawingPoolService.findAll(filterOpts)
  }

  @ApiOperation({
    summary: 'Finds a drawing pool by ID.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionDto })
  @Get(':id')
  async findOne(@Param() { id }: UUIDv4Dto): Promise<DrawingPoolDto> {
    return await this.drawingPoolService.findOne(id)
  }

  @ApiOperation({
    summary: 'Creates a submission for a particular drawing pool.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionDto })
  @UseGuards(AuthenticatedGuard)
  @Post(':id/submission')
  async createSubmission(
    @ApiUser() user: User,
    @Param() drawingPoolId: UUIDv4Dto,
    @Body() createSubmissionDto: CreateSubmissionDto
  ): Promise<NftSubmissionDto> {
    return await this.submissionService.create({
      ...createSubmissionDto,
      drawingPoolId: drawingPoolId.id,
      creatorId: user.id,
    })
  }

  @ApiOperation({
    summary: 'Lists all NFT submissions made for a particular drawing pool.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionDto, isArray: true })
  @Get(':id/submission')
  async findAllSubmissions(
    @Param() { id }: UUIDv4Dto,
    @Query() filterOpts: LimitOffsetOrderQueryDto
  ): Promise<NftSubmissionDto[]> {
    return await this.submissionService.findAllForDrawingPool(id, filterOpts)
  }
}
