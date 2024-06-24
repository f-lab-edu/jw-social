import { BaseException, ErrorDetail, InnerError } from './base.exception';

export class ConflictException extends BaseException {
  constructor(
    message: string = 'Conflict',
    target?: string,
    details?: ErrorDetail[],
    innererror?: InnerError,
  ) {
    super('conflict', message, target, details, innererror);
  }
}
