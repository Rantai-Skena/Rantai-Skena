"use client";

const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL
  ? process.env.NEXT_PUBLIC_SERVER_URL + "/api"
  : "http://localhost:3000/api";

type UploadResponse = {
  success: boolean;
  url?: string;
  error?: string;
};

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const json = (await res.json()) as UploadResponse;

  if (!res.ok || !json.success || !json.url) {
    throw new Error(json.error ?? "Upload gagal");
  }

  return json.url;
}
