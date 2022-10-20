import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { catchError, firstValueFrom, map } from 'rxjs';
import type { AccessToken } from 'simple-oauth2';
import { Oauth2ClientService } from '../common';

import { LineOauthModuleOptions } from './line-options.interface';
import {
  VerifyAccessTokenResponse,
  GetProfileResponse,
  VerifyIdTokenResponse,
  GetUserInfoResponse,
} from './line.interface';
import { MODULE_OPTIONS_TOKEN } from './line.module-definition';

/**
 * API Reference : https://developers.line.biz/en/reference/line-login
 */
@Injectable()
export class LineOauthService extends Oauth2ClientService {
  private readonly logger = new Logger(LineOauthService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: LineOauthModuleOptions,
    private readonly axios: HttpService
  ) {
    const { isGlobal, ...oauth2ClientOptions } = options;
    super({
      ...oauth2ClientOptions,
      auth: {
        tokenHost: 'https://api.line.me',
        tokenPath: '/oauth2/v2.1/token',
        revokePath: '/oauth2/v2.1/revoke',
        authorizeHost: 'https://access.line.me',
        authorizePath: '/oauth2/v2.1/authorize',
      },
    });
  }

  /**
   * Issue access token
   *  - https://developers.line.biz/en/reference/line-login/#issue-access-token
   */
  // getToken() - Implemented via Oauth2clientService

  /**
   * Verify access token
   *  - https://developers.line.biz/en/reference/line-login/#verify-access-token
   */
  public async verifyAccessToken(accessToken: string | AccessToken) {
    const token =
      typeof accessToken === 'string'
        ? accessToken
        : accessToken.token['access_token'];

    return await firstValueFrom(
      this.axios
        .get<VerifyAccessTokenResponse>(
          'https://api.line.me/oauth2/v2.1/verify',
          {
            params: { access_token: token },
          }
        )
        .pipe(
          map((v) => {
            return {
              scope: v.data.scope,
              clientId: v.data.client_id,
              expiresIn: v.data.expires_in,
            };
          }),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          })
        )
    );
  }

  /**
   * Verify ID token
   *  - https://developers.line.biz/en/reference/line-login/#verify-id-token
   */
  public async verifyIdToken(options: {
    idToken: string;
    nonce?: string;
    userId: string;
  }) {
    const { idToken, userId, nonce } = options;

    return await firstValueFrom(
      this.axios
        .post<VerifyIdTokenResponse>(
          'https://api.line.me/oauth2/v2.1/verify',
          {
            id_token: idToken,
            user_id: userId,
            nonce,
          },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )
        .pipe(
          map((v) => v.data),
          catchError((e) => {
            throw new HttpException(e.response.data, e.response.status);
          })
        )
    );
  }

  /**
   * Get user information
   *  - Gets a user's ID, display name, and profile image. The scope required for the access token is different for the Get user profile endpoint
   *  - https://developers.line.biz/en/reference/line-login/#userinfo
   * @param accessToken access token with the openid scope
   * @returns GetProfileResponse
   */
  public async getUserInfo(
    accessToken: string | AccessToken
  ): Promise<GetUserInfoResponse> {
    const token =
      typeof accessToken === 'string'
        ? accessToken
        : accessToken.token['access_token'];

    return await firstValueFrom(
      this.axios
        .get<GetUserInfoResponse>('https://api.line.me/v2/userinfo', {
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

  /**
   * Get user profile
   *  - Gets a user's ID, display name, profile image, and status message. The scope required for the access token is different for the Get user information endpoint.
   *  - https://developers.line.biz/en/reference/line-login/#get-user-profile
   * @param accessToken access token with the profile scope
   * @returns GetProfileResponse
   */
  public async getUserProfile(
    accessToken: string | AccessToken
  ): Promise<GetProfileResponse> {
    const token =
      typeof accessToken === 'string'
        ? accessToken
        : accessToken.token['access_token'];

    return await firstValueFrom(
      this.axios
        .get<GetProfileResponse>('https://api.line.me/v2/profile', {
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
