"use client";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL
  ? process.env.NEXT_PUBLIC_SERVER_URL + "/api"
  : "http://localhost:3000/api";

type ApiSuccess<T> = { success: true; data: T };
type ApiError = { success: false; error: string };

async function handleResponse<T>(res: Response): Promise<T> {
  let json: ApiSuccess<T> | ApiError;

  try {
    json = (await res.json()) as ApiSuccess<T> | ApiError;
  } catch {
    throw new Error("Failed to parse server response: " + res.statusText);
  }

  if (!res.ok || !json.success) {
    throw new Error(
      "error" in json && json.error
        ? json.error
        : `Request failed with status ${res.status}`,
    );
  }

  return json.data;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include",
  });

  return handleResponse<T>(res);
}

export async function apiPost<T, B = unknown>(
  path: string,
  body: B,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}

export async function apiPatch<T, B = unknown>(
  path: string,
  body: B,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return handleResponse<T>(res);
}
