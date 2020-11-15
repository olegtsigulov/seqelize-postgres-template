import { Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { entitiesProviders } from './entities.providers';

@Module({
  providers: [databaseProvider, ...entitiesProviders],
  exports: [databaseProvider, ...entitiesProviders],
})
export class DatabaseModule {}
