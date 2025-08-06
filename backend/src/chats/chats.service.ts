import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatResponseDto } from './dto/chat-response.dto';
import { JoinChatDto } from './dto/join-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all chats
   */
  async findAll(): Promise<ChatResponseDto[]> {
    return this.prisma.chat.findMany({
      where: { isActive: true },
      include: {
        country: {
          select: {
            id: true,
            code: true,
            name: true,
            flagImage: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get chat by ID
   */
  async findById(id: string): Promise<ChatResponseDto> {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        country: {
          select: {
            id: true,
            code: true,
            name: true,
            flagImage: true,
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  /**
   * Get chat by country ID
   */
  async findByCountryId(countryId: string): Promise<ChatResponseDto> {
    const chat = await this.prisma.chat.findFirst({
      where: { countryId, isActive: true },
      include: {
        country: {
          select: {
            id: true,
            code: true,
            name: true,
            flagImage: true,
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found for this country');
    }

    return chat;
  }

  /**
   * Join chat
   */
  async joinChat(userId: string, joinChatDto: JoinChatDto): Promise<void> {
    const { chatId } = joinChatDto;

    // Verify chat exists
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Remove user from any other chats first
    await this.prisma.onlineUser.deleteMany({
      where: { userId },
    });

    // Add user to the new chat
    await this.prisma.onlineUser.create({
      data: {
        userId,
        chatId,
        socketId: '', // Will be set by WebSocket
      },
    });

    // Update user online status
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isOnline: true,
        lastSeen: new Date(),
      },
    });
  }

  /**
   * Leave chat
   */
  async leaveChat(userId: string, chatId: string): Promise<void> {
    // Remove user from chat
    await this.prisma.onlineUser.deleteMany({
      where: { userId, chatId },
    });

    // Update user online status
    const onlineUsers = await this.prisma.onlineUser.findMany({
      where: { userId },
    });

    if (onlineUsers.length === 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          isOnline: false,
          lastSeen: new Date(),
        },
      });
    }
  }

  /**
   * Get chat with online users count
   */
  async getChatWithStats(
    chatId: string,
  ): Promise<ChatResponseDto & { onlineUsersCount: number }> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        country: {
          select: {
            id: true,
            code: true,
            name: true,
            flagImage: true,
          },
        },
        _count: {
          select: {
            onlineUsers: true,
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return {
      ...chat,
      onlineUsersCount: chat._count.onlineUsers,
    };
  }

  /**
   * Create chat for country if not exists
   */
  async createChatForCountry(
    countryId: string,
    name: string,
  ): Promise<ChatResponseDto> {
    const existingChat = await this.prisma.chat.findFirst({
      where: { countryId },
    });

    if (existingChat) {
      return existingChat;
    }

    return this.prisma.chat.create({
      data: {
        countryId,
        name,
        isActive: true,
      },
      include: {
        country: {
          select: {
            id: true,
            code: true,
            name: true,
            flagImage: true,
          },
        },
      },
    });
  }
}
