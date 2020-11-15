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
import { MessageCodeError } from '../../../shared/errors';
import { UserStatusEnum } from '../../../shared/enums/user-status.enum';
import { ProvidersEnum } from '../../auth/enum/providers.enum';

@Table({ timestamps: true, tableName: 'users' })
export class User extends Model<User> {
    @Column({
      type: DataType.INTEGER,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    })
    public id: number;

    @Column({
      type: DataType.STRING(30),
      allowNull: true,
    })
    public firstName: string;

    @Column({
      type: DataType.STRING(30),
      allowNull: true,
    })
    public lastName: string;

    @Column({
      type: DataType.ENUM(),
      values: Object.values(UserStatusEnum),
      defaultValue: UserStatusEnum.ACTIVE,
    })
    public status: string;

    @Column({
      type: DataType.ENUM(),
      values: Object.values(ProvidersEnum),
      defaultValue: ProvidersEnum.GOOGLE,
      unique: 'unique',
    })
    public provider: string;

    @Column({
      type: DataType.STRING,
      allowNull: false,
      unique: 'unique',
    })
    public providerId: string;

    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    public email: string;

    @Column({
      type: DataType.STRING,
      allowNull: true,
    })
    public hash: string;

    @Column({
      type: DataType.INTEGER,
      allowNull: true,
    })
    public lastTimePasswordUpdate: number;

    @CreatedAt public createdAt: Date;

    @UpdatedAt public updatedAt: Date;

  // @BeforeValidate
  //   public static validateData(user: User, options: any) {
  //     if (!options.transaction) throw new Error('Missing transaction.');
  //     if (!user.firstName) throw new MessageCodeError('user:create:missingFirstName');
  //     if (!user.lastName) throw new MessageCodeError('user:create:missingLastName');
  //     if (!user.email) throw new MessageCodeError('user:create:missingEmail');
  //     if (user.provider === ProvidersEnum.LOCAL && !user.hash) {
  //       throw new MessageCodeError('user:create:missingPassword');
  //     }
  //     if (user.provider !== ProvidersEnum.LOCAL && !user.providerId) {
  //       throw new MessageCodeError('user:login:missingId');
  //     }
  //   }
}
