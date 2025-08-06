import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { CountriesModule } from './countries/countries.module';
import { MessagesModule } from './messages/messages.module';
import { PrismaModule } from './prisma/prisma.module';
import { SessionsModule } from './sessions/sessions.module';
import { UsersModule } from './users/users.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    PrismaModule,
    UsersModule,
    CountriesModule,
    ChatsModule,
    MessagesModule,
    WebsocketModule,
    SessionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
