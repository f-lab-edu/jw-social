import { Test } from '@nestjs/testing';

import { PaginationService } from '@/common/pagination/pagination.service';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { EmailAlreadyExistsException, UserNotFoundException } from './errors';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let paginationService: PaginationService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let usersRepository: UsersRepository;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPaginationService = {
    validateAndNormalizePageSize: jest.fn().mockReturnValue(10),
    decryptPageToken: jest.fn().mockReturnValue(''),
    getNextPageToken: jest.fn().mockReturnValue(''),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        {
          provide: UsersRepository,
          useValue: mockRepository,
        },
        {
          provide: PaginationService,
          useValue: mockPaginationService,
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    paginationService = moduleRef.get<PaginationService>(PaginationService);
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
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

      expect(await service.create(createUserDto)).toEqual(resultUser);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
    });

    it('중복된 이메일을 사용할 경우 EmailAlreadyExistsException 발생시켜야 한다', async () => {
      const createUserDto: CreateUserDto = {
        username: 'gildong-hong',
        email: 'hong@example.com',
        password: 'asdasd123',
      };

      mockRepository.findOneByEmail.mockResolvedValue(true);

      await expect(service.create(createUserDto)).rejects.toThrow(
        EmailAlreadyExistsException,
      );
    });
  });

  describe('findAll', () => {
    it('모든 사용자 목록을 반환해야 한다', async () => {
      const paginationDto = { pageToken: '', maxPageSize: 10 };

      const result = {
        results: [
          {
            id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            username: 'gildong-hong',
            email: 'hong@example.com',
            password: 'asdasd123',
            createdAt: new Date(),
            updatedAt: new Date(),
            posts: [],
          },
        ],
        nextPageToken: '',
      };
      mockRepository.findAll.mockResolvedValue(result.results);

      expect(
        await service.findAll(
          paginationDto.pageToken,
          paginationDto.maxPageSize,
        ),
      ).toEqual(result);
    });
  });

  describe('findOne', () => {
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
      mockRepository.findOne.mockResolvedValue(result);

      expect(
        await service.findOne('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'),
      ).toEqual(result);
    });

    it('특정 ID의 사용자가 없을 경우 UserNotFoundException을 발생시켜야 한다', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'),
      ).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('update', () => {
    it('특정 ID를 가진 사용자의 일부 정보만 업데이트하고 반환해야 한다', async () => {
      const partialUpdateUserDto = { email: 'update@example.com' };
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
      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.update.mockResolvedValue(updatedUser);

      expect(
        await service.update(existingUser.id, partialUpdateUserDto),
      ).toEqual(updatedUser);
    });

    it('업데이트할 사용자가 없을 경우 UserNotFoundException을 발생시켜야 한다', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', {}),
      ).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('remove', () => {
    it('특정 ID를 가진 사용자를 삭제해야 한다', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d');
      expect(mockRepository.delete).toHaveBeenCalledWith(
        '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      );
    });

    it('삭제 대상이 존재하지 않을 경우 UserNotFoundException을 발생시켜야 한다', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('invalid-id')).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });
});
