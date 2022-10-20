import type { Oauth2ClientOptions } from '../common';

export type LineOauthModuleOptions = Omit<Oauth2ClientOptions, 'auth'> & {
  isGlobal?: boolean;
};
