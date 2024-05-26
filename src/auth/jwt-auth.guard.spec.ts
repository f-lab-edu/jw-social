import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TestingModule, Test } from '@nestjs/testing';

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('가드가 정의되어 있어야 한다', () => {
    expect(guard).toBeDefined();
  });

  it('local 환경에서는 요청을 무조건 허용해야 한다', async () => {
    const context = createMockExecutionContext('Bearer valid-token');
    (configService.get as jest.Mock).mockReturnValue('local');

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it('유효한 토큰이 주어지면 요청을 허용해야 한다', async () => {
    const context = createMockExecutionContext('Bearer valid-token');
    (configService.get as jest.Mock).mockReturnValue('production');
    (jwtService.verifyAsync as jest.Mock).mockResolvedValue({ sub: 1 });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
  });

  it('토큰이 제공되지 않으면 UnauthorizedException을 발생시켜야 한다', async () => {
    const context = createMockExecutionContext(null);
    (configService.get as jest.Mock).mockReturnValue('production');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  function createMockExecutionContext(
    authHeader: string | null,
  ): ExecutionContext {
    const request = {
      headers: {
        authorization: authHeader,
      },
    } as unknown as Request;

    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;
  }
});
