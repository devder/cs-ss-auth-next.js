import axios from "axios";
import { QueryResponse, handleRequest } from "./fetcher";

export const poster = async <T>(url: string, payload?: unknown): Promise<QueryResponse<T>> => {
  try {
    const request = () => axios.post(url, payload, { withCredentials: true }); // send the cookies to the server
    const { data } = await handleRequest(request);
    return [null, data];
  } catch (error) {
    return [error as string, null];
  }
};
