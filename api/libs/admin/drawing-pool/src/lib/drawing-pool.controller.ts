import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Delete,
} from '@nestjs/common'
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  DrawingPoolDto,
  DrawingPoolWithFileDto,
  FileType,
  NftSubmissionWithFileDto,
  UserToDrawingPoolDto,
} from '@api/database'
import { SubmissionsService } from '@api/submissions'
import { LimitOffsetOrderQueryDto, UUIDv4Dto } from '@api/utils'
import {
  CreateDrawingPoolDto,
  CreateDrawingPoolWithFileDto,
  DrawingPoolService,
} from '@api/drawing-pool'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from '@api/file'
import { DrawingPoolIdUserIdDto } from './dto/drawing-pool-id-user-id.dto'

@ApiTags('Drawing Pools')
@Controller('drawing-pool')
export class AdminDrawingPoolController {
  constructor(
    private readonly drawingPoolService: DrawingPoolService,
    private readonly submissionsService: SubmissionsService
  ) {}

  @ApiOperation({
    summary: 'Creates a drawing pool with randomly selected users.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDrawingPoolWithFileDto })
  @ApiResponse({ status: 200, type: DrawingPoolWithFileDto })
  @UseInterceptors(FileInterceptor('file', FileService.vidOpts()))
  @Post('random/video')
  async createRandomPoolWithVideoUpload(
    @Body() createDrawingPoolDto: CreateDrawingPoolDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<DrawingPoolWithFileDto> {
    if (file) {
      return await this.drawingPoolService.create(
        createDrawingPoolDto,
        file,
        FileType.VIDEO,
        true
      )
    }
    throw new BadRequestException('video is required.')
  }

  @ApiOperation({
    summary: 'Creates a drawing pool with randomly selected users.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDrawingPoolWithFileDto })
  @ApiResponse({ status: 200, type: DrawingPoolWithFileDto })
  @UseInterceptors(FileInterceptor('file', FileService.imgOpts()))
  @Post('random/image')
  async createRandomPoolWithImageUpload(
    @Body() createDrawingPoolDto: CreateDrawingPoolDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<DrawingPoolWithFileDto> {
    if (file) {
      return await this.drawingPoolService.create(
        createDrawingPoolDto,
        file,
        FileType.IMAGE,
        true
      )
    }
    throw new BadRequestException('image is required.')
  }

  @ApiOperation({
    summary: 'Creates an empty drawing pool.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDrawingPoolWithFileDto })
  @ApiResponse({ status: 200, type: DrawingPoolWithFileDto })
  @UseInterceptors(FileInterceptor('file', FileService.vidOpts()))
  @Post('video')
  async createPoolWithVideoUpload(
    @Body() createDrawingPoolDto: CreateDrawingPoolDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<DrawingPoolWithFileDto> {
    if (file) {
      return await this.drawingPoolService.create(
        createDrawingPoolDto,
        file,
        FileType.VIDEO
      )
    }
    throw new BadRequestException('video is required.')
  }

  @ApiOperation({
    summary: 'Creates an empty drawing pool.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateDrawingPoolWithFileDto })
  @ApiResponse({ status: 200, type: DrawingPoolWithFileDto })
  @UseInterceptors(FileInterceptor('file', FileService.imgOpts()))
  @Post('image')
  async createPoolWithImageUpload(
    @Body() createDrawingPoolDto: CreateDrawingPoolDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<DrawingPoolWithFileDto> {
    if (file) {
      return await this.drawingPoolService.create(
        createDrawingPoolDto,
        file,
        FileType.IMAGE
      )
    }
    throw new BadRequestException('image is required.')
  }

  @ApiOperation({
    summary: 'Removes a drawing pool.',
  })
  @ApiResponse({ status: 200, type: DrawingPoolDto })
  @Delete(':id')
  async remove(@Param() { id }: UUIDv4Dto): Promise<DrawingPoolDto> {
    return await this.drawingPoolService.remove(id)
  }

  @ApiOperation({
    summary: 'Adds a user to a drawing pool.',
  })
  @ApiResponse({ status: 200, type: UserToDrawingPoolDto })
  @Post(':id/user/:userId')
  async addUserToPool(
    @Param() { id, userId }: DrawingPoolIdUserIdDto
  ): Promise<UserToDrawingPoolDto> {
    return await this.drawingPoolService.appendUser(id, userId)
  }

  @ApiOperation({
    summary: 'Removes a user from a drawing pool.',
  })
  @ApiResponse({ status: 200, type: UserToDrawingPoolDto })
  @Delete(':id/user/:userId')
  async removeUserFromPool(
    @Param() { id, userId }: DrawingPoolIdUserIdDto
  ): Promise<UserToDrawingPoolDto> {
    return await this.drawingPoolService.removeUser(id, userId)
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
    summary: 'Lists all NFT submissions made for a particular drawing pool.',
  })
  @ApiResponse({ status: 200, type: NftSubmissionWithFileDto, isArray: true })
  @Get(':id/submission')
  async findAllSubmissions(
    @Param() { id }: UUIDv4Dto,
    @Query() filterOpts: LimitOffsetOrderQueryDto
  ): Promise<NftSubmissionWithFileDto[]> {
    return await this.submissionsService.findAllForDrawingPool(id, filterOpts)
  }
}
