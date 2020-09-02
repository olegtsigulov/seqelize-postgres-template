import * as dotenv from 'dotenv';
import { SequelizeOptions } from 'sequelize-typescript';
import { databaseConfig } from './database';
import { AuthCredentialsInterface } from './interfaces/auth-credentials.interface';

dotenv.config({ path: `.env/${process.env.NODE_ENV || 'development'}.env` });

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string): string {
    const value = this.env[key];
    if (!value) throw new Error(`config error - missing env.${key}`);

    return value;
  }

  public getJwtSecret(refresh = false):string {
    return this.getValue(refresh ? 'JWT_REFRESH_KEY' : 'JWT_ACCESS_KEY');
  }

  public getJwtExpiration(refresh = false): string {
    return this.getValue(refresh ? 'JWT_REFRESH_EXPIRATION' : 'JWT_ACCESS_EXPIRATION');
  }

  public getPort(): number {
    return +this.getValue('PORT') || 3000;
  }

  public getDatabaseConfig(): SequelizeOptions {
    return databaseConfig[process.env.NODE_ENV];
  }

  public getGoogleOAuthCredentials(): AuthCredentialsInterface {
    return {
      clientID: this.getValue('GOOGLE_CLIENT_ID'),
      clientSecret: this.getValue('GOOGLE_CLIENT_SECRET'),
    };
  }

  public getFacebookOAuthCredentials(): AuthCredentialsInterface {
    return {
      clientID: this.getValue('FACEBOOK_CLIENT_ID'),
      clientSecret: this.getValue('FACEBOOK_CLIENT_SECRET'),
    };
  }
}

const configService = new ConfigService(process.env);

export { configService };
