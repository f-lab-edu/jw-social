import { Injectable } from '@nestjs/common';

import { BadRequestException } from '../errors';
import { decrypt, encrypt } from '../helpers/crypto.util';

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
      return this.encryptPageToken(lastItemId);
    }
    return '';
  }

  decryptPageToken(token: string): string {
    try {
      return decrypt(token);
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  private encryptPageToken(token: string): string {
    return encrypt(token);
  }
}
