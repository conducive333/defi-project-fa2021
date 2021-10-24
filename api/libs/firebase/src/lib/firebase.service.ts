import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { ConfigService } from '@nestjs/config'
import { initializeApp } from 'firebase/app'
import { Injectable } from '@nestjs/common'
import 'multer'

@Injectable()
export class FirebaseService {
  private readonly app: ReturnType<typeof initializeApp>
  private readonly storage: ReturnType<typeof getStorage>
  constructor(configService: ConfigService) {
    this.app = initializeApp({
      apiKey: configService.get<string>('FIREBASE_API_KEY'),
      authDomain: configService.get<string>('FIREBASE_AUTH_DOMAIN'),
      projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
      storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: configService.get<string>('FIREBASE_MSG_SENDER_ID'),
      appId: configService.get<string>('FIREBASE_APP_ID'),
      measurementId: configService.get<string>('FIREBASE_MEASUREMENT_ID'),
    })
    this.storage = getStorage(this.app)
  }

  async uploadFile(key: string, file: Express.Multer.File) {
    const storageRef = ref(this.storage, key)
    await uploadBytes(storageRef, file.buffer)
    return await getDownloadURL(storageRef)
  }

  async removeFile(key: string) {
    const storageRef = ref(this.storage, key)
    await deleteObject(storageRef)
  }
}
