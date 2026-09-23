import React, { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight, BriefcaseBusiness, Check, ChevronDown, Code2, ExternalLink,
  FolderKanban, Globe2, LayoutDashboard, Mail, Menu, MonitorSmartphone,
  Pencil, Plus, Rocket, Save, Settings, Trash2, Users, X, Zap
} from "lucide-react";
import { getClients, getProjects, saveClients, saveProjects, resetContent, makeId } from "./storage";

const services = [
  {
    icon: Code2,
    title: "Software a medida",
    text: "Creamos aplicaciones pensadas para el proceso real de tu empresa, evitando soluciones genéricas que no se adaptan a tu operación."
  },
  {
    icon: MonitorSmartphone,
    title: "Aplicaciones web",
    text: "Sistemas modernos, responsivos y fáciles de usar para que tu equipo pueda trabajar desde cualquier dispositivo."
  },
  {
    icon: LayoutDashboard,
    title: "Reportería y dashboards",
    text: "Transformamos datos en información útil mediante reportes, indicadores y paneles visuales para apoyar tus decisiones."
  },
  {
    icon: Zap,
    title: "Automatización",
    text: "Reducimos tareas manuales y repetitivas conectando procesos, datos y herramientas de tu negocio."
  }
];

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header className="header">
      <div className="container nav">
        <a className="brand" href="#inicio" onClick={() => go("inicio")}>
          <img src="/logo.png" alt="CHG Desarrollo" />
        </a>

        <nav className={open ? "nav-links open" : "nav-links"}>
          <button onClick={() => go("inicio")}>Inicio</button>
          <button onClick={() => go("que-hacemos")}>Qué hacemos</button>
          <button onClick={() => go("proyectos")}>Desarrollos</button>
          <button onClick={() => go("clientes")}>Clientes</button>
          <button onClick={() => go("contacto")}>Contacto</button>
        </nav>

        <a className="nav-cta" href="#contacto" onClick={() => go("contacto")}>Hablemos <ArrowRight size={17} /></a>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function LandingPage() {
  const [clients, setClients] = useState(getClients());
  const [projects, setProjects] = useState(getProjects());
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const sync = () => {
      setClients(getClients());
      setProjects(getProjects());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  return (
    <div className="site">
      <Header />

      <main>
        <section id="inicio" className="hero">
          <div className="hero-glow glow-one" />
          <div className="hero-glow glow-two" />
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><span className="dot" /> Desarrollo de software personalizado</span>
              <h1>Convertimos tus ideas en <span>soluciones digitales.</span></h1>
              <p>
                En CHG Desarrollo creamos software a tu medida para ayudarte a
                ordenar procesos, automatizar tareas y hacer crecer tu negocio.
              </p>
              <div className="hero-actions">
                <a className="btn primary" href="#contacto">Cuéntanos tu idea <ArrowRight size={18} /></a>
                <a className="btn secondary" href="#proyectos">Ver nuestros desarrollos</a>
              </div>
              <div className="hero-stats">
                <div><strong>100%</strong><span>A tu medida</span></div>
                <div><strong>Web</strong><span>Multidispositivo</span></div>
                <div><strong>Escalable</strong><span>Para crecer contigo</span></div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="code-window">
                <div className="window-bar"><span /><span /><span /><small>CHG Desarrollo</small></div>
                <div className="code-body">
                  <p><i>const</i> <b>solucion</b> = {"{"}</p>
                  <p className="indent">problema: <em>"tu negocio"</em>,</p>
                  <p className="indent">tecnologia: <em>"a tu medida"</em>,</p>
                  <p className="indent">resultado: <em>"más eficiencia"</em></p>
                  <p>{"};"}</p>
                  <div className="code-line"><span /> <small>Construyendo algo mejor...</small></div>
                </div>
              </div>
              <div className="floating-card card-top"><Rocket size={18} /><span>Ideas → Software</span></div>
              <div className="floating-card card-bottom"><Check size={18} /><span>Soluciones personalizadas</span></div>
            </div>
          </div>
        </section>

        <section id="que-hacemos" className="section">
          <div className="container">
            <SectionHeading eyebrow="Qué hacemos" title="Tecnología que se adapta a tu negocio" text=" Primero entendemos tu necesidad y luego construimos la solución. No partimos de una plantilla." />
            <div className="service-grid">
              {services.map(({ icon: Icon, title, text }) => (
                <article className="service-card" key={title}>
                  <div className="icon-box"><Icon size={23} /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="service-arrow"><ArrowRight size={17} /></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="proyectos" className="section section-dark">
          <div className="container">
            <SectionHeading eyebrow="Nuestros desarrollos" title="Proyectos que convierten necesidades en soluciones" text="Agrega aquí tus sistemas, sitios web y plataformas. Cada proyecto puede tener imagen, tecnologías y enlace a una demo o sitio publicado." light />
            <div className="project-grid">
              {projects.map(project => (
                <article className="project-card" key={project.id}>
                  <div className="project-image">
                    {project.image ? <img src={project.image} alt={project.title} /> : <div className="project-placeholder"><FolderKanban size={40} /><span>Vista previa del proyecto</span></div>}
                    <span className="project-category">{project.category || "Desarrollo"}</span>
                  </div>
                  <div className="project-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tags">{(project.technologies || []).map(t => <span key={t}>{t}</span>)}</div>
                    <div className="project-actions">
                      <button className="text-btn" onClick={() => setActiveProject(project)}>Ver detalle <ArrowRight size={16} /></button>
                      {project.url && project.url !== "#" && (
                        <a className="icon-link" href={project.url} target="_blank" rel="noreferrer"><ExternalLink size={17} /></a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="clientes" className="section">
          <div className="container">
            <SectionHeading eyebrow="Nuestros clientes" title="Empresas que confían en el desarrollo a medida" text="Puedes incorporar aquí los logos de tus clientes, junto con su sitio web y una breve descripción." />
            <div className="client-grid">
              {clients.map(client => (
                <a className="client-card" key={client.id} href={client.url && client.url !== "#" ? client.url : undefined} target="_blank" rel="noreferrer">
                  <div className="client-logo">
                    {client.logo ? <img src={client.logo} alt={client.name} /> : <div className="logo-placeholder"><Users size={28} /></div>}
                  </div>
                  <h3>{client.name}</h3>
                  <p>{client.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="container">
            <SectionHeading eyebrow="Cómo trabajamos" title="De la idea al sistema funcionando" light />
            <div className="process-grid">
              {[
                ["01", "Entendemos", "Conversamos contigo y levantamos el problema, proceso o idea."],
                ["02", "Diseñamos", "Definimos la experiencia, funcionalidades y arquitectura."],
                ["03", "Desarrollamos", "Construimos, probamos y mejoramos la solución."],
                ["04", "Entregamos", "Publicamos y dejamos el sistema preparado para crecer."]
              ].map(([num, title, text]) => (
                <div className="process-item" key={num}>
                  <span>{num}</span><h3>{title}</h3><p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacto" className="section contact-section">
          <div className="container contact-grid">
            <div>
              <span className="eyebrow">Contacto</span>
              <h2>¿Tienes un proceso que podría funcionar mejor?</h2>
              <p>Cuéntanos qué necesitas y conversemos sobre cómo transformarlo en una solución digital.</p>
              <div className="contact-info">
                <a href="mailto:contacto@chgdesarrollo.cl"><Mail size={20} /> contacto@chgdesarrollo.cl</a>
                <a href="#inicio"><Globe2 size={20} /> chgdesarrollo.cl</a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <img src="/logo.png" alt="CHG Desarrollo" />
          <span>© {new Date().getFullYear()} CHG Desarrollo. Desarrollos a tu medida.</span>
          <Link to="/admin" className="admin-link"><Settings size={14} /> Administrar</Link>
        </div>
      </footer>

      {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}
    </div>
  );
}

function SectionHeading({ eyebrow, title, text, light = false }) {
  return (
    <div className={`section-heading ${light ? "light" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Consulta desde CHG Desarrollo - ${form.name}`);
    const body = encodeURIComponent(`Nombre: ${form.name}\nCorreo: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:contacto@chgdesarrollo.cl?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>Nombre<input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Tu nombre" /></label>
      <label>Correo<input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="tu@empresa.cl" /></label>
      <label>¿Qué necesitas?<textarea required rows="5" value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Cuéntanos brevemente tu proyecto..." /></label>
      <button className="btn primary full" type="submit">Enviar consulta <ArrowRight size={18} /></button>
      {sent && <small className="form-note">Se abrirá tu aplicación de correo para completar el envío.</small>}
    </form>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X /></button>
        {project.image && <img src={project.image} alt={project.title} className="modal-image" />}
        <div className="modal-content">
          <span className="eyebrow">{project.category || "Proyecto"}</span>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
          <div className="tags">{(project.technologies || []).map(t => <span key={t}>{t}</span>)}</div>
          {project.url && project.url !== "#" && <a className="btn primary" href={project.url} target="_blank" rel="noreferrer">Visitar proyecto <ExternalLink size={17} /></a>}
        </div>
      </div>
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState(getClients());
  const [projects, setProjects] = useState(getProjects());
  const [tab, setTab] = useState("projects");
  const [editing, setEditing] = useState(null);

  const persistClients = items => { setClients(items); saveClients(items); };
  const persistProjects = items => { setProjects(items); saveProjects(items); };

  const removeClient = id => {
    if (confirm("¿Eliminar este cliente?")) persistClients(clients.filter(x => x.id !== id));
  };
  const removeProject = id => {
    if (confirm("¿Eliminar este desarrollo?")) persistProjects(projects.filter(x => x.id !== id));
  };

  const reset = () => {
    if (confirm("Esto restaurará el contenido demo. ¿Continuar?")) {
      resetContent();
      setClients(getClients());
      setProjects(getProjects());
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container admin-nav">
          <img src="/logo.png" alt="CHG Desarrollo" />
          <div><button onClick={() => navigate("/")}>Ver landing</button><button className="danger-outline" onClick={reset}>Restaurar demo</button></div>
        </div>
      </div>

      <div className="container admin-container">
        <div className="admin-title">
          <div><span className="eyebrow">Panel de contenidos</span><h1>Administra tu landing</h1><p>Agrega clientes y desarrollos sin modificar el código.</p></div>
          <div className="admin-note"><Settings size={18} /> En esta versión los datos se guardan en el navegador.</div>
        </div>

        <div className="admin-tabs">
          <button className={tab === "projects" ? "active" : ""} onClick={() => {setTab("projects");setEditing(null)}}><FolderKanban size={17}/> Desarrollos</button>
          <button className={tab === "clients" ? "active" : ""} onClick={() => {setTab("clients");setEditing(null)}}><Users size={17}/> Clientes</button>
        </div>

        <div className="admin-toolbar">
          <h2>{tab === "projects" ? "Tus desarrollos" : "Tus clientes"}</h2>
          <button className="btn primary" onClick={() => setEditing({ type: tab, item: null })}><Plus size={17}/> Agregar</button>
        </div>

        {editing && (
          <Editor
            type={editing.type}
            item={editing.item}
            onCancel={() => setEditing(null)}
            onSave={(item) => {
              if (editing.type === "projects") {
                const next = editing.item ? projects.map(x => x.id === item.id ? item : x) : [...projects, item];
                persistProjects(next);
              } else {
                const next = editing.item ? clients.map(x => x.id === item.id ? item : x) : [...clients, item];
                persistClients(next);
              }
              setEditing(null);
            }}
          />
        )}

        {!editing && (
          <div className="admin-list">
            {tab === "projects" ? projects.map(item => (
              <div className="admin-row" key={item.id}>
                <div className="admin-thumb">{item.image ? <img src={item.image} alt="" /> : <FolderKanban size={25}/>}</div>
                <div className="admin-row-main"><strong>{item.title}</strong><span>{item.category}</span></div>
                <div className="row-actions"><button onClick={() => setEditing({type:"projects",item})}><Pencil size={16}/></button><button onClick={() => removeProject(item.id)}><Trash2 size={16}/></button></div>
              </div>
            )) : clients.map(item => (
              <div className="admin-row" key={item.id}>
                <div className="admin-thumb">{item.logo ? <img src={item.logo} alt="" /> : <Users size={25}/>}</div>
                <div className="admin-row-main"><strong>{item.name}</strong><span>{item.url || "Sin enlace"}</span></div>
                <div className="row-actions"><button onClick={() => setEditing({type:"clients",item})}><Pencil size={16}/></button><button onClick={() => removeClient(item.id)}><Trash2 size={16}/></button></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Editor({ type, item, onCancel, onSave }) {
  const isProject = type === "projects";
  const [form, setForm] = useState(item || (isProject
    ? { id: makeId("project"), title: "", description: "", image: "", url: "", technologies: [], category: "Desarrollo" }
    : { id: makeId("client"), name: "", logo: "", url: "", description: "" }));
  const [techInput, setTechInput] = useState((form.technologies || []).join(", "));

  const update = (key, value) => setForm(f => ({...f, [key]: value}));

  const fileToDataUrl = (file, key) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(key, reader.result);
    reader.readAsDataURL(file);
  };

  const submit = e => {
    e.preventDefault();
    onSave(isProject ? {...form, technologies: techInput.split(",").map(x => x.trim()).filter(Boolean)} : form);
  };

  return (
    <form className="editor" onSubmit={submit}>
      <div className="editor-header"><h3>{item ? "Editar" : "Agregar"} {isProject ? "desarrollo" : "cliente"}</h3><button type="button" onClick={onCancel}><X size={18}/></button></div>
      <div className="editor-grid">
        <label>{isProject ? "Nombre del proyecto" : "Nombre del cliente"}<input required value={isProject ? form.title : form.name} onChange={e => update(isProject ? "title" : "name", e.target.value)} /></label>
        <label>Enlace (URL)<input value={form.url} onChange={e => update("url", e.target.value)} placeholder="https://..." /></label>
        {isProject && <label>Categoría<input value={form.category} onChange={e => update("category", e.target.value)} /></label>}
        {isProject && <label>Tecnologías<input value={techInput} onChange={e => setTechInput(e.target.value)} placeholder="React, Spring Boot, PostgreSQL" /></label>}
        <label className="wide">{isProject ? "Descripción" : "Descripción del cliente"}<textarea rows="4" value={form.description} onChange={e => update("description", e.target.value)} /></label>
        <label>{isProject ? "Imagen / captura" : "Logo del cliente"}<input type="file" accept="image/*" onChange={e => fileToDataUrl(e.target.files?.[0], isProject ? "image" : "logo")} /></label>
        <div className="preview-upload">
          {(isProject ? form.image : form.logo) ? <img src={isProject ? form.image : form.logo} alt="Vista previa" /> : <span>Sin imagen</span>}
        </div>
      </div>
      <div className="editor-actions"><button type="button" className="btn secondary" onClick={onCancel}>Cancelar</button><button className="btn primary"><Save size={17}/> Guardar</button></div>
    </form>
  );
}

export default App;