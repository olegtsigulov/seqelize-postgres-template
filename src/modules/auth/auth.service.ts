import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { MessageCodeError } from '../../shared';
import { IAuthService, IJwtOptions } from './interfaces/auth-service.interface';
import { UserService } from '../users/user.service';
import { UserStatusEnum } from '../../shared/enums/user-status.enum';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private readonly userService: UserService) {
  }

    private _options: IJwtOptions = {
      algorithm: 'HS256',
      expiresIn: '2 days',
      jwtid: process.env.JWT_ID || '',
    };

    get options(): IJwtOptions {
      return this._options;
    }

    set options(value: IJwtOptions) {
      this._options.algorithm = value.algorithm;
    }

    public async sign(credentials: { email: string; password: string }): Promise<string> {
      const id = crypto.createHmac('sha256', process.env.SECRET);
      id.update(credentials.password);
      const hash = id.digest('hex');

      const user = await this.userService.findOne({
        where: {
          email: credentials.email,
          password: hash,
        },
      });

      if (!user) throw new MessageCodeError('user:notFound');
      if (user.status === UserStatusEnum.BANNED) throw new MessageCodeError('user:banned');

      const payload = {
        id: user.id,
        email: user.email,
      };

      return jwt.sign(payload, process.env.JWT_KEY || '', this._options);
    }
}
