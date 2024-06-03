import {
  ExecutionContext,
  ParseUUIDPipe,
  createParamDecorator,
} from '@nestjs/common';

export const UUIDParam = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const id = request.params['id'];
    return new ParseUUIDPipe().transform(id, { type: 'param' });
  },
);
