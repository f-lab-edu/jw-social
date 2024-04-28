import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const { username, password } = signInDto;

    const user = await this.usersService.findOne(username);

    const isValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
