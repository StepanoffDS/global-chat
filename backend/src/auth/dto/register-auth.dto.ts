import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Username (3-20 characters)',
    example: 'john_doe',
    minLength: 3,
    maxLength: 20,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  username: string;

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
