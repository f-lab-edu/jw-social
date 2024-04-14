import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Counter } from './counter.entity';
import { CounterService } from './counter.service';

describe('CounterService', () => {
  let service: CounterService;

  const mockRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CounterService,
        {
          provide: getRepositoryToken(Counter),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<CounterService>(CounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCounter 메소드', () => {
    it('카운터를 조회할 때 기본값을 반환해야 함', async () => {
      const id = {
        id: 1,
      };
      const counter = {
        id: 1,
        value: 0,
      };
      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(counter);

      const result = await service.getCounter();

      expect(mockRepository.findOneBy).toHaveBeenCalled();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith(id);
      expect(result).toBe(0);
    });

    it('카운터가 없을 경우 새로 생성되어야 함', async () => {
      const counter = {
        id: 1,
        value: 0,
      };
      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(null);
      jest.spyOn(mockRepository, 'save').mockReturnValue(counter);

      const result = await service.getCounter();

      expect(mockRepository.create).toHaveBeenCalledWith(counter);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });

  describe('incrementCounter 메소드', () => {
    it('카운터 증가 후 증가된 값 반환', async () => {
      const counter = {
        id: 1,
        value: 0,
      };
      const updatedCounter = {
        id: 1,
        value: 1,
      };
      jest.spyOn(mockRepository, 'findOneBy').mockReturnValue(counter);
      jest.spyOn(mockRepository, 'save').mockReturnValue(updatedCounter);

      const result = await service.incrementCounter();

      expect(mockRepository.save).toHaveBeenCalledWith(updatedCounter);
      expect(result).toBe(1);
    });
  });
});
