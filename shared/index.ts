export interface UserDocument {
  id: string;
  name: string;
  tokenVersion: number;
  githubUserId: string;
}

export interface AccessTokenPayload {
  userId: string;
}

export interface RefreshTokenPayload {
  version: number;
  userId: string;
}

export enum Cookies {
  AccessToken = "access",
  RefreshToken = "refresh",
}
