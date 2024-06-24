import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { BaseException, ErrorDetail } from './errors';
import { addOptionalProperties } from './helpers/add-optional-properties';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctxType = host.getType();

    if (ctxType === 'http') {
      this.handleHttpException(exception, host);
    } else if (ctxType === 'ws') {
      this.handleWsException(exception, host);
    }
  }

  private handleHttpException(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.getHttpStatus(exception.getCode());

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

  private handleWsException(exception: BaseException, host: ArgumentsHost) {
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

  private getHttpStatus(code: string): HttpStatus {
    const statusMap: { [key: string]: HttpStatus } = {
      unauthorized: HttpStatus.UNAUTHORIZED,
      notFound: HttpStatus.NOT_FOUND,
      conflict: HttpStatus.CONFLICT,
    };

    return statusMap[code] || HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
