import { PassportSerializer } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { User } from '@api/database'
import { getConnection } from 'typeorm'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor() {
    super()
  }
  serializeUser(user: User, done: (err: Error, userId: string) => void) {
    done(null, user.id)
  }
  async deserializeUser(
    userId: string,
    done: (err: Error, user?: User) => void
  ) {
    return await getConnection().transaction(async (tx) => {
      return await tx
        .findOneOrFail(User, userId)
        .then((user) => done(null, user))
        .catch((err) => done(err))
    })
  }
}
