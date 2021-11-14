import axios, { AxiosResponse, AxiosError } from "axios";
import env from "./environment";

export type QueryResponse<T> = [error: string | null, data: T | null];

async function refreshTokens() {
  await axios.post(`${env.apiUrl}/refresh`, undefined, { withCredentials: true });
}

const handleRequest = async (request: () => Promise<AxiosResponse>): Promise<AxiosResponse> => {
  try {
    return await request();
  } catch (_e) {
    // come back to this
    let e: AxiosError = _e as AxiosError;
    if (e?.response?.status === 401) {
      await refreshTokens();
      return await request();
    }
    throw e;
  }
};

export const fetcher = async <T>(url: string): Promise<QueryResponse<T>> => {
  try {
    const request = () => axios.get(url, { withCredentials: true }); // send the cookies to the server
    const { data } = await handleRequest(request);
    return [null, data];
  } catch (error) {
    return [error as string, null];
  }
};
