import { JwtService } from '@nestjs/jwt';
import { omit, find } from 'lodash';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
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
import { CreateLocalUserDto } from './dto/create-local-user.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly userService: UserService,
              private jwtService: JwtService,
              private readonly mailerService: MailerService) {
  }

  private _forgotOptions: IJwtOptions = {
    algorithm: 'HS256',
    expiresIn: configService.getJwtExpiration(),
    jwtid: process.env.JWT_ID || '',
    secret: process.env.FORGOT_HASH,
  };

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

    this.tokenSign(user, res);
    return omit(user, ['hash']);
  }

  /** Local user change password */
  public async changePassword(body: ChangePasswordDto, res: Response): Promise<UserDto> {
    const user = await this.getLocalUser({ password: body.oldPassword, email: body.email });

    await this.userService.update(user.id,
      {
        hash: this.hashData(body.newPassword),
        lastTimePasswordUpdate: Math.round(moment.utc().valueOf() / 1000),
      });
    this.tokenSign(user, res);
    return omit(user, ['hash']);
  }

  /** Social user registration */
  public async localSignUp(
    userParams:CreateLocalUserDto, res: Response,
  ): Promise<UserDto> {
    const hash = this.hashData(userParams.password);
    const providerId = this.hashData(userParams.email);
    const user = await this.userService.create({
      hash,
      email: userParams.email,
      firstName: userParams.firstName,
      lastName: userParams.lastName,
      provider: ProvidersEnum.LOCAL,
      providerId,
    });
    this.tokenSign(user, res);
    return omit(user.toJSON(), ['hash']);
  }
  /** Social user authorization */
  async socialSign(userData: ProviderUserData, res: Response)
      : Promise<{user:UserDto, newUser: boolean}> {
    let newUser = false;
    let user = await this.userService.findOne(
      { where: { provider: userData.provider, providerId: userData.id } },
    );

    if (!user) {
      newUser = true;
      user = await this.signIn(userData);
    }
    if (user.status === UserStatusEnum.BANNED) throw new MessageCodeError('user:banned');

    this.tokenSign(user, res);
    return { user, newUser };
  }

  /** user forgot password */
  public async forgotPassword(email: string):Promise<boolean> {
    const user = await this.userService.findOne({ where: { email } });
    if (!user) throw new MessageCodeError('user:notFound');

    const token = this.jwtService.sign(this.getJWTPayload(user), this._forgotOptions);

    await this.mailerService.sendForgotPassword(
      email,
      `${process.env.MAIN_LINK}/recovery-password?id=${token}`,
    );
    return true;
  }

  public async saveNewPassword(body: SetNewPasswordDto, res: Response) {
    try {
      jwt.verify(body.id, process.env.FORGOT_HASH);
    } catch (e) {
      throw new MessageCodeError('request:unauthorized');
    }

    const decoded: any = jwt.decode(body.id);
    const user = await this.userService.findOne({ where: { email: decoded.email } });
    if (!user) throw new MessageCodeError('user:notFound');

    await this.userService.update(user.id,
      {
        hash: this.hashData(body.password),
        lastTimePasswordUpdate: Math.round(moment.utc().valueOf() / 1000),
      });
    this.tokenSign(user, res);
    return user.get({ plain: true });
  }

  /** Add access and refresh token to headers */
  tokenSign(user: UserDto, res: Response) {
    const payload = this.getJWTPayload(user);
    res.set('access_token', `Bearer ${this.jwtService.sign(payload, this._accessOptions)}`);
    res.set('refresh_token', `Bearer ${this.jwtService.sign(payload, this._refreshOptions)}`);
  }

  /** Private methods */
  // register user in DB
  private getJWTPayload(user: UserDto): JwtPayloadDto {
    return {
      id: user.id,
      providerId: user.providerId,
    };
  }

  /** Validate local user and return userData */
  private async getLocalUser(credentials:{ email: string, password: string }): Promise<UserDto> {
    const hash = this.hashData(credentials.password);
    const providerId = this.hashData(credentials.email);

    const user = await this.userService.findOneWithPassword({
      where: { provider: ProvidersEnum.LOCAL, providerId },
    });
    if (!user) throw new MessageCodeError('user:notFound');
    if (user.hash !== hash) throw new MessageCodeError('auth:login:invalidCredentials');
    if (user.status === UserStatusEnum.BANNED) throw new MessageCodeError('user:banned');
    return user;
  }

  private hashData(password: string): string {
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
