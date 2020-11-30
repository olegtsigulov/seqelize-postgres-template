import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { configService } from '../../shared/config/configService';
import { UserModule } from '../users/user.module';
import { DatabaseModule } from '../database/database.module';
import { OauthStrategy } from './strategies/oauth.strategy';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    MailerModule,
    DatabaseModule,
    UserModule,
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: configService.getJwtExpiration() },
    })],
  providers: [
    PassportModule,
    AuthService,
    OauthStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
