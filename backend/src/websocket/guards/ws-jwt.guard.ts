import { CanActivate, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: any): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = client.handshake.auth.token;

      if (!token) {
        throw new WsException('Token not provided');
      }

      const payload = await this.jwtService.verifyAsync(token);
      client.handshake.auth.userId = payload.userId;
      client.handshake.auth.email = payload.email;
      client.handshake.auth.username = payload.username;

      return true;
    } catch (err) {
      throw new WsException('Invalid token');
    }
  }
}
