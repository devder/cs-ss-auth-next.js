import { Cookies } from "@shared";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { authMiddleware } from "./auth-middleware";

import { databaseClient } from "./database";
import { getGithubUser } from "./github-adapter";
import { buildTokens, clearTokens, refreshTokens, setTokens, verifyRefreshToken } from "./token-utils";
import { getGithubUserByGithubId, createUser, getUserById, increaseTokenVersion } from "./user-service";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser()); // to read cookies from the request

// for kubernetes health checking
app.get("/", (req, res) => {
  res.send("api is healthy");
});

app.get("/github", async (req: Request, res: Response) => {
  // https://github.com/login/oauth/authorize?client_id=****&redirect_uri=http://localhost:3001/github?scope=user:email
  const { code } = req.query;

  const githubUser = await getGithubUser(code as string);
  let user = await getGithubUserByGithubId(githubUser.id);
  if (!user) user = await createUser(githubUser.id, githubUser.name);

  const { accessToken, refreshToken } = buildTokens(user);
  setTokens(res, accessToken, refreshToken);

  res.redirect(`${process.env.CLIENT_URL}/me`);
});

app.post("/refresh", async (req: Request, res: Response) => {
  // take the exisiting token and generate a new refresh token
  try {
    const current = verifyRefreshToken(req.cookies[Cookies.RefreshToken]);
    const user = await getUserById(current.userId);
    if (!user) throw "User not Found";
    const { accessToken, refreshToken } = refreshTokens(current, user.tokenVersion);
    setTokens(res, accessToken, refreshToken);
  } catch (error) {
    clearTokens(res);
  }
});

app.post("/logout", authMiddleware, (req: Request, res: Response) => {
  clearTokens(res);
  res.end();
});

app.post("/logout-all", authMiddleware, async (req: Request, res: Response) => {
  await increaseTokenVersion(res.locals.token.userId); // revoke the refreshToken

  clearTokens(res);
  res.end();
});

app.get("/me", authMiddleware, async (req: Request, res: Response) => {
  const user = await getUserById(res.locals.token.userId);
  res.json(user);
});

async function main() {
  try {
    await databaseClient.connect();
    console.log("Connected to database");
  } catch (error) {
    console.error(error);
  }
  app.listen(port, () => console.log(`app is running on port ${port}`));
}

main();
