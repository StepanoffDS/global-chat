import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    description: 'Message unique identifier',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello everyone!',
  })
  content: string;

  @ApiProperty({
    description: 'User ID who sent the message',
    example: 'clx1234567890abcdef',
  })
  userId: string;

  @ApiProperty({
    description: 'Chat ID where message was sent',
    example: 'clx1234567890abcdef',
  })
  chatId: string;

  @ApiProperty({
    description: 'Whether message was edited',
    example: false,
  })
  isEdited: boolean;

  @ApiProperty({
    description: 'Message creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Message last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'User who sent the message',
    type: 'object',
    properties: {
      id: { type: 'string' },
      username: { type: 'string' },
      avatar: { type: 'string', nullable: true },
    },
  })
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
}
