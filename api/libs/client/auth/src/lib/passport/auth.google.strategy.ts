import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { GoogleProfile } from '../dto/google-profile.dto'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config'
import { UserService } from '@api/client/user'
import { randomBytes } from 'crypto'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3001/v1/auth/redirect', // make sure this matches the controller route
      scope: ['email', 'profile'],
    })
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback
  ) {
    const uid = profile?.id
    const email = profile?.emails?.[0]?.value
    if (email == null || uid == null) {
      done(new InternalServerErrorException('Invalid google profile.'), null)
    } else {
      const rand = randomBytes(2).toString('hex').slice(0, 3)
      const name = email.split('@')[0] + '-' + rand
      const user = await this.userService.create({
        id: uid,
        email: email,
        username: name,
      })
      done(null, user)
    }
  }
}
