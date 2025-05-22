import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [UploadController],
  providers: [PrismaService],
})
export class UploadModule {}
