import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Lock } from "lucide-react";
import { authApi, getToken } from "../api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (getToken()) return <Navigate to="/admin" replace />;

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await authApi.login(form.username, form.password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <img src="/logo-dark.png" alt="CHG Desarrollo" className="login-logo" />
        <div className="login-title">
          <Lock size={16} />
          <span>Panel de administración</span>
        </div>
        <label>Usuario
          <input autoFocus required autoComplete="username" value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })} />
        </label>
        <label>Contraseña
          <input required type="password" autoComplete="current-password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn-dark" disabled={busy}>
          {busy ? "Ingresando…" : <>Ingresar <ArrowRight size={17} /></>}
        </button>
        <a className="login-back" href="/">← Volver al sitio</a>
      </form>
    </div>
  );
}
