import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import * as orm from '@midwayjs/orm';
import * as crossDomain from '@midwayjs/cross-domain';
import * as upload from '@midwayjs/upload';
import { NotFoundFilter } from './filter/notfound.filter';
import { ValidaterFilter } from './filter/validater.filter';
import 'tsconfig-paths/register';

@Configuration({
  imports: [
    koa,
    validate,
    crossDomain,
    upload,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
    orm,
    {
      component: 'swagger',
      enabledEnvironment: ['local'],
    },
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    this.app.useFilter([NotFoundFilter, ValidaterFilter]);
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
