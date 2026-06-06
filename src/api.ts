const API_BASE = import.meta.env.VITE_API_URL;

type ApiError = {
  error?: string;
};

function safeJsonParse(text: string): unknown {
  const trimmed = text.trim();
  if (!trimmed) {
    return null;
  }
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // --- GLOBAL AUTH GUARD ---
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/";
    throw new Error("Unauthorized");
  }
  // -------------------------

  const text = await response.text();
  const payload = safeJsonParse(text);

  if (!response.ok) {
    const isApiError = payload !== null && typeof payload === "object" && "error" in payload;
    const message = isApiError ? (payload as ApiError).error : undefined;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return payload as T;
}