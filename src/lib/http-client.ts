type Result<T> = {
  ok: boolean;
  data: T;
  response?: Response;
};

class HttpClient {
  async GET<T>(url: string): Promise<Result<T>> {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
      next: {
        revalidate: 3600,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Error fetching " + url, data);
      if (data.error) {
        throw new Error(data.error);
      } else if (data.message) {
        throw new Error(data.message);
      } else {
        throw new Error("Unable to perform operation");
      }
    }
    return { ok: response.ok, data: data, response: response };
  }

  async POST<T>(url: string, data?: T): Promise<Result<T>> {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    const map = await response.json();
    if (!response.ok) {
      console.error("Error fetching " + url, data);
      if (map.error) {
        throw new Error(map.error);
      } else if (map.message) {
        throw new Error(map.message);
      } else {
        throw new Error("Unable to perform operation");
      }
    }
    return { ok: response.ok, data: map, response: response };
  }

  async DELETE(url: string): Promise<Result<any>> {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    const response = await fetch(url, {
      method: "DELETE",
      headers: headers,
    });
    const map = await response.json();

    if (!response.ok) {
      console.error("Error fetching " + url, map);
      if (map.error) {
        throw new Error(map.error);
      } else if (map.message) {
        throw new Error(map.message);
      } else {
        throw new Error("Unable to perform operation");
      }
    }

    return { ok: response.ok, data: map, response: response };
  }
}

const httpClient = new HttpClient();

export { httpClient };
