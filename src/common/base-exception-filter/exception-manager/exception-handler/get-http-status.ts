import { HttpStatus } from '@nestjs/common';

export function getHttpStatus(code: string): HttpStatus {
  const statusMap: { [key: string]: HttpStatus } = {
    unauthorized: HttpStatus.UNAUTHORIZED,
    notFound: HttpStatus.NOT_FOUND,
    conflict: HttpStatus.CONFLICT,
  };

  return statusMap[code] || HttpStatus.INTERNAL_SERVER_ERROR;
}
