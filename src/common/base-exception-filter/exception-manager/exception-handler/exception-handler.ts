import { ArgumentsHost } from '@nestjs/common';

import { BaseException } from '@/common/errors';

export interface ExceptionHandler {
  handle(exception: BaseException, host: ArgumentsHost): void;
}
