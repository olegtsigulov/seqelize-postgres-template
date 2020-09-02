import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jf from 'joiful';
import { OauthStrategy } from 'src/modules/auth/strategies/oauth.strategy';
import { ProviderUserData } from 'src/modules/auth/dto/provider-user-data.dto';
import { MessageCodeError } from '../../errors';

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
    const { error, value } = jf.validateAsClass(providerUserInfo, ProviderUserData);
    if (error) throw new MessageCodeError('validation:error', error.message);
    req.userInfo = value;

    return !!req.userInfo;
  }
}
