import { MidwayConfig } from '@midwayjs/core';
import { uploadWhiteList } from '@midwayjs/upload';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '_1616377773051_6791',
  // add your config here

  midwayFeature: {
    // true 代表使用 midway logger
    // false 或者为空代表使用 egg-logger
    replaceEggLogger: true,
  },
  midwayLogger: {
    clients: {
      typeormLogger: {
        fileLogName: 'midway-typeorm.log',
        enableError: true,
        level: 'ALL',
      },
    },
  },
  bodyParser: {
    enableTypes: ['json', 'form', 'text', 'xml'],
  },

  security: {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
    },
  },

  staticFile: {
    dirs: {
      default: {
        prefix: '/',
      },
    },
    // ...
  },

  cors: {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  },

  multipart: {
    mode: 'file',
  },

  koa: {
    port: 7001,
  },

  upload: {
    whitelist: [...uploadWhiteList, '.xlsx', '.csv', '.xls'],
  },
} as MidwayConfig;
