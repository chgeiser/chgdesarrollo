import { defaultClients, defaultProjects } from "./data";

const CLIENTS_KEY = "chgdesarrollo_clients";
const PROJECTS_KEY = "chgdesarrollo_projects";

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function getClients() {
  return read(CLIENTS_KEY, defaultClients);
}

export function getProjects() {
  return read(PROJECTS_KEY, defaultProjects);
}

export function saveClients(items) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(items));
}

export function saveProjects(items) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(items));
}

export function resetContent() {
  localStorage.removeItem(CLIENTS_KEY);
  localStorage.removeItem(PROJECTS_KEY);
}

export function makeId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}