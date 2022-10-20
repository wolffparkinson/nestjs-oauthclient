import { createOauth2ClientModule } from '../common';
import type { LineOauthModuleOptions } from './line-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  createOauth2ClientModule<LineOauthModuleOptions>();
