import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AccessToken } from 'simple-oauth2';
import { Oauth2ClientService } from '../common';

import { DiscordOauthModuleOptions } from './discord-options.interface';
import { GetUserResponse } from './discord.interface';
import { MODULE_OPTIONS_TOKEN } from './discord.module-definition';

@Injectable()
export class DiscordOauthService extends Oauth2ClientService {
  private readonly restUrl = 'https://discord.com/api/v10';
  private readonly logger = new Logger(DiscordOauthService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: DiscordOauthModuleOptions,
    private readonly axios: HttpService
  ) {
    const { isGlobal, ...oauth2ClientOptions } = options;
    super({
      ...oauth2ClientOptions,
      auth: {
        tokenHost: 'https://discord.com',
        tokenPath: '/api/oauth2/token',
        revokePath: '/api/oauth2/token/revoke',
        authorizeHost: 'https://discord.com',
        authorizePath: '/oauth2/authorize',
      },
    });
  }

  /**
   * Get current user
   *  - Returns the user object of the requester's account. For OAuth2, this requires the identify scope, which will return the object without an email, and optionally the email scope, which returns the object with an email.
   *  - https://discord.com/developers/docs/resources/user#get-current-user
   * @param accessToken access token with the identify scope
   * @returns GetUserResponse
   */
  public async getUser(accessToken: string | AccessToken) {
    const token =
      typeof accessToken === 'string'
        ? accessToken
        : accessToken.token['access_token'];

    return await firstValueFrom(
      this.axios
        .get<GetUserResponse>(`${this.restUrl}/users/@me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          map((v) => v.data),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          })
        )
    );
  }
}
