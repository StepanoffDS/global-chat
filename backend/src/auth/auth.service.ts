import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Injectable()
export class AuthService {
  private readonly jwtSecret?: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  private async generateToken(userId: string): Promise<string> {
    if (!this.jwtSecret) throw new Error('JWT_SECRET not configured');
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '1h' });
  }

  async register(createAuthDto: RegisterAuthDto) {
    const { email, username, password } = createAuthDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    const token = await this.generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user.id);

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}
