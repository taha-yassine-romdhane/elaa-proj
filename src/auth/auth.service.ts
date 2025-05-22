import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user || !(await this.usersService.comparePasswords(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  logout(token: string) {
    // Removed JwtConfigService and blacklist functionality
    return { message: 'Logged out successfully' };
  }
}
