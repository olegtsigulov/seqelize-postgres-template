import { INestApplication, Injectable } from '@nestjs/common';
import AdminBro from 'admin-bro';
import * as AdminBroExpress from 'admin-bro-expressjs';
import * as AdminBroSequelize from 'admin-bro-sequelizejs';
import { User } from '../users/user.entity';

@Injectable()
export class AdminPanelPlugin {
  constructor() {
  }

  static async setupAdminPanel(app: INestApplication): Promise<void> {
    AdminBro.registerAdapter(AdminBroSequelize);
    /** Create adminBro instance */

    const adminBro = new AdminBro({
      branding: {
        companyName: 'Polygraph\'s',
        softwareBrothers: false,
      },
      // databases: [DatabaseModule],
      resources: [User],
      rootPath: '/admin', // Define path for the admin panel
    });

    /** Create router */
    const router = AdminBroExpress.buildRouter(adminBro);
    /** Bind routing */
    app.use(adminBro.options.rootPath, router);
  }
}
