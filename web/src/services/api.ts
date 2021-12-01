import { BASE_URL } from "./consts"

export async function api<T>(partialUrl: string): Promise<T> {
  const url = `${BASE_URL}/${partialUrl}`;

  const response = await fetch(url);
  const resAsJson = await response.json() as T;

  return resAsJson;
}