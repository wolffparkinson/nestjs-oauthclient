import { HttpException } from '@nestjs/common';
import {
  AccessToken,
  AuthorizationCode,
  AuthorizationTokenConfig,
  Token,
} from 'simple-oauth2';
import type { Oauth2ClientOptions } from './oauth2client.options';

export abstract class Oauth2ClientService {
  private readonly client: AuthorizationCode;
  constructor(private readonly config: Oauth2ClientOptions) {
    this.client = new AuthorizationCode(config);
  }

  /**
   * Get a valid redirect URL used to redirect users to an authorization page
   *
   * @param params
   * @param params.redirectURI String representing the registered application URI where the user is redirected after authentication
   * @param params.scope String or array of strings representing the application privileges
   * @param params.state String representing an opaque value used by the client to main the state between the request and the callback
   *
   * @return the absolute authorization url
   */
  public authorizeURL(options: AuthorizationUrlOptions): string {
    const { redirectUri, scope, state } = options;
    return this.client.authorizeURL({
      redirect_uri: redirectUri,
      scope,
      state,
    });
  }

  /**
   * Requests and returns an access token from the authorization server
   *
   * @param params
   * @param params.code Authorization code received by the callback URL
   * @param params.redirectURI String representing the registered application URI where the user is redirected after authentication
   * @param [params.scope] String or array of strings representing the application privileges
   */
  public async getToken(
    options: AuthorizationTokenConfig
  ): Promise<AccessToken> {
    try {
      return await this.client.getToken(options);
    } catch (error: any) {
      if (typeof error !== 'object') throw error;
      if (!error.isBoom) throw new Error(error.message);
      throw new HttpException(error.message, error?.output?.statusCode ?? 500);
    }
  }

  /**
   * Creates a new access token by providing a token object as specified by RFC6750.
   * @param token
   */
  public createToken(token: Token): AccessToken {
    return this.client.createToken(token);
  }
}

interface AuthorizationUrlOptions {
  redirectUri: string;
  scope?: string | string[];
  state?: string;
}
