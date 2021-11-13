import { NextFunction, Response, Request } from "express";

import { Cookies } from "@shared";

import { verifyAccessToken } from "./token-utils";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = verifyAccessToken(req.cookies[Cookies.AccessToken]);
  if (!token) {
    res.status(401);
    return next(new Error("Not Signed in"));
  }

  // stroe the token on the response object such that the next middleware can access it
  res.locals.token = token;

  next();
}
