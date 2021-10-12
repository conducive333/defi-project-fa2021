import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { SessionSerializer } from './passport/auth.session.serializer'
import { UserModule } from '@api/user'
import { RateLimiterModule } from '@api/rate-limiter'
import { GoogleStrategy } from './passport/auth.google.strategy'

@Module({
  imports: [RateLimiterModule, PassportModule, UserModule],
  providers: [GoogleStrategy, AuthService, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
