export interface SWRError extends Error {
  status: number;
  message: string;
}

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  try {
    if (!res.ok) {
      const error = await res.text();
      const body = JSON.parse(error);
      const err = new Error(error) as SWRError;
      err.status = res.status;
      err.message = body?.message;
      console.error(err);
      throw err;
    }
  } catch (error) {
    console.error("error[]", error);
    if (res.body) {
      const body = await res.json();
      throw body;
    }
    throw error;
  }

  return res.json();
}
