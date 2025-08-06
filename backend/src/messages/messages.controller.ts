import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { MessagesQueryDto } from './dto/messages-query.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessagesService } from './messages.service';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({
    status: 201,
    description: 'Message created successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async create(
    @CurrentUser() user: { userId: string },
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    return this.messagesService.create(user.userId, createMessageDto);
  }

  @Get('chat/:chatId')
  @ApiOperation({ summary: 'Get messages for a chat with pagination' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Messages per page',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        messages: {
          type: 'array',
          items: { $ref: '#/components/schemas/MessageResponseDto' },
        },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findByChatId(
    @Param('chatId') chatId: string,
    @Query() query: MessagesQueryDto,
  ) {
    return this.messagesService.findByChatId(chatId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message retrieved successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findById(@Param('id') id: string): Promise<MessageResponseDto> {
    return this.messagesService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a message' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({
    status: 200,
    description: 'Message updated successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only edit own messages',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async update(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<MessageResponseDto> {
    return this.messagesService.update(id, user.userId, updateMessageDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a message' })
  @ApiParam({ name: 'id', description: 'Message ID' })
  @ApiResponse({
    status: 204,
    description: 'Message deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Can only delete own messages',
  })
  @ApiResponse({
    status: 404,
    description: 'Message not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async delete(
    @CurrentUser() user: { userId: string },
    @Param('id') id: string,
  ): Promise<void> {
    return this.messagesService.delete(id, user.userId);
  }

  @Get('chat/:chatId/recent')
  @ApiOperation({ summary: 'Get recent messages for a chat' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiResponse({
    status: 200,
    description: 'Recent messages retrieved successfully',
    type: [MessageResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getRecentMessages(
    @Param('chatId') chatId: string,
  ): Promise<MessageResponseDto[]> {
    return this.messagesService.getRecentMessages(chatId);
  }

  @Get('chat/:chatId/count')
  @ApiOperation({ summary: 'Get message count for a chat' })
  @ApiParam({ name: 'chatId', description: 'Chat ID' })
  @ApiResponse({
    status: 200,
    description: 'Message count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getMessageCount(
    @Param('chatId') chatId: string,
  ): Promise<{ count: number }> {
    const count = await this.messagesService.getMessageCount(chatId);
    return { count };
  }
}
