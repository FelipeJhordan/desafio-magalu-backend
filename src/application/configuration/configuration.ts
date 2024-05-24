import { ConfigurationType } from './type/configuration.type';

export const getConfiguration = (): ConfigurationType => ({
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URI: process.env.DATABASE_URI,
});
