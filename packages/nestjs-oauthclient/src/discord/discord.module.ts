import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './discord.module-definition';
import { DiscordOauthService } from './discord.service';

@Module({
  imports: [],
  providers: [DiscordOauthService],
  exports: [DiscordOauthService],
})
export class DiscordOauth2Module extends ConfigurableModuleClass {}
