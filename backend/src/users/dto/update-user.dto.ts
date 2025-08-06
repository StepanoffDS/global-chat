import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SECURITY_CONSTANTS } from '../constants/security.constants';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User username',
    example: 'john_doe',
    required: false,
    minLength: SECURITY_CONSTANTS.USERNAME_MIN_LENGTH,
    maxLength: SECURITY_CONSTANTS.USERNAME_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MinLength(SECURITY_CONSTANTS.USERNAME_MIN_LENGTH)
  @MaxLength(SECURITY_CONSTANTS.USERNAME_MAX_LENGTH)
  @Matches(SECURITY_CONSTANTS.USERNAME_PATTERN, {
    message:
      'Username can only contain letters, numbers, underscores and hyphens',
  })
  username?: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
    maxLength: SECURITY_CONSTANTS.AVATAR_URL_MAX_LENGTH,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(SECURITY_CONSTANTS.AVATAR_URL_MAX_LENGTH)
  avatar?: string;
}
