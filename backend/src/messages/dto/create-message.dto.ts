import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Message content',
    example: 'Hello everyone!',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: 'Chat ID where to send the message',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty()
  chatId: string;
}
