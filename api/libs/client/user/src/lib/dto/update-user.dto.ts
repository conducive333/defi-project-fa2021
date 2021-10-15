import { IsOptional, Matches, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  /**
   * Username rules:
   *  1. Must be at least 6 characters
   *  2. Can be no more than 30 characters
   *  3. Must start with (a-z) or (A-Z)
   *  4. Can only contain letters (a-zA-Z), digits (0-9), and the following symbols:
   *    a. underscore (_)
   *    b. period (.)
   *    c. hyphen (-)
   */
  @MinLength(6)
  @MaxLength(30)
  @IsOptional()
  @Matches(new RegExp('^[a-zA-Z][a-zA-Z0-9_.-]*$'))
  @ApiProperty({ type: 'string', required: false })
  readonly username: string
}
