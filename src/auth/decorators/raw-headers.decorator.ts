import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const rawHeaders = req.rawHeaders;
    if (data) {
      return rawHeaders.indexOf(data) > -1
        ? rawHeaders[rawHeaders.indexOf(data) + 1]
        : undefined;
    }
    return rawHeaders;
  },
);
