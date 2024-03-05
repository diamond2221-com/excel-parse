import { EResponse } from '@/enums/response';
import { ResponseMessage } from '@/utils/response';
import { Catch, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch()
export class ValidaterFilter {
  async catch(error: MidwayHttpError, ctx: Context) {
    ctx.logger.error(`
ERROR: ${ctx.path} ${error.name}!;
IP: ${ctx.request.header['x-real-ip'] || '-'};
PORT: ${ctx.request.header['x-real-port'] || '-'};
ERROR_NAME: ${error.name} ${error.code};
ERROR_MESSAGE: ${error.cause?.message};
ERROR_STATUS: ${error.status}
ERROR_STACK: ${error.stack}
`);

    // 或者直接返回一个内容
    if (error.name === 'MidwayValidationError') {
      return new ResponseMessage(
        EResponse['PARAMS_UNVALID'],
        error.cause?.message,
        `参数有误: ${error.cause?.message}`
      );
    }
    return new ResponseMessage(EResponse['ERROR'], null, '系统出现错误');
  }
}
