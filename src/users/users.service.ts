import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async comparePasswords(plainText: string, hashed: string) {
    return bcrypt.compare(plainText, hashed);
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role || Role.CUSTOMER,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }
}
