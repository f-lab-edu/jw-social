import { ArgumentsHost, ContextType } from '@nestjs/common';

import { BaseException } from '@/common/errors';

import { ExceptionHandlerRegistry } from './exception-handler-registry';

export class ExceptionManager {
  constructor(
    private readonly registry: ExceptionHandlerRegistry = new ExceptionHandlerRegistry(),
  ) {}

  public handleException(
    ctxType: ContextType,
    exception: BaseException,
    host: ArgumentsHost,
  ): void {
    const handler = this.registry.getHandler(ctxType);

    handler.handle(exception, host);
  }
}
