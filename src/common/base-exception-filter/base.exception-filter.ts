import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';

import { BaseException } from '../errors';

import { ExceptionManager } from './exception-manager/exception-manager';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly exceptionManager: ExceptionManager = new ExceptionManager(),
  ) {}

  catch(exception: BaseException, host: ArgumentsHost) {
    const ctxType = host.getType();

    this.exceptionManager.handleException(ctxType, exception, host);
  }
}
