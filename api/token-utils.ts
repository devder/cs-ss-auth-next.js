import { AccessToken, AccessTokenPayload, Cookies, RefreshToken, RefreshTokenPayload, UserDocument } from "@shared";
import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";

enum TokenExpiration {
  Access = 5 * 60, // 5 minutes
  Refresh = 7 * 24 * 60 * 60, // 7 days
  RefreshIfLessThan = 4 * 24 * 60 * 60, // 4 days
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;
const isProduction = process.env.NODE_ENV === "production";

const defaultCookieoptions: CookieOptions = {
  httpOnly: true, // set to true so that javascript cannot access the cookies
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  domain: process.env.DOMAIN,
  path: "/", // makes the cookies available to all pages
};

const accessTokenCookieOptions: CookieOptions = {
  ...defaultCookieoptions,
  maxAge: TokenExpiration.Access * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...defaultCookieoptions,
  maxAge: TokenExpiration.Refresh * 1000,
};

function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, accessTokenSecret, { expiresIn: TokenExpiration.Access });
}

function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, refreshTokenSecret, { expiresIn: TokenExpiration.Refresh });
}

export function buildTokens(user: UserDocument) {
  const accessPayload: AccessTokenPayload = { userId: user.id };
  const refreshPayload: RefreshTokenPayload = { userId: user.id, version: user.tokenVersion };

  const accessToken = signAccessToken(accessPayload);
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

  return { accessToken, refreshToken };
}

export function setTokens(res: Response, access: string, refresh?: string) {
  res.cookie(Cookies.AccessToken, access, accessTokenCookieOptions);
  if (refresh) res.cookie(Cookies.RefreshToken, access, refreshTokenCookieOptions);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, refreshTokenSecret) as RefreshToken;
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, accessTokenSecret) as AccessToken;
  } catch (error) {
    console.error(error);
  }
}

export function refreshTokens(current: RefreshToken, tokenVersion: number) {
  if (tokenVersion !== current.version) throw "Token Revoked";

  const accessPayload: AccessTokenPayload = { userId: current.userId };
  const accessToken = signAccessToken(accessPayload);

  let refreshPayload: RefreshTokenPayload | undefined;
  const expiration = new Date(current.exp * 1000);
  const now = new Date();
  const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000;

  if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
    refreshPayload = { userId: current.userId, version: tokenVersion };
  }
  const refreshToken = refreshPayload && signRefreshToken(refreshPayload);

  return { refreshToken, accessToken };
}

export function clearTokens(res: Response): void {
  res.cookie(Cookies.AccessToken, "", { ...defaultCookieoptions, maxAge: 0 });
  res.cookie(Cookies.RefreshToken, "", { ...defaultCookieoptions, maxAge: 0 });
}
