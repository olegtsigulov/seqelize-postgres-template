import { DatabaseProvidesEnum } from '../../shared/enums/database-provides.enum';
import { User } from './entities';

export const entitiesProviders = [{
  provide: DatabaseProvidesEnum.userRepository,
  useValue: User,
}];
