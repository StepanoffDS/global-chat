import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { ChatsService } from './chats.service';
import { ChatResponseDto } from './dto/chat-response.dto';
import { JoinChatDto } from './dto/join-chat.dto';

@ApiTags('Chats')
@Controller('chats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active chats' })
  @ApiResponse({
    status: 200,
    description: 'Chats retrieved successfully',
    type: [ChatResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findAll(): Promise<ChatResponseDto[]> {
    return this.chatsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiParam({ name: 'id', description: 'Chat ID' })
  @ApiResponse({
    status: 200,
    description: 'Chat retrieved successfully',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findById(@Param('id') id: string): Promise<ChatResponseDto> {
    return this.chatsService.findById(id);
  }

  @Get('country/:countryId')
  @ApiOperation({ summary: 'Get chat by country ID' })
  @ApiParam({ name: 'countryId', description: 'Country ID' })
  @ApiResponse({
    status: 200,
    description: 'Chat retrieved successfully',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found for this country',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async findByCountryId(
    @Param('countryId') countryId: string,
  ): Promise<ChatResponseDto> {
    return this.chatsService.findByCountryId(countryId);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get chat with online users count' })
  @ApiParam({ name: 'id', description: 'Chat ID' })
  @ApiResponse({
    status: 200,
    description: 'Chat with stats retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        countryId: { type: 'string' },
        name: { type: 'string' },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        onlineUsersCount: { type: 'number' },
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
  async getChatWithStats(@Param('id') id: string) {
    return this.chatsService.getChatWithStats(id);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a chat' })
  @ApiResponse({
    status: 201,
    description: 'Successfully joined the chat',
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async joinChat(
    @CurrentUser() user: { userId: string },
    @Body() joinChatDto: JoinChatDto,
  ): Promise<void> {
    return this.chatsService.joinChat(user.userId, joinChatDto);
  }

  @Delete(':id/leave')
  @ApiOperation({ summary: 'Leave a chat' })
  @ApiParam({ name: 'id', description: 'Chat ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully left the chat',
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async leaveChat(
    @CurrentUser() user: { userId: string },
    @Param('id') chatId: string,
  ): Promise<void> {
    return this.chatsService.leaveChat(user.userId, chatId);
  }
}
