import { Sequelize } from 'sequelize-typescript';
import * as dotenv from 'dotenv';
import { User } from '../users/user.entity';
import { configService } from '../../shared/config/configService';
import { DatabaseProvidesEnum } from '../../shared/enums/database-provides.enum';

dotenv.config({ path: `.env/${process.env.NODE_ENV || 'development'}.env` });

export const databaseProvider = {
  provide: DatabaseProvidesEnum.databaseInstance,
  useFactory: async () => {
    const config = configService.getDatabaseConfig();
    const sequelize = new Sequelize(config);
    sequelize.addModels([User]);
    // await sequelize.sync({ logging: true, force: false });
    /* await sequelize.sync(); add this if you want to sync model and DB. */
    return sequelize;
  },
};
