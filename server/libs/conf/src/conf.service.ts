import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, defaultConfig } from './defaultConfig';

@Injectable()
export class ConfService {
  constructor(private readonly configService: ConfigService) {}

  getOrThrow<T>(path: string): T {
    const value = this.configService.get<T>(path);
    if (value === undefined) {
      throw new Error(`Configuration key "${path}" not found`);
    }
    return value;
  }

  getOrDefault<T>(path: string): T {
    const value = this.configService.get<T>(path);
    return value !== undefined ? value : defaultConfig[path];
  }
}