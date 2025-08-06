import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinChatDto {
  @ApiProperty({
    description: 'Chat ID to join',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  chatId: string;
}
