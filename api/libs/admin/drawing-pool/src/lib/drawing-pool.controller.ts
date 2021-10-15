import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { DrawingPoolService } from './drawing-pool.service'
import { CreateDrawingPoolDto } from './dto/create-drawing-pool.dto'
import { UpdateDrawingPoolDto } from './dto/update-drawing-pool.dto'

@Controller('drawing-pool')
export class DrawingPoolController {
  constructor(private readonly drawingPoolService: DrawingPoolService) {}

  @Post()
  create(@Body() createDrawingPoolDto: CreateDrawingPoolDto) {
    return this.drawingPoolService.create(createDrawingPoolDto)
  }

  @Get()
  findAll() {
    return this.drawingPoolService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.drawingPoolService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDrawingPoolDto: UpdateDrawingPoolDto
  ) {
    return this.drawingPoolService.update(+id, updateDrawingPoolDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.drawingPoolService.remove(+id)
  }
}
