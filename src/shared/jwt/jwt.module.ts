import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigService } from './config/config.service';

@Module({
  imports: [ConfigModule],
  providers: [JwtConfigService],
  exports: [JwtConfigService],
})
export class JwtModule {}
