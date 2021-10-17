import { FirebaseModule } from '@api/firebase'
import { Module } from '@nestjs/common'
import { FileService } from './file.service'

@Module({
  imports: [FirebaseModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
