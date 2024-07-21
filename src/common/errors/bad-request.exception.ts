import { BaseException, ErrorDetail, InnerError } from './base.exception';

export class BadRequestException extends BaseException {
  constructor(
    message: string = 'Bad Request',
    target?: string,
    details?: ErrorDetail[],
    innererror?: InnerError,
  ) {
    super('badRequest', message, target, details, innererror);
  }
}
