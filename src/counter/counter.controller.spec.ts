import { Test } from '@nestjs/testing';

import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';

describe('CounterController', () => {
  let controller: CounterController;

  const mockService = {
    incrementCounter: jest.fn(),
    getCounter: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CounterController],
      providers: [
        {
          provide: CounterService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = moduleRef.get<CounterController>(CounterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('increment', () => {
    it('카운터 증가 기능 검증', async () => {
      const returnedValue = 1;
      jest
        .spyOn(mockService, 'incrementCounter')
        .mockReturnValue(returnedValue);

      const result = await controller.increment();

      expect(result).toBe(returnedValue);
    });
  });

  describe('getCurrentCounter 메소드', () => {
    it('현재 카운터 값 조회 기능 검증', async () => {
      const returnedValue = 0;
      jest.spyOn(mockService, 'getCounter').mockReturnValue(returnedValue);

      const result = await controller.getCurrentCounter();

      expect(result).toBe(returnedValue);
    });
  });
});
