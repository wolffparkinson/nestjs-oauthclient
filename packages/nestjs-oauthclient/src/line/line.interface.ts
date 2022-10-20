// https://developers.line.biz/en/reference/line-login/#verify-access-token
export interface VerifyAccessTokenResponse {
  // Permissions granted to the access token. To learn more about scopes, see [Scopes](https://developers.line.biz/en/docs/line-login/integrate-line-login/#scopes)
  scope: string;
  // Channel ID for which the access token is issued
  client_id: string;
  // Number of seconds until the access token expires
  expires_in: number;
}

// https://developers.line.biz/en/reference/line-login/#verify-id-token
export interface VerifyIdTokenResponse {
  // URL used to generate the ID token
  iss: string;
  // User ID for which the ID token was generated.
  sub: string;
  // Channel ID
  aud: string;
  // The expiry date of the ID token in UNIX time.
  exp: number;
  // Time when the ID token was generated in UNIX time.
  iat: number;
  // Time the user was authenticated in UNIX time. Not included if the max_age value wasn't specified in the authorization request.
  auth_time?: number;
  // The nonce value specified in the authorization URL. Not included if the nonce value wasn't specified in the authorization request.
  nonce?: string;
  /**
   * A list of authentication methods used by the user. Not included in the payload under certain conditions.
   * One or more of:
   *  - pwd: Log in with email and password
   *  - lineautologin: LINE automatic login (including through LINE SDK)
   *  - lineqr: Log in with QR code
   *  -linesso: Log in with single sign-on
   */
  amr?: string[];
  // User's display name. Not included if the profile scope wasn't specified in the authorization request.
  name?: string;
  // User's profile image URL. Not included if the profile scope wasn't specified in the authorization request.
  picture?: string;
  // User's email address. Not included if the email scope wasn't specified in the authorization request.
  email?: string;
}

// https://developers.line.biz/en/reference/line-login/#userinfo
// Requires an access token with the openid scope
export interface GetUserInfoResponse {
  // UserID
  sub: string;
  // User's display name. Not included if the profile scope wasn't specified in the authorization request.
  name?: string;
  // User's profile image URL. Not included if the profile scope wasn't specified in the authorization request.
  picture?: string;
}

// https://developers.line.biz/en/reference/line-login/#get-user-profile
// Requires an access token with the profile scope
export interface GetProfileResponse {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage?: string;
}
