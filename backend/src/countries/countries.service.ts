import { Injectable, NotFoundException } from '@nestjs/common';
import { CountryCode } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CountryResponseDto } from './dto/country-response.dto';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all countries
   */
  async findAll(): Promise<CountryResponseDto[]> {
    return this.prisma.country.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get country by ID
   */
  async findById(id: string): Promise<CountryResponseDto> {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    return country;
  }

  /**
   * Get country by code
   */
  async findByCode(code: CountryCode): Promise<CountryResponseDto> {
    const country = await this.prisma.country.findUnique({
      where: { code },
    });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    return country;
  }

  /**
   * Get active countries only
   */
  async findActive(): Promise<CountryResponseDto[]> {
    return this.prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Seed countries data
   */
  async seedCountries(): Promise<void> {
    const countries: { code: CountryCode; name: string; flagImage: string }[] =
      [
        { code: 'RU', name: 'Russia', flagImage: 'https://flagcdn.com/ru.svg' },
        {
          code: 'US',
          name: 'United States',
          flagImage: 'https://flagcdn.com/us.svg',
        },
        {
          code: 'GB',
          name: 'United Kingdom',
          flagImage: 'https://flagcdn.com/gb.svg',
        },
        {
          code: 'DE',
          name: 'Germany',
          flagImage: 'https://flagcdn.com/de.svg',
        },
        { code: 'FR', name: 'France', flagImage: 'https://flagcdn.com/fr.svg' },
        { code: 'IT', name: 'Italy', flagImage: 'https://flagcdn.com/it.svg' },
        { code: 'ES', name: 'Spain', flagImage: 'https://flagcdn.com/es.svg' },
        { code: 'CA', name: 'Canada', flagImage: 'https://flagcdn.com/ca.svg' },
        {
          code: 'AU',
          name: 'Australia',
          flagImage: 'https://flagcdn.com/au.svg',
        },
        { code: 'JP', name: 'Japan', flagImage: 'https://flagcdn.com/jp.svg' },
        { code: 'CN', name: 'China', flagImage: 'https://flagcdn.com/cn.svg' },
        { code: 'IN', name: 'India', flagImage: 'https://flagcdn.com/in.svg' },
        { code: 'BR', name: 'Brazil', flagImage: 'https://flagcdn.com/br.svg' },
        { code: 'MX', name: 'Mexico', flagImage: 'https://flagcdn.com/mx.svg' },
        {
          code: 'AR',
          name: 'Argentina',
          flagImage: 'https://flagcdn.com/ar.svg',
        },
      ];

    for (const country of countries) {
      await this.prisma.country.upsert({
        where: { code: country.code },
        update: {
          name: country.name,
          flagImage: country.flagImage,
          isActive: true,
        },
        create: {
          code: country.code,
          name: country.name,
          flagImage: country.flagImage,
          isActive: true,
        },
      });
    }
  }
}
