import { Inject, Injectable } from '@nestjs/common';
import { MessageCodeError } from '../../shared/errors';
import { IUserService } from './interfaces';
import { User } from '../database/entities/user.entity';
import { UserDto } from './dto';
import { DatabaseProvidesEnum } from '../../shared/enums/database-provides.enum';

@Injectable()
export class UserService implements IUserService {
  constructor(
        @Inject(DatabaseProvidesEnum.userRepository) private readonly userRepository: typeof User,
        @Inject(DatabaseProvidesEnum.databaseInstance) private readonly sequelizeInstance,
  ) {}

  public async findAll(): Promise<Array<User>> {
    return this.userRepository.findAll<User>();
  }

  public async findOneWithPassword(options: Record<string, any>): Promise<User | null> {
    const user = await this.userRepository.findOne<User>(options);
    if (user) return user.get({ plain: true });
    return user;
  }

  public async findOne(options: Record<string, any>): Promise<User | null> {
    return this.userRepository.findOne<User>({ ...options, attributes: { exclude: ['hash'] }, raw: true });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne<User>({ where: { email }, attributes: { exclude: ['hash'] } });
  }

  public async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne<User>({ where: { id }, attributes: { exclude: ['hash'] } });
  }

  public async create(user: UserDto): Promise<User> {
    return this.sequelizeInstance.transaction(async (transaction) => this.userRepository.create<User>(user, {
      validate: true,
      transaction,
    }));
  }
  // public async create(user: UserDto): Promise<User> {
  //   return this.userRepository.create(user);
  // }

  public async update(id: number, updateValues: Object): Promise<User | null> {
    return this.userRepository.update<User>(updateValues, { where: { id } });
    // return this.sequelizeInstance.transaction(async (transaction) => {
    //   let user = await this.userRepository.findOne<User>({ where: { id }, transaction, raw: true });
    //   if (!user) throw new MessageCodeError('user:notFound');
    //
    //   user = this._assign(user, newValue);
    //   return user.save({
    //     validate: true,
    //     transaction,
    //   });
    // });
  }

  public async delete(id: number): Promise<void> {
    return this.sequelizeInstance.transaction(async (transaction) => this.userRepository.destroy({
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
