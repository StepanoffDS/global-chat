import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

export class OnlineUsersResponseDto {
  @ApiProperty({
    description: 'Chat ID',
    example: 'clx1234567890abcdef',
  })
  chatId: string;

  @ApiProperty({
    description: 'Array of online users',
    type: [UserResponseDto],
  })
  users: UserResponseDto[];

  @ApiProperty({
    description: 'Total number of online users',
    example: 5,
  })
  total: number;
}
