import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('로그인할 수 있어야 한다', async () => {
      const signInDto: SignInDto = {
        username: 'hong',
        password: '123',
      };
      const result = {
        accessToken: 'test-token',
      };

      jest.spyOn(service, 'signIn').mockResolvedValue(result);

      expect(await controller.signIn(signInDto)).toEqual(result);
    });
  });
});
