import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  DrawingPoolWithFileDto,
  FileType,
  NftSubmissionWithFileDto,
  OpenSpaceItemDto,
  OpenSpaceItemWithSubmissionAndFileDto,
  User,
} from '@api/database'
import {
  CreateFileSubmissionDto,
  CreateSubmissionDto,
  SubmissionsService,
} from '@api/submissions'
import { ListingsService } from '@api/listings'
import { LimitOffsetOrderQueryDto, UUIDv4Dto } from '@api/utils'
import { FileInterceptor } from '@nestjs/platform-express'
import { DrawingPoolService } from '@api/drawing-pool'
import { AuthenticatedGuard } from '@api/client/auth'
import { RateLimiterGuard } from '@api/rate-limiter'
import { ApiUser } from '@api/client/user'
import { LessThanOrEqual } from 'typeorm'
import { FileService } from '@api/file'

@UseGuards(RateLimiterGuard)
@ApiTags('Drawing Pools')
@Controller('drawing-pool')
export class ClientDrawingPoolController {
  constructor(
    private readonly drawingPoolService: DrawingPoolService,
    private readonly submissionsService: SubmissionsService,
    private readonly listingsService: ListingsService
  ) {}

  @ApiOperation({
    summary: 'Lists all drawing pools.',
  })
  @ApiResponse({ status: 200, type: DrawingPoolWithFileDto, isArray: true })
  @Get()
  async findAll(
    @Query() filterOpts: LimitOffsetOrderQueryDto
  ): Promise<DrawingPoolWithFileDto[]> {
    const now = new Date()
    return await this.drawingPoolService.findAll(filterOpts, {
      releaseDate: LessThanOrEqual(now),
    })
  }

  @ApiOperation({
    summary: 'Finds a drawing pool by ID.',
  })
  @ApiResponse({ status: 200, type: DrawingPoolWithFileDto })
  @Get(':id')
  async findOne(@Param() { id }: UUIDv4Dto): Promise<DrawingPoolWithFileDto> {
    const now = new Date()
    const pool = await this.drawingPoolService.findOne(id, {
      releaseDate: LessThanOrEqual(now),
    })
    if (pool) {
      return pool
    }
    throw new NotFoundException()
  }

  @ApiOperation({
    summary: 'Fetches multiple listings for a particular drawing pool from the primary storefront.',
  })
  @ApiResponse({ status: 200, type: OpenSpaceItemWithSubmissionAndFileDto, isArray: true })
  @Get(':id/listings')
  async getAdminListings(
    @Param() { id }: UUIDv4Dto,
    @Query() filterOpts: LimitOffsetOrderQueryDto
  ): Promise<OpenSpaceItemWithSubmissionAndFileDto[]> {
    return await this.listingsService.findAllAdminListings(id, filterOpts)
  }

  @ApiOperation({
    summary:
      'Creates an image upload submission for a particular drawing pool.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateFileSubmissionDto })
  @ApiResponse({ status: 200, type: NftSubmissionWithFileDto })
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('image', FileService.imgOpts()))
  @Post(':id/submission/image')
  async createImageSubmission(
    @ApiUser() user: User,
    @Param() drawingPoolId: UUIDv4Dto,
    @Body() createSubmissionDto: CreateSubmissionDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<NftSubmissionWithFileDto> {
    if (file) {
      return await this.submissionsService.create(
        {
          ...createSubmissionDto,
          drawingPoolId: drawingPoolId.id,
          creatorId: user.id,
        },
        file,
        FileType.IMAGE
      )
    } else {
      throw new BadRequestException('image is required.')
    }
  }

  @ApiOperation({
    summary: 'Creates a video upload submission for a particular drawing pool.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateFileSubmissionDto })
  @ApiResponse({ status: 200, type: NftSubmissionWithFileDto })
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('file', FileService.vidOpts()))
  @Post(':id/submission/video')
  async createVideoSubmission(
    @ApiUser() user: User,
    @Param() drawingPoolId: UUIDv4Dto,
    @Body() createSubmissionDto: CreateSubmissionDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<NftSubmissionWithFileDto> {
    if (file) {
      return await this.submissionsService.create(
        {
          ...createSubmissionDto,
          drawingPoolId: drawingPoolId.id,
          creatorId: user.id,
        },
        file,
        FileType.VIDEO
      )
    } else {
      throw new BadRequestException('video is required.')
    }
  }
}
