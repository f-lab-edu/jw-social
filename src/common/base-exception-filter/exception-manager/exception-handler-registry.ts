import { ContextType } from '@nestjs/common';

import {
  ExceptionHandler,
  HttpExceptionHandler,
  WsExceptionHandler,
} from './exception-handler';

export class ExceptionHandlerRegistry {
  private readonly handlers: Map<ContextType, ExceptionHandler> = new Map([
    ['http', new HttpExceptionHandler()],
    ['ws', new WsExceptionHandler()],
  ]);

  public getHandler(ctxType: ContextType): ExceptionHandler {
    const handler = this.handlers.get(ctxType);

    if (!handler) {
      throw new Error(
        `ctxType에 해당하는 핸들러를 찾지 못했습니다: ${ctxType}`,
      );
    }

    return handler;
  }
}
