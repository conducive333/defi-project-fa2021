import { MulterModuleOptions } from '@nestjs/platform-express'
import { BadRequestException } from '@nestjs/common'
import { FirebaseService } from '@api/firebase'
import { Injectable } from '@nestjs/common'
import { getConnection } from 'typeorm'
import { CryptoCreateFile, FileType } from '@api/database'
import { v4 as uuidv4 } from 'uuid'
import * as multer from 'multer'
import * as path from 'path'

@Injectable()
export class FileService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async firebaseUpload(file: Express.Multer.File, filetype: FileType) {
    return await getConnection().transaction(async (tx) => {
      const key = FileService.getUniqueName(file)
      const url = await this.firebaseService.uploadFile(key, file)
      const res = await tx
        .createQueryBuilder()
        .insert()
        .into(CryptoCreateFile)
        .values({
          category: filetype,
          mimetype: file.mimetype,
          name: file.originalname,
          size: file.size,
          key: key,
          url: url,
        })
        .returning('*')
        .execute()
      return res.generatedMaps[0] as CryptoCreateFile
    })
  }

  static validateImg(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error, acceptFile: boolean) => void
  ) {
    const img = ['.png', '.jpg', '.jpeg']
    const ext = path.extname(file.originalname)
    const err = `File must have one of the following extensions: ${img}`
    return img.includes(ext)
      ? cb(null, true)
      : cb(new BadRequestException(err), false)
  }

  static imgOpts(): MulterModuleOptions {
    return {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 2000000, // 2 MB
      },
      fileFilter: (
        req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error, acceptFile: boolean) => void
      ) => {
        return this.validateImg(req, file, cb)
      },
    }
  }

  static validateVid(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error, acceptFile: boolean) => void
  ) {
    const img = ['.mp4', '.mov', '.gif']
    const ext = path.extname(file.originalname)
    const err = `File must have one of the following extensions: ${img}`
    return img.includes(ext)
      ? cb(null, true)
      : cb(new BadRequestException(err), false)
  }

  static vidOpts(): MulterModuleOptions {
    return {
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 100000000, // 100 MB
      },
      fileFilter: (
        req: Express.Request,
        file: Express.Multer.File,
        cb: (error: Error, acceptFile: boolean) => void
      ) => {
        return this.validateVid(req, file, cb)
      },
    }
  }

  static getUniqueName(file: Express.Multer.File) {
    const extension = path.extname(file.originalname)
    const filename = path.basename(file.originalname, extension)
    return `${filename}-${uuidv4()}${extension}`
  }
}
