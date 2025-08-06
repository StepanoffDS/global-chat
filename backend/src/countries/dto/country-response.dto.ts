import { ApiProperty } from '@nestjs/swagger';

export class CountryResponseDto {
  @ApiProperty({
    description: 'Country unique identifier',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Country code (ISO 3166-1 alpha-2)',
    example: 'RU',
  })
  code: string;

  @ApiProperty({
    description: 'Country name',
    example: 'Russia',
  })
  name: string;

  @ApiProperty({
    description: 'Country flag image URL',
    example: 'https://example.com/flags/ru.png',
    nullable: true,
  })
  flagImage: string | null;

  @ApiProperty({
    description: 'Country active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Country creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Country last update timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}
