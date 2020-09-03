import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';
import moment = require('moment');
import { UserService } from '../../../modules/users/user.service';
import { MessageCodeError } from '../../errors';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly userService: UserService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (req.headers.authorization) {
      const token = (req.headers.authorization as string).split(' ')[1];
      const decoded: any = jwt.decode(token);
      try {
        jwt.verify(token, process.env.JWT_ACCESS_KEY);
      } catch (error) {
        if (error.message !== 'jwt expired' || error.expiredAt < moment.utc().subtract(1, 'minutes')) {
          return false;
        }
      }

      const user = await this.userService.findOne({
        where: { id: decoded.id, providerId: decoded.providerId },
      });
      if (!user) throw new MessageCodeError('request:unauthorized');
      if (user.lastTimePasswordUpdate && user.lastTimePasswordUpdate < decoded.iat) {
        throw new MessageCodeError('request:unauthorized');
      }
      return true;
    }
    throw new MessageCodeError('request:unauthorized');
  }
}
