import { UnauthorizedException } from '@/common/errors';

export class PasswordIncorrectException extends UnauthorizedException {
  constructor() {
    super('제공된 패스워드가 올바르지 않습니다', 'password');
  }
}
