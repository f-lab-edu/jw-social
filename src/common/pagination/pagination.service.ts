import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  private readonly defaultPageSize = 10;
  private readonly maxPageSize = 7000;

  validateAndNormalizePageSize(pageSize?: number): number {
    if (!pageSize || pageSize <= 0) {
      return this.defaultPageSize;
    }
    return Math.min(pageSize, this.maxPageSize);
  }

  getNextPageToken<T>(
    items: T[],
    maxPageSize: number,
    getId: (item: T) => string,
  ): string {
    if (items.length === maxPageSize) {
      const lastItemId = getId(items[items.length - 1]);
      return lastItemId;
    }
    return '';
  }
}
