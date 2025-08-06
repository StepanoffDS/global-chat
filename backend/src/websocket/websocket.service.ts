import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WebsocketService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Update socket ID for user
   */
  async updateSocketId(userId: string, socketId: string): Promise<void> {
    await this.prisma.onlineUser.upsert({
      where: { userId },
      update: { socketId },
      create: {
        userId,
        socketId,
        chatId: '', // Will be set when joining a chat
      },
    });
  }

  /**
   * Update user online status
   */
  async updateUserOnlineStatus(
    userId: string,
    isOnline: boolean,
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isOnline,
        lastSeen: new Date(),
      },
    });
  }

  /**
   * Remove user from online users
   */
  async removeOnlineUser(userId: string): Promise<void> {
    await this.prisma.onlineUser.deleteMany({
      where: { userId },
    });

    // Update user online status
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isOnline: false,
        lastSeen: new Date(),
      },
    });
  }

  /**
   * Create a new message
   */
  async createMessage(userId: string, chatId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
        content,
        userId,
        chatId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return message;
  }

  /**
   * Update a message
   */
  async updateMessage(messageId: string, userId: string, content: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.userId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: {
        content,
        isEdited: true,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return updatedMessage;
  }

  /**
   * Delete a message
   */
  async deleteMessage(messageId: string, userId: string): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.userId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.prisma.message.delete({
      where: { id: messageId },
    });
  }

  /**
   * Get message by ID
   */
  async getMessageById(messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  /**
   * Update user's current chat
   */
  async updateUserChat(userId: string, chatId: string): Promise<void> {
    await this.prisma.onlineUser.upsert({
      where: { userId },
      update: { chatId },
      create: {
        userId,
        chatId,
        socketId: '', // Will be set by connection handler
      },
    });
  }

  /**
   * Get online users for a chat
   */
  async getOnlineUsers(chatId: string) {
    return this.prisma.onlineUser.findMany({
      where: { chatId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isOnline: true,
          },
        },
      },
    });
  }
}
