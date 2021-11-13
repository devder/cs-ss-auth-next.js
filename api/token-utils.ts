import { AccessTokenPayload, Cookies, RefreshTokenPayload, UserDocument } from "@shared";
import jwt from "jsonwebtoken";
import { CookieOptions, Response } from "express";

enum TokenExpiration {
  Access = 5 * 60, // 5 minutes
  Refresh = 7 * 24 * 60 * 60, // 7 days
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
