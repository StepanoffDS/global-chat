import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OnlineUsersResponseDto } from './dto/online-users-response.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user profile by ID
   */
  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string): Promise<UserResponseDto> {
    return this.findById(userId);
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const { username, avatar } = updateUserDto;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          username,
          id: { not: userId },
        },
      });

      if (existingUser) {
        throw new ConflictException('Username is already taken');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(username && { username }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  /**
   * Search users with pagination
   */
  async searchUsers(
    searchDto: SearchUsersDto,
    currentUserId: string,
  ): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { query, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const where = query
      ? {
          OR: [
            { username: { contains: query, mode: 'insensitive' as const } },
            { email: { contains: query, mode: 'insensitive' as const } },
          ],
          id: { not: currentUserId },
        }
      : {
          id: { not: currentUserId },
        };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          avatar: true,
          isOnline: true,
          lastSeen: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: { username: 'asc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
    };
  }

  /**
   * Get online users in a specific chat
   */
  async getOnlineUsers(chatId: string): Promise<OnlineUsersResponseDto> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const onlineUsers = await this.prisma.onlineUser.findMany({
      where: { chatId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            avatar: true,
            isOnline: true,
            lastSeen: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return {
      chatId,
      users: onlineUsers.map((ou) => ou.user),
      total: onlineUsers.length,
    };
  }

  /**
   * Update user online status
   */
  async updateOnlineStatus(userId: string, isOnline: boolean): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isOnline,
        lastSeen: new Date(),
      },
    });
  }

  /**
   * Update user last seen
   */
  async updateLastSeen(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        lastSeen: new Date(),
      },
    });
  }

  /**
   * Delete user account (admin only or self-deletion)
   */
  async deleteUser(userId: string, requestingUserId: string): Promise<void> {
    if (userId !== requestingUserId) {
      throw new ForbiddenException('You can only delete your own account');
    }

    await this.prisma.session.deleteMany({
      where: { userId },
    });

    await this.prisma.onlineUser.deleteMany({
      where: { userId },
    });

    await this.prisma.message.deleteMany({
      where: { userId },
    });

    await this.prisma.user.delete({
      where: { id: userId },
    });
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<{
    totalMessages: number;
    joinDate: Date;
    lastSeen: Date;
  }> {
    const [user, totalMessages] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          createdAt: true,
          lastSeen: true,
        },
      }),
      this.prisma.message.count({
        where: { userId },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      totalMessages,
      joinDate: user.createdAt,
      lastSeen: user.lastSeen,
    };
  }
}
