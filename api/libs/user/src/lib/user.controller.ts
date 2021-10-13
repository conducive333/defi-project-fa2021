import { AuthenticatedGuard, SuccessDto } from '@api/auth'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { UserService } from './user.service'
import { User } from '@api/database'
import { ApiUser } from './decorators/user.decorator'
import { RateLimiterGuard } from '@api/rate-limiter'
import { UpdateUserDto } from './dto/update-user.dto'
import { Controller, UseGuards, Patch, Body } from '@nestjs/common'

@UseGuards(RateLimiterGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Updates the username of the logged in user.',
    description: `
      Username rules:\n\n\t1. Must be at least 6 characters.\n\t2. Must be no more than 30 characters.\n\t3. Must start with (a-z) or (A-Z)\n\t4. Can only contain letters (a-zA-Z), digits (0-9), and the following symbols: period (.), hyphen (-), and underscore (_).\n\n
      Password rules:\n\n\t1. Must be at least 8 characters.\n\t2. Must be no more than 128 characters.
      `,
  })
  @ApiResponse({ status: 200, type: SuccessDto })
  @UseGuards(AuthenticatedGuard)
  @Patch()
  async updateUsername(
    @ApiUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<SuccessDto> {
    await this.userService.update(user, updateUserDto.username)
    return { data: 'SUCCESS' }
  }
}
