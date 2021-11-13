import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { databaseClient } from "./database";
import { getGithubUser } from "./github-adapter";
import { buildTokens, setTokens } from "./token-utils";
import { getGithubUserByGithubId, createUser } from "./user-service";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(cookieParser()); // to read cookies from the request

// for kubernetes health checking
app.get("/", (req, res) => {
  res.send("api is healthy");
});

app.get("/github", async (req, res) => {
  // https://github.com/login/oauth/authorize?client_id=****&redirect_uri=http://localhost:3001/github?scope=user:email
  const { code } = req.query;

  const githubUser = await getGithubUser(code as string);
  let user = await getGithubUserByGithubId(githubUser.id);
  if (!user) user = await createUser(githubUser.id, githubUser.name);

  const { accessToken, refreshToken } = buildTokens(user);
  setTokens(res, accessToken, refreshToken);

  res.redirect(`${process.env.CLIENT_URL}/me`);
});

app.get("/refresh", async (req, res) => {});
app.get("/logout", (req, res) => {});
app.get("/logout-all", async (req, res) => {});
app.get("/me", async (req, res) => {});

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
