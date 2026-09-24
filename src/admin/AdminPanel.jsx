import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ExternalLink, Eye, EyeOff, FolderKanban, ImageOff, LogOut, Pencil, Plus, Trash2, Users
} from "lucide-react";
import { adminApi, authApi, getToken } from "../api";
import EditorModal from "./EditorModal";

const TABS = {
  projects: { label: "Desarrollos", singular: "desarrollo", icon: FolderKanban, api: adminApi.projects },
  clients: { label: "Clientes", singular: "cliente", icon: Users, api: adminApi.clients }
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(Boolean(getToken()));
  const [tab, setTab] = useState("projects");
  const [data, setData] = useState({ projects: [], clients: [] });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // { item } — item null = nuevo
  const [toast, setToast] = useState(null);

  const notify = (message, kind = "ok") => {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 3200);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [projects, clients] = await Promise.all([adminApi.projects.list(), adminApi.clients.list()]);
      setData({ projects, clients });
    } catch (err) {
      if (err.status !== 401) notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const onUnauthorized = () => setAuthed(false);
    window.addEventListener("chg:unauthorized", onUnauthorized);
    if (authed) load();
    return () => window.removeEventListener("chg:unauthorized", onUnauthorized);
  }, [authed, load]);

  if (!authed) return <Navigate to="/admin/login" replace />;

  const { api, singular, label } = TABS[tab];
  const items = data[tab];
  const replaceItems = next => setData(d => ({ ...d, [tab]: next }));

  const save = async form => {
    const saved = editing.item ? await api.update(editing.item.id, form) : await api.create(form);
    replaceItems(editing.item ? items.map(x => (x.id === saved.id ? saved : x)) : [...items, saved]);
    setEditing(null);
    notify(editing.item ? "Cambios guardados" : `${capitalize(singular)} agregado`);
  };

  const remove = async item => {
    const name = item.title || item.name;
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.remove(item.id);
      replaceItems(items.filter(x => x.id !== item.id));
      notify(`"${name}" eliminado`);
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const toggleActive = async item => {
    try {
      const saved = await api.update(item.id, { ...item, active: !item.active });
      replaceItems(items.map(x => (x.id === saved.id ? saved : x)));
    } catch (err) {
      notify(err.message, "error");
    }
  };

  const logout = () => {
    authApi.logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin">
      <header className="admin-bar">
        <div className="admin-container admin-bar-inner">
          <img src="/logo-mark-light.png" alt="CHG Desarrollo" />
          <div className="admin-bar-actions">
            <a href="/" target="_blank" rel="noreferrer"><ExternalLink size={15} /> Ver sitio</a>
            <button onClick={logout}><LogOut size={15} /> Salir</button>
          </div>
        </div>
      </header>

      <main className="admin-container admin-main">
        <div className="admin-head">
          <div>
            <span className="kicker dark">Panel de contenidos</span>
            <h1 className="display">Administración</h1>
            <p>Los cambios se publican en la landing de inmediato.</p>
          </div>
          <div className="admin-stats">
            <div><strong>{data.projects.length}</strong><span>Desarrollos</span></div>
            <div><strong>{data.clients.length}</strong><span>Clientes</span></div>
          </div>
        </div>

        <div className="admin-toolbar">
          <div className="admin-tabs" role="tablist">
            {Object.entries(TABS).map(([key, { label: tabLabel, icon: Icon }]) => (
              <button key={key} role="tab" aria-selected={tab === key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
                <Icon size={16} /> {tabLabel}
              </button>
            ))}
          </div>
          <button className="btn btn-dark btn-sm" onClick={() => setEditing({ item: null })}>
            <Plus size={16} /> Agregar {singular}
          </button>
        </div>

        <div className="table-wrap">
          {loading ? (
            <p className="table-empty">Cargando…</p>
          ) : items.length === 0 ? (
            <p className="table-empty">Aún no hay {label.toLowerCase()}. Usa “Agregar {singular}” para crear el primero.</p>
          ) : tab === "projects" ? (
            <ProjectsTable items={items} onEdit={item => setEditing({ item })} onDelete={remove} onToggle={toggleActive} />
          ) : (
            <ClientsTable items={items} onEdit={item => setEditing({ item })} onDelete={remove} onToggle={toggleActive} />
          )}
        </div>
      </main>

      {editing && (
        <EditorModal
          type={tab}
          item={editing.item}
          nextOrder={items.reduce((max, x) => Math.max(max, x.sortOrder), 0) + 1}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}

      {toast && <div className={`toast ${toast.kind}`} role="status">{toast.message}</div>}
    </div>
  );
}

function Thumb({ src, contain = false }) {
  return (
    <div className={`thumb ${contain ? "contain" : ""}`}>
      {src ? <img src={src} alt="" /> : <ImageOff size={18} />}
    </div>
  );
}

function StatusBadge({ item, onToggle }) {
  return (
    <button className={`status ${item.active ? "on" : "off"}`} onClick={() => onToggle(item)}
      title={item.active ? "Visible en la landing. Clic para ocultar." : "Oculto. Clic para publicar."}>
      {item.active ? <Eye size={13} /> : <EyeOff size={13} />}
      {item.active ? "Activo" : "Oculto"}
    </button>
  );
}

function RowActions({ item, onEdit, onDelete }) {
  return (
    <div className="row-actions">
      <button onClick={() => onEdit(item)}><Pencil size={14} /> Editar</button>
      <button className="danger" onClick={() => onDelete(item)} aria-label="Eliminar"><Trash2 size={14} /></button>
    </div>
  );
}

function ProjectsTable({ items, onEdit, onDelete, onToggle }) {
  return (
    <table className="data-table">
      <thead>
        <tr><th>Imagen</th><th>Proyecto</th><th>Tecnologías</th><th>Demo</th><th>Estado</th><th className="right">Acciones</th></tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td data-label="Imagen"><Thumb src={item.imageUrl} /></td>
            <td data-label="Proyecto"><strong>{item.title}</strong><small>{item.category || "Sin categoría"}</small></td>
            <td data-label="Tecnologías">{item.technologies.join(" / ") || "—"}</td>
            <td data-label="Demo">{item.demoUrl ? <a className="cell-link" href={item.demoUrl} target="_blank" rel="noreferrer">Ver <ExternalLink size={12} /></a> : "—"}</td>
            <td data-label="Estado"><StatusBadge item={item} onToggle={onToggle} /></td>
            <td className="right"><RowActions item={item} onEdit={onEdit} onDelete={onDelete} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ClientsTable({ items, onEdit, onDelete, onToggle }) {
  return (
    <table className="data-table">
      <thead>
        <tr><th>Logo</th><th>Cliente</th><th>Web</th><th>Estado</th><th className="right">Acciones</th></tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            <td data-label="Logo"><Thumb src={item.logoUrl} contain /></td>
            <td data-label="Cliente"><strong>{item.name}</strong>{item.description && <small>{item.description}</small>}</td>
            <td data-label="Web">{item.website ? <a className="cell-link" href={item.website} target="_blank" rel="noreferrer">{hostOf(item.website)} <ExternalLink size={12} /></a> : "—"}</td>
            <td data-label="Estado"><StatusBadge item={item} onToggle={onToggle} /></td>
            <td className="right"><RowActions item={item} onEdit={onEdit} onDelete={onDelete} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function hostOf(url) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
