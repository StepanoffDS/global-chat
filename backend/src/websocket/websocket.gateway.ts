import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from './guards/ws-jwt.guard';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
})
@UseGuards(WsJwtGuard)
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketService: WebsocketService) {}

  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.auth.userId;
      const chatId = client.handshake.auth.chatId;

      if (!userId || !chatId) {
        client.disconnect();
        return;
      }

      // Update socket ID in database
      await this.websocketService.updateSocketId(userId, client.id);

      // Join the chat room
      await client.join(chatId);

      // Update user online status
      await this.websocketService.updateUserOnlineStatus(userId, true);

      // Notify others that user joined
      client.to(chatId).emit('userJoined', {
        userId,
        timestamp: new Date(),
      });

      console.log(`User ${userId} connected to chat ${chatId}`);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const userId = client.handshake.auth.userId;
      const chatId = client.handshake.auth.chatId;

      if (userId && chatId) {
        // Remove user from online users
        await this.websocketService.removeOnlineUser(userId);

        // Notify others that user left
        client.to(chatId).emit('userLeft', {
          userId,
          timestamp: new Date(),
        });

        console.log(`User ${userId} disconnected from chat ${chatId}`);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() data: { content: string; chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.handshake.auth.userId;
      const { content, chatId } = data;

      // Create message in database
      const message = await this.websocketService.createMessage(
        userId,
        chatId,
        content,
      );

      // Broadcast message to all users in the chat
      this.server.to(chatId).emit('newMessage', message);

      return { success: true, message };
    } catch (error) {
      console.error('Send message error:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @MessageBody() data: { messageId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.handshake.auth.userId;
      const { messageId, content } = data;

      // Update message in database
      const message = await this.websocketService.updateMessage(
        messageId,
        userId,
        content,
      );

      // Broadcast updated message to all users in the chat
      this.server.to(message.chatId).emit('messageEdited', message);

      return { success: true, message };
    } catch (error) {
      console.error('Edit message error:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.handshake.auth.userId;
      const { messageId } = data;

      // Get message before deletion to get chatId
      const message = await this.websocketService.getMessageById(messageId);

      // Delete message from database
      await this.websocketService.deleteMessage(messageId, userId);

      // Broadcast message deletion to all users in the chat
      this.server.to(message.chatId).emit('messageDeleted', {
        messageId,
        userId,
        timestamp: new Date(),
      });

      return { success: true };
    } catch (error) {
      console.error('Delete message error:', error);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { chatId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.handshake.auth.userId;
      const { chatId, isTyping } = data;

      // Broadcast typing status to other users in the chat
      client.to(chatId).emit('userTyping', {
        userId,
        isTyping,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Typing error:', error);
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const userId = client.handshake.auth.userId;
      const { chatId } = data;

      // Leave current chat room
      const rooms = Array.from(client.rooms);
      rooms.forEach((room) => {
        if (room !== client.id) {
          client.leave(room);
        }
      });

      // Join new chat room
      await client.join(chatId);

      // Update user's current chat in database
      await this.websocketService.updateUserChat(userId, chatId);

      // Notify others that user joined
      client.to(chatId).emit('userJoined', {
        userId,
        timestamp: new Date(),
      });

      return { success: true };
    } catch (error) {
      console.error('Join chat error:', error);
      return { success: false, error: error.message };
    }
  }
}
