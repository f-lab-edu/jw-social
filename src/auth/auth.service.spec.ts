import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOne: jest.fn(),
    validatePassword: jest.fn(),
  };
  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('유효한 자격증명으로 로그인 시 액세스 토큰을 반환해야 함', async () => {
      const mockUser = {
        id: 'testId',
        username: 'testUser',
        password: 'hashedPassword',
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('testToken');

      const result = await service.signIn({
        username: 'testUser',
        password: 'realPassword',
      });
      expect(result).toEqual({ accessToken: 'testToken' });
    });

    it('잘못된 비밀번호로 로그인 시도 시 UnauthorizedException을 발생시켜야 함', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue({
        username: 'testUser',
        password: 'hashedPassword',
      } as User);
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(false);

      await expect(
        service.signIn({ username: 'testUser', password: 'wrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
