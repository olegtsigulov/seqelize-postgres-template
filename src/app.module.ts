import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminPanelModule } from './modules/admin-panel/admin-panel.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    AdminPanelModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
