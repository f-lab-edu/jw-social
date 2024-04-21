import { Test } from '@nestjs/testing';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = moduleRef.get<UsersController>(UsersController);
    service = moduleRef.get<UsersService>(UsersService);
  });

  it('컨트롤러가 정의되어 있어야 한다', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('새로운 사용자를 생성해야 한다', async () => {
      const user: CreateUserDto = {
        username: 'gildong-hong',
        email: 'hong@example.com',
        password: 'mock-password',
      };
      const result: User = {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...user,
      };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(user)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('모든 사용자를 찾아야 한다', async () => {
      const result: User[] = [
        {
          id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          username: 'gildong-hong',
          email: 'hong@example.com',
          password: 'asdasd123',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('특정 ID를 가진 사용자를 찾아야 한다', async () => {
      const result: User = {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        username: 'gildong-hong',
        email: 'hong@example.com',
        password: 'asdasd123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(
        await controller.findOne('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'),
      ).toEqual(result);
    });
  });

  describe('update', () => {
    it('특정 ID를 가진 사용자 정보를 업데이트해야 한다', async () => {
      const user = {
        username: 'gildong-nam',
        email: 'nam@example.com',
      };
      const result: User = {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        password: 'asdasd123',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...user,
      };

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(
        await controller.update('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', user),
      ).toEqual(result);
    });
  });

  describe('remove', () => {
    it('특정 ID를 가진 사용자를 삭제해야 한다', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(
        await controller.remove('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'),
      ).toBeUndefined();
    });
  });
});
