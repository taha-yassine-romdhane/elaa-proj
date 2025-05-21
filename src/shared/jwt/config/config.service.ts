import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtOptionsFactory, JwtModuleOptions } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  private tokenBlacklist = new Set<string>();
  
  constructor(private configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.secret,
      signOptions: { expiresIn: this.expiresIn },
    };
  }

  addToBlacklist(token: string) {
    this.tokenBlacklist.add(token);
  }

  isBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  get secret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'your-secret-key';
  }

  get expiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN') || '1h';
  }
}
