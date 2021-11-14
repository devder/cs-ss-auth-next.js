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

export interface AccessToken extends AccessTokenPayload {
  exp: number;
}

export interface RefreshToken extends RefreshTokenPayload {
  exp: number;
}

export interface Message {
  text: string;
  userId: string;
}
