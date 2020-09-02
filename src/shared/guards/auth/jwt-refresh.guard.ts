import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { MessageCodeError } from '../../errors';
import { UserService } from '../../../modules/users/user.service';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (req.headers.refresh_token) {
      const token = (req.headers.refresh_token as string).split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_REFRESH_KEY);

      const user = await this.userService.findOne({
        where: { id: decoded.id, email: decoded.email },
      });
      if (!user) throw new MessageCodeError('request:unauthorized');
      req.userInfo = user;
      return true;
    }
    throw new MessageCodeError('request:unauthorized');
  }
}
