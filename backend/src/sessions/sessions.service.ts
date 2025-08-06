import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create a new session
   */
  async createSession(userId: string, token: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(token);
    const expiresAt = new Date(payload.exp * 1000);

    await this.prisma.session.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  /**
   * Validate session token
   */
  async validateSession(token: string): Promise<boolean> {
    try {
      const session = await this.prisma.session.findUnique({
        where: { token },
      });

      if (!session) {
        return false;
      }

      // Check if session is expired
      if (new Date() > session.expiresAt) {
        await this.prisma.session.delete({
          where: { id: session.id },
        });
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Delete session (logout)
   */
  async deleteSession(userId: string, token: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        userId,
        token,
      },
    });
  }

  /**
   * Delete all sessions for a user
   */
  async deleteAllSessions(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({
      where: { userId },
    });
  }

  /**
   * Clean expired sessions
   */
  async cleanExpiredSessions(): Promise<void> {
    await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /**
   * Get user sessions count
   */
  async getUserSessionsCount(userId: string): Promise<number> {
    return this.prisma.session.count({
      where: { userId },
    });
  }
}
