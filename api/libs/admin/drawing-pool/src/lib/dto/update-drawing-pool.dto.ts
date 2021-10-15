import { PartialType } from '@nestjs/swagger'
import { CreateDrawingPoolDto } from './create-drawing-pool.dto'

export class UpdateDrawingPoolDto extends PartialType(CreateDrawingPoolDto) {}
