import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './line.module-definition';
import { LineOauthService } from './line.service';

@Module({
  imports: [HttpModule],
  providers: [LineOauthService],
  exports: [LineOauthService],
})
export class LineOauthModule extends ConfigurableModuleClass {}
