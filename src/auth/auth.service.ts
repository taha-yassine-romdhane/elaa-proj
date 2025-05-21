import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtConfigService } from '../shared/jwt/config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private jwtConfigService: JwtConfigService,
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
    this.jwtConfigService.addToBlacklist(token.split(' ')[1]); // Remove 'Bearer ' prefix
    return { message: 'Logged out successfully' };
  }
}
