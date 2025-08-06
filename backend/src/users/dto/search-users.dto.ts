import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SECURITY_CONSTANTS } from '../constants/security.constants';

export class SearchUsersDto {
  @ApiProperty({
    description: 'Search query for username or email',
    example: 'john',
    required: false,
    minLength: SECURITY_CONSTANTS.SEARCH_QUERY_MIN_LENGTH,
    maxLength: SECURITY_CONSTANTS.SEARCH_QUERY_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @Min(SECURITY_CONSTANTS.SEARCH_QUERY_MIN_LENGTH)
  @Max(SECURITY_CONSTANTS.SEARCH_QUERY_MAX_LENGTH)
  query?: string;

  @ApiProperty({
    description: 'Page number (starts from 1)',
    example: 1,
    default: SECURITY_CONSTANTS.PAGINATION_DEFAULT_PAGE,
    minimum: 1,
    maximum: SECURITY_CONSTANTS.PAGINATION_MAX_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(SECURITY_CONSTANTS.PAGINATION_MAX_PAGE)
  page?: number = SECURITY_CONSTANTS.PAGINATION_DEFAULT_PAGE;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: SECURITY_CONSTANTS.SEARCH_DEFAULT_LIMIT,
    minimum: 1,
    maximum: SECURITY_CONSTANTS.SEARCH_MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(SECURITY_CONSTANTS.SEARCH_MAX_LIMIT)
  limit?: number = SECURITY_CONSTANTS.SEARCH_DEFAULT_LIMIT;
}
