import React, { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Save, Trash2, X } from "lucide-react";
import { adminApi } from "../api";

const emptyProject = { title: "", description: "", imageUrl: "", demoUrl: "", category: "", technologies: [], active: true };
const emptyClient = { name: "", logoUrl: "", website: "", description: "", active: true };

export default function EditorModal({ type, item, nextOrder, onSave, onClose }) {
  const isProject = type === "projects";
  const [form, setForm] = useState(() => ({
    ...(isProject ? emptyProject : emptyClient),
    sortOrder: nextOrder,
    ...item
  }));
  const [techInput, setTechInput] = useState((form.technologies || []).join(", "));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage("");
    const payload = {
      ...form,
      sortOrder: Number(form.sortOrder) || 0,
      ...(isProject && { technologies: techInput.split(",").map(x => x.trim()).filter(Boolean) })
    };
    for (const key of ["demoUrl", "website"]) {
      if (payload[key]) payload[key] = normalizeUrl(payload[key]);
    }
    try {
      await onSave(payload);
    } catch (err) {
      setErrors(err.fields || {});
      setMessage(err.message);
      setSaving(false);
    }
  };

  const imageKey = isProject ? "imageUrl" : "logoUrl";
  const nameKey = isProject ? "title" : "name";

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="editor" onSubmit={submit} onMouseDown={e => e.stopPropagation()}>
        <div className="editor-head">
          <h2>{item ? "Editar" : "Nuevo"} {isProject ? "desarrollo" : "cliente"}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </div>

        <div className="editor-body">
          <ImageField
            label={isProject ? "Imagen / captura" : "Logo"}
            value={form[imageKey]}
            contain={!isProject}
            onChange={url => setForm(f => ({ ...f, [imageKey]: url }))}
          />

          <div className="editor-grid">
            <Field label={isProject ? "Nombre del proyecto" : "Nombre del cliente"} error={errors[nameKey]} wide>
              <input required autoFocus value={form[nameKey]} onChange={set(nameKey)} />
            </Field>

            {isProject ? (
              <>
                <Field label="Categoría" error={errors.category}>
                  <input value={form.category || ""} onChange={set("category")} placeholder="Sistemas a medida" />
                </Field>
                <Field label="URL de la demo" error={errors.demoUrl}>
                  <input value={form.demoUrl || ""} onChange={set("demoUrl")} placeholder="https://…" />
                </Field>
                <Field label="Tecnologías" hint="Separadas por coma" wide>
                  <input value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="React, Spring Boot, PostgreSQL" />
                </Field>
              </>
            ) : (
              <Field label="Sitio web" error={errors.website} wide>
                <input value={form.website || ""} onChange={set("website")} placeholder="https://empresa.cl" />
              </Field>
            )}

            <Field label="Descripción" error={errors.description} wide>
              <textarea rows="4" value={form.description || ""} onChange={set("description")} />
            </Field>

            <Field label="Orden" hint="Menor aparece primero">
              <input type="number" value={form.sortOrder} onChange={set("sortOrder")} />
            </Field>
            <label className="switch">
              <input type="checkbox" checked={form.active} onChange={set("active")} />
              <span className="switch-track" />
              <span>{form.active ? "Visible en la landing" : "Oculto"}</span>
            </label>
          </div>
        </div>

        {message && <p className="form-error editor-error">{message}</p>}

        <div className="editor-foot">
          <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Cancelar</button>
          <button className="btn btn-dark btn-sm" disabled={saving}><Save size={16} /> {saving ? "Guardando…" : "Guardar"}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, error, wide, children }) {
  return (
    <label className={`field ${wide ? "wide" : ""} ${error ? "has-error" : ""}`}>
      <span>{label}{hint && <small> · {hint}</small>}</span>
      {children}
      {error && <em>{error}</em>}
    </label>
  );
}

function ImageField({ label, value, contain, onChange }) {
  const input = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pick = async e => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      onChange(await adminApi.upload(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-field">
      <span className="image-label">{label}</span>
      <button type="button" className={`image-drop ${contain ? "contain" : ""}`} onClick={() => input.current?.click()} disabled={uploading}>
        {uploading ? <Loader2 className="spin" size={22} />
          : value ? <img src={value} alt="Vista previa" />
          : <><ImagePlus size={22} strokeWidth={1.5} /><small>Subir imagen<br />PNG, JPG o WEBP · máx. 5 MB</small></>}
      </button>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={pick} />
      {value && !uploading && (
        <div className="image-actions">
          <button type="button" onClick={() => input.current?.click()}>Cambiar</button>
          <button type="button" onClick={() => onChange("")}><Trash2 size={13} /> Quitar</button>
        </div>
      )}
      {error && <em className="image-error">{error}</em>}
    </div>
  );
}

function normalizeUrl(url) {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
