import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OauthStrategy } from 'src/modules/auth/strategies/oauth.strategy';
import { ProviderUserData } from 'src/modules/auth/dto/provider-user-data.dto';

@Injectable()
export class OAuthGuard implements CanActivate {
  constructor(
        private oauthStrategy: OauthStrategy,
        private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const next = context.switchToHttp().getNext();
    const provider = this.reflector.get<string>('provider', context.getHandler());

    // note: providerUserInfo - data from provider(not user from DB)
    const providerUserInfo: ProviderUserData = await this.oauthStrategy.verifyAgentData(
      req,
      res,
      next,
      provider,
    );
    req.userInfo = providerUserInfo;

    return !!req.userInfo;
  }
}
