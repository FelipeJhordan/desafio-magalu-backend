import { ConfigurationType } from './type/configuration.type';

export const getConfiguration = (): ConfigurationType => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URI: process.env.DATABASE_URI,
  APPLICATION_TITLE: process.env.APPLICATION_TITLE,
  APPLICATION_VERSION: process.env.APPLICATION_VERSION || '1',
});
