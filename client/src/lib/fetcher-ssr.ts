import axios, { AxiosResponse, AxiosError } from "axios";
import { IncomingMessage, ServerResponse } from "http"; // these are provided by next.js SSR'
import env from "./environment";
import type { QueryResponse } from "./fetcher";

const refreshTokens = async (req: IncomingMessage, res: ServerResponse) => {
  const response: AxiosResponse = await axios.post(`${env.apiUrl}/refresh`, undefined, {
    headers: { cookie: req.headers.cookie! },
  });
  const cookies = response.headers["set-cookie"]!;

  req.headers.cookie = cookies[0];
  res.setHeader("set-cookie", cookies!);
};

const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  request: () => Promise<AxiosResponse>
): Promise<AxiosResponse> => {
  try {
    return await request();
  } catch (_e) {
    // come back to this
    let e: AxiosError = _e as AxiosError;
    if (e?.response?.status === 401) {
      await refreshTokens(req, res);
      return await request();
    }
    throw e;
  }
};

export const fetcherSSR = async <T>(
  req: IncomingMessage,
  res: ServerResponse,
  url: string
): Promise<QueryResponse<T>> => {
  try {
    const request = () => axios.get(url, { headers: { cookie: req.headers.cookie! } }); // send the cookies to the server
    const { data } = await handleRequest(req, res, request);
    return [null, data];
  } catch (error) {
    return [error as string, null];
  }
};
