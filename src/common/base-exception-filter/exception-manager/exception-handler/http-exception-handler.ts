import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

import { BaseException, ErrorDetail } from '@/common/errors';
import { addOptionalProperties } from '@/common/helpers/add-optional-properties';

import { ExceptionHandler } from './exception-handler';
import { getHttpStatus } from './get-http-status';

export class HttpExceptionHandler implements ExceptionHandler {
  handle(exception: BaseException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = getHttpStatus(exception.getCode());

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

    response.status(status).json(responseBody);
  }
}
