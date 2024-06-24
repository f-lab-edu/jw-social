import { BaseException, ErrorDetail, InnerError } from './base.exception';

export class UnauthorizedException extends BaseException {
  constructor(
    message: string = 'Unauthorized',
    target?: string,
    details?: ErrorDetail[],
    innererror?: InnerError,
  ) {
    super('unauthorized', message, target, details, innererror);
  }
}
