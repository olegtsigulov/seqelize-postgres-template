import * as passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-token';
import * as FacebookStrategy from 'passport-facebook-token';
import { Injectable } from '@nestjs/common';
import { configService } from '../../../shared/config/configService';
import { ProviderUserData } from '../dto/provider-user-data.dto';
import { MessageCodeError } from '../../../shared/errors';

@Injectable()
export class OauthStrategy {
    private passport;

    constructor() {
      this.passport = passport;

      this.passport.use(
        'google',
        new GoogleStrategy(
          configService.getGoogleOAuthCredentials(),
          this.getSocialFields,
        ),
      );
      this.passport.use(
        'facebook',
        new FacebookStrategy(
          configService.getFacebookOAuthCredentials(),
          this.getSocialFields,
        ),
      );
      // add here another providers, like Facebook etc.
    }

    public async verifyAgentData(req, res, next, provider): Promise<ProviderUserData> {
      return new Promise((resolve, reject) => {
        this.passport.authenticate(provider, async (data) => {
          if (!data || !data.fields) {
            return reject(
              new MessageCodeError('request:unauthorized'),
            );
          }
          return resolve({ ...data.fields });
        })(req, res, next);
      });
    }

    private getSocialFields(accessToken, refreshToken, profile, next) {
      const { provider } = profile;
      // eslint-disable-next-line @typescript-eslint/camelcase
      const {
        id, name, picture, email, given_name, family_name,
      } = profile._json;
      const avatar = picture || (profile.photos && profile.photos[0].value);
      const providerUserFields: ProviderUserData = {
        displayName: name,
        provider,
        avatar,
        id,
        email,
        // eslint-disable-next-line @typescript-eslint/camelcase
        firstName: given_name,
        // eslint-disable-next-line @typescript-eslint/camelcase
        lastName: family_name,
      };

      next({
        fields: providerUserFields,
      });
    }
}
