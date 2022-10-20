import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './discord.module-definition';
import { DiscordOauthService } from './discord.service';

@Module({
  imports: [HttpModule],
  providers: [DiscordOauthService],
  exports: [DiscordOauthService],
})
export class DiscordOauthModule extends ConfigurableModuleClass {}
