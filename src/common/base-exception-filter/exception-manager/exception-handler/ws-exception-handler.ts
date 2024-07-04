import { ArgumentsHost } from '@nestjs/common';

import { BaseException, ErrorDetail } from '@/common/errors';
import { addOptionalProperties } from '@/common/helpers/add-optional-properties';

import { ExceptionHandler } from './exception-handler';

export class WsExceptionHandler implements ExceptionHandler {
  handle(exception: BaseException, host: ArgumentsHost): void {
    const client = host.switchToWs().getClient();

    const responseBody = {
      error: addOptionalProperties<ErrorDetail>(
        {
          code: exception.getCode(),
          message: exception.message,
        },
        {
          target: exception.getTarget(),
          details: exception.getDetails(),
          innererror: exception.getInnerError(),
        },
      ),
    };

    client.emit('exception', responseBody);
  }
}
