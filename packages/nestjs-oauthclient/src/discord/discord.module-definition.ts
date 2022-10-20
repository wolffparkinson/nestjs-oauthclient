import { createOauth2ClientModule } from '../common';
import type { DiscordOauthModuleOptions } from './discord-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  createOauth2ClientModule<DiscordOauthModuleOptions>();
