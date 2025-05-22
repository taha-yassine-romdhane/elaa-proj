import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/config.service';

export { JwtConfigService };

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  providers: [JwtConfigService],
  exports: [JwtConfigService, JwtModule],
})
export class JwtConfigModule {}
