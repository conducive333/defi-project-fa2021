import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DrawingPoolWithFileDto, NftSubmissionWithFileDto } from '@api/database'
import { SubmissionService } from '@api/submission'
import { LimitOffsetOrderQueryDto, UUIDv4Dto } from '@api/utils'
import { CreateDrawingPoolDto, DrawingPoolService } from '@api/drawing-pool'

@ApiTags('Drawing Pools')
@Controller('drawing-pool')
export class AdminDrawingPoolController {
  constructor(
    private readonly drawingPoolService: DrawingPoolService,
    private readonly submissionService: SubmissionService
  ) {}

  @Post()
  async create(@Body() createDrawingPoolDto: CreateDrawingPoolDto) {
    return this.drawingPoolService.create(createDrawingPoolDto)
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
    summary: 'Finds a drawing pool by ID.',
  })
  @ApiResponse({ status: 200, type: DrawingPoolWithFileDto, isArray: true })
  @Get(':id')
  async findOne(@Param() { id }: UUIDv4Dto): Promise<DrawingPoolWithFileDto> {
    const pool = await this.drawingPoolService.findOne(id)
    if (pool) {
      return pool
    }
    throw new NotFoundException()
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
    return await this.submissionService.findAllForDrawingPool(id, filterOpts)
  }

  // @ApiOperation({
  //   summary: 'Randomly selects .',
  // })
  // @ApiResponse({ status: 200, type: NftSubmissionWithFileDto, isArray: true })
  // @Get(':id/submission')
  // async mintRandomSubmissions(
  //   @Param() { id }: UUIDv4Dto,
  //   @Query() filterOpts: LimitOffsetOrderQueryDto
  // ): Promise<NftSubmissionWithFileDto[]> {
  //   return await this.submissionService.findAllForDrawingPool(id, filterOpts)
  // }

  // @ApiOperation({
  //   summary: 'Lists all NFT submissions made for a particular drawing pool.',
  // })
  // @ApiResponse({ status: 200, type: NftSubmissionWithFileDto, isArray: true })
  // @Get(':id/submission')
  // async mintSpecificSubmissions(
  //   @Param() { id }: UUIDv4Dto,
  //   @Query() filterOpts: LimitOffsetOrderQueryDto
  // ): Promise<NftSubmissionWithFileDto[]> {
  //   return await this.submissionService.findAllForDrawingPool(id, filterOpts)
  // }
}
