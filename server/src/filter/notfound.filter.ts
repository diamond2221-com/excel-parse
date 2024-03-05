import { Catch, httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {
  async catch(_err: MidwayHttpError, ctx: Context) {
    ctx.logger.error(`
ERROR: ${ctx.path} 404 NOT FOUND!;
IP: ${ctx.request.header['x-real-ip'] || 'UNKNOWN'};
PORT: ${ctx.request.header['x-real-port'] || 'UNKNOWN'};
`);

    return {
      message: '404, ' + ctx.path,
    };
  }
}
