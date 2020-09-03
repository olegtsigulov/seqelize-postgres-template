import { Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { usersProvider } from '../users/user.provider';

@Module({
  providers: [databaseProvider, usersProvider],
  exports: [databaseProvider, usersProvider],
})
export class DatabaseModule {}
