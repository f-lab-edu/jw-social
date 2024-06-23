import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UserService', () => {
  let service: UsersService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create 메소드', () => {
    it('새로운 사용자를 생성하고 반환해야 한다', async () => {
      const createUserDto: CreateUserDto = {
        username: 'gildong-hong',
        email: 'hong@example.com',
        password: 'asdasd123',
      };
      const hashedPassword =
        '$2b$10$HTSGLoTVpsgYYy2K8G0nPu7ASDPFjia3WpuMQv/PcKKmzEUMx0xhi';

      jest
        .spyOn(service as any, 'hashPassword')
        .mockResolvedValue(hashedPassword);

      const resultUser: User = {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: [],
        ...createUserDto,
      };
      mockRepository.create.mockReturnValue(resultUser);
      mockRepository.save.mockResolvedValue(resultUser);

      expect(await service.create(createUserDto)).toEqual(resultUser);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(resultUser);
    });

    it('중복된 이메일을 사용할 경우 ConflictException 발생시켜야 한다', async () => {
      const createUserDto: CreateUserDto = {
        username: 'gildong-hong',
        email: 'hong@example.com',
        password: 'asdasd123',
      };

      mockRepository.findOneBy.mockResolvedValue(true);

      await expect(service.create(createUserDto)).rejects.toThrow();
    });
  });

  describe('findAll 메소드', () => {
    it('모든 사용자 목록을 반환해야 한다', async () => {
      const result: User[] = [
        {
          id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
          username: 'gildong-hong',
          email: 'hong@example.com',
          password: 'asdasd123',
          createdAt: new Date(),
          updatedAt: new Date(),
          posts: [],
        },
      ];
      mockRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne 메소드', () => {
    it('특정 ID를 가진 사용자를 반환해야 한다', async () => {
      const result: User = {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        username: 'gildong-hong',
        email: 'hong@example.com',
        password: 'asdasd123',
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: [],
      };
      mockRepository.findOneBy.mockResolvedValue(result);

      expect(
        await service.findOne('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'),
      ).toEqual(result);
    });

    it('특정 ID의 사용자가 없을 경우 NotFoundException을 발생시켜야 한다', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.findOne('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'),
      ).rejects.toThrow();
    });
  });

  describe('update 메소드', () => {
    it('특정 ID를 가진 사용자의 일부 정보만 업데이트하고 반환해야 한다', async () => {
      const partialUpdateUserDto = {
        email: 'update@example.com',
      };
      const existingUser: User = {
        id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        username: 'gildong-hong',
        email: 'hong@example.com',
        password: 'asdasd123',
        createdAt: new Date(),
        updatedAt: new Date(),
        posts: [],
      };
      const updatedUser: User = {
        ...existingUser,
        ...partialUpdateUserDto,
      };
      mockRepository.preload.mockResolvedValue(updatedUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      expect(
        await service.update(existingUser.id, partialUpdateUserDto),
      ).toEqual(updatedUser);
    });

    it('업데이트할 사용자가 없을 경우 NotFoundException을 발생시켜야 한다', async () => {
      mockRepository.preload.mockResolvedValue(null);

      await expect(
        service.update('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', {}),
      ).rejects.toThrow();
    });
  });

  describe('remove 메소드', () => {
    it('특정 ID를 가진 사용자를 삭제해야 한다', async () => {
      mockRepository.delete.mockResolvedValue({
        affected: 1,
      });

      await service.remove('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
      expect(mockRepository.delete).toHaveBeenCalledWith(
        '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      );
    });

    it('삭제 대상이 존재하지 않을 경우 NotFoundException을 발생시켜야 한다', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('invalid-id')).rejects.toThrow();
    });
  });
});
