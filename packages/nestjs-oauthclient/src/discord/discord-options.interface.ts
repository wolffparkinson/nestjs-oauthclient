import type { Oauth2ClientOptions } from '../common';

export type DiscordOauthModuleOptions = Omit<Oauth2ClientOptions, 'auth'> & {
  isGlobal?: boolean;
};
