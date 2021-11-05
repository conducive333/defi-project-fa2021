import { DrawingPoolService } from './drawing-pool.service'
import { Module } from '@nestjs/common'
import { FileModule } from '@api/file'

@Module({
  imports: [FileModule],
  providers: [DrawingPoolService],
  exports: [DrawingPoolService],
})
export class DrawingPoolModule {}
