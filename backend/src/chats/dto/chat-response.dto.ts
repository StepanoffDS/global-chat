import { ApiProperty } from '@nestjs/swagger';

export class ChatResponseDto {
  @ApiProperty({
    description: 'Chat unique identifier',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Country ID',
    example: 'clx1234567890abcdef',
  })
  countryId: string;

  @ApiProperty({
    description: 'Chat name',
    example: 'Russia',
  })
  name: string;

  @ApiProperty({
    description: 'Chat active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Chat creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Chat last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}
