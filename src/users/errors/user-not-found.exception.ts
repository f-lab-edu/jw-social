import { NotFoundException } from '@/common/errors';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('UserId가 존재하지 않습니다', 'userId');
  }
}
