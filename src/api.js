// Cliente de la API REST (Spring Boot).
// En desarrollo Vite redirige /api a localhost:8080 (vite.config.js);
// en producción nginx hace lo mismo hacia el contenedor del backend.
const BASE = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "chg_admin_token";

export class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // almacenamiento no disponible: la sesión dura lo que dure la pestaña
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const isForm = body instanceof FormData;
  if (body && !isForm) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor");
  }

  if (res.status === 401 && auth) {
    setToken(null);
    window.dispatchEvent(new Event("chg:unauthorized"));
  }
  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, data?.message || `Error ${res.status}`, data?.fields);
  }
  return data;
}

export const publicApi = {
  clients: () => request("/api/public/clients"),
  projects: () => request("/api/public/projects")
};

export const authApi = {
  async login(username, password) {
    const data = await request("/api/auth/login", { method: "POST", body: { username, password } });
    setToken(data.token);
    return data;
  },
  me: () => request("/api/auth/me", { auth: true }),
  logout: () => setToken(null)
};

function crud(resource) {
  const base = `/api/admin/${resource}`;
  return {
    list: () => request(base, { auth: true }),
    create: item => request(base, { method: "POST", body: item, auth: true }),
    update: (id, item) => request(`${base}/${id}`, { method: "PUT", body: item, auth: true }),
    remove: id => request(`${base}/${id}`, { method: "DELETE", auth: true })
  };
}

export const adminApi = {
  clients: crud("clients"),
  projects: crud("projects"),
  async upload(file) {
    const form = new FormData();
    form.append("file", file);
    const data = await request("/api/admin/uploads", { method: "POST", body: form, auth: true });
    return data.url;
  }
};
