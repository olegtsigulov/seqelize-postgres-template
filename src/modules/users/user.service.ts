import { Inject, Injectable } from '@nestjs/common';
import { MessageCodeError } from '../../shared/errors';
import { IUserService } from './interfaces';
import { User } from './user.entity';
import { UserDto } from './dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
        @Inject('UserRepository') private readonly userRepository: typeof User,
        @Inject('SequelizeInstance') private readonly sequelizeInstance,
  ) {}

  public async findAll(): Promise<Array<User>> {
    return this.userRepository.findAll<User>();
  }

  public async findOne(options: Object): Promise<User | null> {
    return this.userRepository.findOne<User>(options);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne<User>({ where: { email } });
  }

  public async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne<User>({ where: { id } });
  }

  public async create(user: UserDto): Promise<User> {
    return this.sequelizeInstance.transaction(async (transaction) => this.userRepository.create<User>(user, {
      validate: true,
      transaction,
    }));
  }

  public async update(id: number, newValue: UserDto): Promise<User | null> {
    return this.sequelizeInstance.transaction(async (transaction) => {
      let user = await this.userRepository.findOne<User>({ where: { id }, transaction });
      if (!user) throw new MessageCodeError('user:notFound');

      user = this._assign(user, newValue);
      return user.save({
        validate: true,
        transaction,
      });
    });
  }

  public async delete(id: number): Promise<void> {
    return this.sequelizeInstance.transaction(async (transaction) => await this.userRepository.destroy({
      where: { id },
      transaction,
    }));
  }

  /**
     * @description: Assign new value in the user found in the database.
     *
     * @param {IUser} user
     * @param {IUser} newValue
     * @return {User}
     * @private
     */
  private _assign(user: UserDto, newValue: UserDto): User {
    for (const key of Object.keys(user)) {
      if (user[key] !== newValue[key]) user[key] = newValue[key];
    }

    return user as User;
  }
}
