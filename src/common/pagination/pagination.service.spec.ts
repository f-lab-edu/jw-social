import { Test, TestingModule } from '@nestjs/testing';

import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationService],
    }).compile();

    service = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNextPageToken', () => {
    it('항목의 길이가 maxPageSize와 같으면 암호화된 마지막 항목의 ID를 반환해야 한다', () => {
      const items = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const maxPageSize = 3;
      const getId = (item: { id: string }) => item.id;

      const nextPageToken = service.getNextPageToken(items, maxPageSize, getId);
      expect(nextPageToken).toBeDefined();
      expect(nextPageToken).not.toBe('');
    });

    it('항목의 길이가 maxPageSize보다 작으면 빈 문자열을 반환해야 한다', () => {
      const items = [{ id: '1' }, { id: '2' }];
      const maxPageSize = 3;
      const getId = (item: { id: string }) => item.id;

      const nextPageToken = service.getNextPageToken(items, maxPageSize, getId);
      expect(nextPageToken).toBe('');
    });
  });

  describe('validateAndNormalizePageSize', () => {
    it('유효하지 않은 pageSize가 주어지면 기본 페이지 크기를 반환해야 한다', () => {
      expect(service.validateAndNormalizePageSize(-1)).toBe(10);
      expect(service.validateAndNormalizePageSize(0)).toBe(10);
      expect(service.validateAndNormalizePageSize(undefined)).toBe(10);
    });

    it('주어진 pageSize가 최대 페이지 크기를 초과하면 최대 페이지 크기를 반환해야 한다', () => {
      expect(service.validateAndNormalizePageSize(10000)).toBe(7000);
    });

    it('유효한 pageSize가 주어지면 해당 페이지 크기를 반환해야 한다', () => {
      expect(service.validateAndNormalizePageSize(500)).toBe(500);
    });
  });
});
