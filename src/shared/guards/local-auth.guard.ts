import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private reflector: Reflector) {
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const provider = this.reflector.get<string>(
      'provider',
      context.getHandler(),
    );
    req.userData = await this.authService.verifyLocalAgentData(req, provider);

    return true;
    // if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {
    //   if (!user) throw new MessageCodeError('request:unauthorized');
    //   return true;
    // }
    // throw new MessageCodeError('request:unauthorized');
  }
}
