import { Injectable } from '@nestjs/common'
import { CreateDrawingPoolDto } from './dto/create-drawing-pool.dto'
import { UpdateDrawingPoolDto } from './dto/update-drawing-pool.dto'

@Injectable()
export class DrawingPoolService {
  create(createDrawingPoolDto: CreateDrawingPoolDto) {
    return 'This action adds a new drawingPool'
  }

  findAll() {
    return `This action returns all drawingPool`
  }

  findOne(id: number) {
    return `This action returns a #${id} drawingPool`
  }

  update(id: number, updateDrawingPoolDto: UpdateDrawingPoolDto) {
    return `This action updates a #${id} drawingPool`
  }

  remove(id: number) {
    return `This action removes a #${id} drawingPool`
  }
}
