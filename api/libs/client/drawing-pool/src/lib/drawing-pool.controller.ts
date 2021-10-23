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
  User,
} from '@api/database'
import {
  CreateFileSubmissionDto,
  CreateSubmissionDto,
  SubmissionService,
} from '@api/submission'
import { LimitOffsetOrderQueryDto, UUIDv4Dto } from '@api/utils'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthenticatedGuard } from '@api/client/auth'
import { RateLimiterGuard } from '@api/rate-limiter'
import { ApiUser } from '@api/client/user'
import { FileService } from '@api/file'
import { DrawingPoolService } from '@api/drawing-pool'

@UseGuards(RateLimiterGuard)
@ApiTags('Drawing Pools')
@Controller('drawing-pool')
export class ClientDrawingPoolController {
  constructor(
    private readonly drawingPoolService: DrawingPoolService,
    private readonly submissionService: SubmissionService
  ) {}

  @ApiOperation({
    summary: 'Lists all drawing pools.',
  })
  @ApiResponse({ status: 200, type: DrawingPoolWithFileDto, isArray: true })
  @Get()
  async findAll(
    @Query() filterOpts: LimitOffsetOrderQueryDto
  ): Promise<DrawingPoolWithFileDto[]> {
    return await this.drawingPoolService.findAll(filterOpts)
  }

  @ApiOperation({
    summary: 'Finds a drawing pool by ID.',
  })
  @ApiResponse({ status: 200, type: DrawingPoolWithFileDto })
  @Get(':id')
  async findOne(@Param() { id }: UUIDv4Dto): Promise<DrawingPoolWithFileDto> {
    const pool = await this.drawingPoolService.findOne(id)
    if (pool) {
      return pool
    }
    throw new NotFoundException()
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
      return await this.submissionService.create(
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
  @UseInterceptors(FileInterceptor('video', FileService.vidOpts()))
  @Post(':id/submission/video')
  async createVideoSubmission(
    @ApiUser() user: User,
    @Param() drawingPoolId: UUIDv4Dto,
    @Body() createSubmissionDto: CreateSubmissionDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<NftSubmissionWithFileDto> {
    if (file) {
      return await this.submissionService.create(
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
