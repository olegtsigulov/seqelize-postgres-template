import { Module } from '@nestjs/common';
import { AdminPanelPlugin } from './admin-panel.plugin';

@Module({
  imports: [],
  providers: [AdminPanelPlugin],
  exports: [AdminPanelPlugin],
})
export class AdminPanelModule {}
