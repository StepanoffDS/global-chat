import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountryCode } from 'generated/prisma';
import { CountriesService } from './countries.service';
import { CountryResponseDto } from './dto/country-response.dto';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active countries' })
  @ApiResponse({
    status: 200,
    description: 'Countries retrieved successfully',
    type: [CountryResponseDto],
  })
  async findAll(): Promise<CountryResponseDto[]> {
    return this.countriesService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active countries only' })
  @ApiResponse({
    status: 200,
    description: 'Active countries retrieved successfully',
    type: [CountryResponseDto],
  })
  async findActive(): Promise<CountryResponseDto[]> {
    return this.countriesService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get country by ID' })
  @ApiParam({ name: 'id', description: 'Country ID' })
  @ApiResponse({
    status: 200,
    description: 'Country retrieved successfully',
    type: CountryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Country not found',
  })
  async findById(@Param('id') id: string): Promise<CountryResponseDto> {
    return this.countriesService.findById(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get country by code' })
  @ApiParam({ name: 'code', description: 'Country code (e.g., RU, US)' })
  @ApiResponse({
    status: 200,
    description: 'Country retrieved successfully',
    type: CountryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Country not found',
  })
  async findByCode(
    @Param('code') code: CountryCode,
  ): Promise<CountryResponseDto> {
    return this.countriesService.findByCode(code);
  }
}
