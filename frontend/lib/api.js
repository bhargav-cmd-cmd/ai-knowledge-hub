const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail || JSON.stringify(data);
    } catch (e) {}
    throw new Error(detail);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/api/auth/me"),
  listDocuments: () => request("/api/documents"),
  getDocument: (id) => request(`/api/documents/${id}`),
  deleteDocument: (id) => request(`/api/documents/${id}`, { method: "DELETE" }),
  uploadDocument: async (file) => {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_BASE}/api/documents/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) {
      let detail = res.statusText;
      try { const d = await res.json(); detail = d.detail || detail; } catch (e) {}
      throw new Error(detail);
    }
    return res.json();
  },
  search: (body) => request("/api/search", { method: "POST", body: JSON.stringify(body) }),
  ask: (body) => request("/api/qa/ask", { method: "POST", body: JSON.stringify(body) }),
  chatHistory: (documentId) =>
    request(`/api/chat/history${documentId ? `?document_id=${documentId}` : ""}`),
  clearChat: (documentId) =>
    request(`/api/chat/history${documentId ? `?document_id=${documentId}` : ""}`, { method: "DELETE" }),
};
