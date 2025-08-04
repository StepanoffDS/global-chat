import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createAuthDto: RegisterAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('login')
  async login(@Body() createAuthDto: LoginAuthDto) {
    return this.authService.login(createAuthDto);
  }
}
