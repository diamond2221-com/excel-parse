import { MidwayConfig } from '@midwayjs/core';

export default {
  orm: {
    db_record: {
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '981220Zy',
      database: 'db_eye_remind',
      synchronize: false,
      logging: true,
    },
  },
} as MidwayConfig;
