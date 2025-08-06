import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessagesQueryDto } from './dto/messages-query.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new message
   */
  async create(
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const { content, chatId } = createMessageDto;

    // Verify chat exists
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

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
   * Get messages for a chat with pagination
   */
  async findByChatId(
    chatId: string,
    query: MessagesQueryDto,
  ): Promise<{
    messages: MessageResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    // Verify chat exists
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { chatId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.message.count({
        where: { chatId },
      }),
    ]);

    return {
      messages: messages.reverse(), // Show oldest first
      total,
      page,
      limit,
    };
  }

  /**
   * Get message by ID
   */
  async findById(id: string): Promise<MessageResponseDto> {
    const message = await this.prisma.message.findUnique({
      where: { id },
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

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  /**
   * Update message
   */
  async update(
    id: string,
    userId: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<MessageResponseDto> {
    const { content } = updateMessageDto;

    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Only message author can edit
    if (message.userId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id },
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
   * Delete message
   */
  async delete(id: string, userId: string): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Only message author can delete
    if (message.userId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.prisma.message.delete({
      where: { id },
    });
  }

  /**
   * Get recent messages for a chat
   */
  async getRecentMessages(
    chatId: string,
    limit: number = 50,
  ): Promise<MessageResponseDto[]> {
    return this.prisma.message.findMany({
      where: { chatId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get message count for a chat
   */
  async getMessageCount(chatId: string): Promise<number> {
    return this.prisma.message.count({
      where: { chatId },
    });
  }
}
