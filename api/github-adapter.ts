import axios from "axios";

interface IGithubUser {
  id: number;
  name: string;
}

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  id: number;
  name: string;
}

const TOKEN_URL = "https://github.com/login/oauth/access_token";
const USER_URL = "https://api.github.com/user";

async function getAccessToken(code: string): Promise<string> {
  const response = await axios.post<IAccessTokenResponse>(
    TOKEN_URL,
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    {
      headers: { Accept: "application/json" },
    }
  );

  return response.data.access_token;
}

async function getUser(token: string): Promise<IGithubUser> {
  const response = await axios.get<IUserResponse>(USER_URL, { headers: { Authorization: `Bearer ${token}` } });

  return response.data as IGithubUser;
}

export async function getGithubUser(code: string) {
  const token = await getAccessToken(code);
  return getUser(token);
}
