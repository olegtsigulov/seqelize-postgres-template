import { Dialect } from 'sequelize';
import * as dotenv from 'dotenv';
import { IDatabaseConfig } from './interfaces/database.interface';

dotenv.config({ path: `.env/${process.env.NODE_ENV || 'development'}.env` });

export const databaseConfig: IDatabaseConfig = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres' as Dialect,
    logging: false,
    force: true,
    timezone: '+02:00',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres' as Dialect,
    logging: false,
    force: true,
    timezone: '+02:00',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres' as Dialect,
    logging: true,
    force: true,
    timezone: '+02:00',
  },
};
