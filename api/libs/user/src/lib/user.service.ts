import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { getConnection } from 'typeorm'
import { User } from '@api/database'

@Injectable()
export class UserService {

  // The PG advisory lock identifier. Transaction-level lock requests for the
  // same advisory lock identifier will block each other in the expected way.
  private static readonly LOCK_ID = 1

  async create(createUserDto: CreateUserDto) {
    return await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [
        UserService.LOCK_ID,
      ])
      const user = await tx.findOne(User, createUserDto.id)
      if (user) {
        return user
      } else {
        const result = await tx
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(createUserDto)
          .returning('*')
          .execute()
        return result.generatedMaps[0] as User
      }
    })
  }

  async update(user: User, username: string) {
    return await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [
        UserService.LOCK_ID,
      ])
      const existingUser = await tx.findOne(User, { where: { username } })
      if (existingUser) {
        throw new BadRequestException('Username already exists.')
      } else {
        await tx.update(User, user.id, { username })
        return tx.create(User, {
          ...user,
          username
        })
      }
    })
  }
  
}
