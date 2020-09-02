import { JwtService } from '@nestjs/jwt';
import { omit } from 'lodash';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { MessageCodeError } from '../../shared';
import { IAuthService, IJwtOptions } from './interfaces/auth-service.interface';
import { UserService } from '../users/user.service';
import { UserStatusEnum } from '../../shared/enums/user-status.enum';
import { ProviderUserData } from './dto/provider-user-data.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { configService } from '../../shared/config/configService';
import { UserDto } from '../users/dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ProvidersEnum } from './enum/providers.enum';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {
  }

    private _accessOptions: IJwtOptions = {
      algorithm: 'HS256',
      expiresIn: configService.getJwtExpiration(),
      jwtid: process.env.JWT_ID || '',
      secret: configService.getJwtSecret(),
    };

  private _refreshOptions: IJwtOptions = {
    algorithm: 'HS256',
    expiresIn: configService.getJwtExpiration(true),
    jwtid: process.env.JWT_ID || '',
    secret: configService.getJwtSecret(true),
  };
  get refreshOptions(): IJwtOptions {
    return this._refreshOptions;
  }

  set refreshOptions(value: IJwtOptions) {
    this._refreshOptions.algorithm = value.algorithm;
  }
  get accessOptions(): IJwtOptions {
    return this._accessOptions;
  }

  set accessOptions(value: IJwtOptions) {
    this._accessOptions.algorithm = value.algorithm;
  }

  /** Public methods */

  /** Local user authorization */
  public async localLogin(credentials: { email: string; password: string }, res: Response)
      : Promise<UserDto> {
    const user = await this.getLocalUser(credentials);

    await this.tokenSign(user, res);
    return user;
  }

  /** Local user change password */
  public async changePassword(body: ChangePasswordDto): Promise<UserDto> {
    const user = await this.getLocalUser({ password: body.oldPassword, email: body.email });

    const updatedUser = this.userService.update(user.id,
      Object.assign(user, { hash: this.hashPassword(body.newPassword) }));
    return omit(updatedUser, ['hash']);
  }

  /** Social user authorization */
  async socialSign(userData: ProviderUserData, res: Response)
      : Promise<{user:UserDto, newUser: boolean}> {
    let newUser = false;
    let user = await this.userService.findByEmail(userData.email);

    if (!user) {
      newUser = true;
      user = await this.signIn(userData);
    }
    if (user.status === UserStatusEnum.BANNED) throw new MessageCodeError('user:banned');

    await this.tokenSign(user, res);
    return { user, newUser };
  }

  /** Add access and refresh token to headers */
  async tokenSign(user: UserDto, res: Response) {
    const payload = this.getJWTPayload(user);
    res.set('access_token', `Bearer ${this.jwtService.sign(payload, this._accessOptions)}`);
    res.set('refresh_token', `Bearer ${this.jwtService.sign(payload, this._refreshOptions)}`);
  }

  /** Private methods */
  // register user in DB
  private getJWTPayload(user: UserDto): JwtPayloadDto {
    return {
      id: user.id,
      email: user.email,
    };
  }

  /** Validate local user and return userData */
  private async getLocalUser(credentials:{ email: string, password: string }): Promise<UserDto> {
    const hash = this.hashPassword(credentials.password);

    const user = await this.userService.findOneWithPassword({
      where: {
        provider: ProvidersEnum.LOCAL,
        email: credentials.email,
      },
    });
    if (!user) throw new MessageCodeError('user:notFound');
    if (user.hash !== hash) throw new MessageCodeError('auth:login:invalidCredentials');
    if (user.status === UserStatusEnum.BANNED) throw new MessageCodeError('user:banned');
    return user;
  }

  private hashPassword(password: string): string {
    const id = crypto.createHmac('sha256', process.env.SECRET);
    id.update(password);
    return id.digest('hex');
  }
  /** Create user social user if it not exist */
  private async signIn(userInfo: ProviderUserData) {
    return this.userService.create({
      firstName: userInfo.firstName || userInfo.displayName.split(' ')[0],
      lastName: userInfo.lastName || userInfo.displayName.split(' ')[1],
      email: userInfo.email,
      provider: userInfo.provider,
      providerId: userInfo.id,
    });
  }
}
