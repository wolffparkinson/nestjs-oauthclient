# NestJS OAuth

## About

Collection of NestJS modules for OAuth 2.0

## Features

- Simple. Flexible. Easy to use.
- Perform OAuth 2.0 actions like
  - Grant access token
  - Verify access token
  - Refresh access token
  - Revoke tokens

## Packages

| Package                                               | Description                     | Version                                                                                                             |
| ----------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [`nestjs-oauthclient`](./packages/nestjs-oauthclient) | Collection of OAuth 2.0 modules | [![version](https://img.shields.io/npm/v/nestjs-oauthclient.svg)](https://www.npmjs.com/package/nestjs-oauthclient) |

## Installation

Install via `npm`/`yarn`/`pnpm`

```shell
npm i nestjs-oauthclient
```

## Usage

- Register `OauthModule` for your provider, e.g. `DiscordOauthModule`

```ts
import { DiscordOauthModule } from 'nestjs-oauthclient';

@Module({
  imports: [
    DiscordOauthModule.register({
      isGlobal: true,
      client: {
        id: 'your-client-id',
        secret: 'your-client-secret',
      },
    }),
  ],
})
export class AppModule {}
```

> `.registerAsync` is also available for async configuration

- Use `OauthService` from your OAuth provider, e.g. `DiscordOauthService`

```ts
import { DiscordOauthService } from 'nestjs-oauthclient';

@Controller('/oauth/discord')
export class AppController {
  constructor(private readonly discordOauth: DiscordOauthService) {}

  @Get('/')
  getUrl() {
    return this.discordOauth.authorizeURL({
      redirectUri: 'http://localhost:3000/oauth/discord/callback', //required
      state: 'some-random-state', // optional,
      scopes: ['identify', 'guilds'], // optional
    });
  }

  @Get('/callback')
  getToken(@Param('code') code: string, @Param('state') state?: string) {
    // Custom logic to verify state

    // Generate Token
    return this.discordOauth.getToken({
      code,
      scope: ['identify', 'guilds'],
      redirectUri: 'http://localhost:3000/oauth/discord/callback',
    });
  }
}
```

## Contribute

Contributions welcome! Read the [contribution guidelines](.github/CONTRIBUTING.md) first.

## License

[MIT License](LICENSE)
