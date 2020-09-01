import * as crypto from 'crypto';
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BeforeValidate,
  BeforeCreate,
} from 'sequelize-typescript';
import { MessageCodeError } from '../../shared/errors';
import { UserStatusEnum } from '../../shared/enums/user-status.enum';

@Table({ timestamps: true, tableName: 'users' })
export class User extends Model<User> {
    @Column({
      type: DataType.NUMBER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      primaryKey: true,
    })
    public id: number;

    @Column({
      type: DataType.CHAR(30),
      allowNull: false,
    })
    public firstName: string;

    @Column({
      type: DataType.CHAR(30),
      allowNull: false,
    })
    public lastName: string;

    @Column({
      type: DataType.CHAR(30),
      allowNull: false,
      values: Object.values(UserStatusEnum),
      defaultValue: UserStatusEnum.ACTIVE,
    })
    public status: string;

    @Column({
      type: DataType.CHAR(100),
      allowNull: false,
      unique: true,
    })
    public email: string;

    @Column({
      type: DataType.TEXT,
      allowNull: false,
    })
    public password: string;

    @Column({ type: DataType.DATE })
    public birthday: Date;

    @CreatedAt public createdAt: Date;

    @UpdatedAt public updatedAt: Date;

    @DeletedAt public deletedAt: Date;

    @BeforeValidate
    public static validateData(user: User, options: any) {
      if (!options.transaction) throw new Error('Missing transaction.');
      if (!user.firstName) throw new MessageCodeError('user:create:missingFirstName');
      if (!user.lastName) throw new MessageCodeError('user:create:missingLastName');
      if (!user.email) throw new MessageCodeError('user:create:missingEmail');
      if (!user.password) throw new MessageCodeError('user:create:missingPassword');
    }

    @BeforeCreate
    public static async hashPassword(user: User, options: any) {
      if (!options.transaction) throw new Error('Missing transaction.');

      user.password = crypto.createHmac('sha256', user.password).digest('hex');
    }
}
