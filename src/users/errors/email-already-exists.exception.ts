import { ConflictException } from '@/common/errors';

export class EmailAlreadyExistsException extends ConflictException {
  constructor() {
    super('이미 등록된 이메일입니다', 'email');
  }
}
