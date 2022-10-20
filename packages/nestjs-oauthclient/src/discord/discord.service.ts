import { Inject, Injectable, Logger } from '@nestjs/common';
import { Oauth2ClientService } from '../common';

import { DiscordOauthModuleOptions } from './discord-options.interface';
import { MODULE_OPTIONS_TOKEN } from './discord.module-definition';

@Injectable()
export class DiscordOauthService extends Oauth2ClientService {
  private readonly logger = new Logger(DiscordOauthService.name);

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: DiscordOauthModuleOptions
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
}
