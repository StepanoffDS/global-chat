import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
