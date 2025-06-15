import { DATASOURCE_URL } from "./urls";

const defaultHeaders = {
  "Content-Type": "application/json",
};

export const POST = async (route: string, body?: any) => {
  const url = DATASOURCE_URL + route;
  console.log(body)
  return fetch(url, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(body),
  }).then((response) => {
    return response.json()
      .then((res) => {
        if(!response.ok) {
          throw new Error(res.message);
        }
        return res;
      })
  })
};

export const POST_UPLOAD = async (
  url: string,
  body: unknown,
  opts: Omit<RequestInit,'body'|'method'> = {}
) => {
  const isForm = body instanceof FormData;
  const headers: Record<string,string> = { ...(opts.headers as any) };

  if (!isForm) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  // if it is FormData, leave headers alone so the browser can
  // automatically set multipart/form-data; boundary=…

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: body as BodyInit,
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}


export const GET = async (route: string) => {
  const url = DATASOURCE_URL + route;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`GET request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in GET request:", error);
    throw error;
  }
};

export const PUT = async (route: string, body: any) => {
  const url = DATASOURCE_URL + route;
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: defaultHeaders,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`PUT request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in PUT request:", error);
    throw error;
  }
};

export const DELETE = async (route: string) => {
  const url = DATASOURCE_URL + route;
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(`DELETE request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in DELETE request:", error);
    throw error;
  }
};

export const mapToQueryParams = (route: string, params: Record<string, string | number | boolean>) => {
  const queryParams = new URLSearchParams();
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      queryParams.append(key, String(params[key]));
    }
  }
  return `${route}?${queryParams.toString()}`;
}