import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateMessageDto {
  @ApiProperty({
    description: 'Updated message content',
    example: 'Updated message content',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;
}
