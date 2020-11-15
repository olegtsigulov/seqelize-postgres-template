import { Module } from '@nestjs/common';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminPanelModule } from './modules/admin-panel/admin-panel.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    AdminPanelModule,
    SendGridModule.forRoot({
      apiKey: process.env.MAILER_PASS,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
