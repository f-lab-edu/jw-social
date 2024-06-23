import { BaseException, ErrorDetail, InnerError } from './base.exception';

export class NotFoundException extends BaseException {
  constructor(
    message: string = 'Not Found',
    target?: string,
    details?: ErrorDetail[],
    innererror?: InnerError,
  ) {
    super('notFound', message, target, details, innererror);
  }
}
