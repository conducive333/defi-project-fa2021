import { Controller, UseGuards, NotFoundException, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GoogleLoginGuard } from './passport/auth.login.guard'
import { RateLimiterGuard } from '@api/rate-limiter'
import { SuccessDto } from './dto/success.dto'
import { AuthService } from './auth.service'
import { User, UserDto } from '@api/database'
import { ApiUser } from '@api/client/user'

@UseGuards(RateLimiterGuard)
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Authenticates a user with Google.' })
  @ApiResponse({ status: 200, type: SuccessDto })
  @UseGuards(GoogleLoginGuard)
  @Get()
  async googleAuth(): Promise<SuccessDto> {
    return { data: 'SUCCESS' }
  }

  // TODO: redirect to front end (directly) OR use res.redirect here.
  @ApiOperation({
    summary: 'The endpoint Google will call once authentication is complete.',
  })
  @ApiResponse({ status: 200, type: UserDto })
  @UseGuards(GoogleLoginGuard)
  @Get('redirect')
  async googleAuthRedirect(@ApiUser() user: User | undefined): Promise<User> {
    if (user) {
      return user
    } else {
      throw new NotFoundException('User not found.')
    }
  }
}
