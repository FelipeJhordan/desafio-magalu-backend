import { ConfigurationType } from './type/configuration.type';

export const getConfiguration = (): ConfigurationType => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URI: process.env.DATABASE_URI,
  APPLICATION_TITLE: process.env.APPLICATION_TITLE,
  APPLICATION_VERSION: process.env.APPLICATION_VERSION || '1',
  MAX_CHUNK_SIZE: parseInt(process.env.MAX_CHUNK_SIZE, 10) || 2048,
  ALLOW_REPEAT_FILE_FLAG: parseInt(process.env.ALLOW_REPEAT_FILE_FLAG, 10) || 0,
});
