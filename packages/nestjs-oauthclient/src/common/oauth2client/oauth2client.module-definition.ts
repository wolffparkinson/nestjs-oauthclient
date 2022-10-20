import { ConfigurableModuleBuilder } from '@nestjs/common';

export function createOauth2ClientModule<T>() {
  return new ConfigurableModuleBuilder<T>()
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      })
    )
    .build();
}
