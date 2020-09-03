import { User } from './user.entity';
import { DatabaseProvidesEnum } from '../../shared/enums/database-provides.enum';

export const usersProvider = {
  provide: DatabaseProvidesEnum.userRepository,
  useValue: User,
};
