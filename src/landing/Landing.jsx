import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Code2, LayoutDashboard, Mail, Menu,
  MonitorSmartphone, Workflow, X
} from "lucide-react";
import { publicApi } from "../api";

const CONTACT_EMAIL = "contacto@chgdesarrollo.cl";

const services = [
  {
    icon: Code2,
    title: "Software a medida",
    text: "Aplicaciones diseñadas alrededor del proceso real de tu empresa, no de una plantilla genérica."
  },
  {
    icon: MonitorSmartphone,
    title: "Aplicaciones web",
    text: "Sistemas modernos y responsivos para que tu equipo trabaje desde cualquier dispositivo."
  },
  {
    icon: LayoutDashboard,
    title: "Reportería y dashboards",
    text: "Convertimos datos dispersos en indicadores claros para tomar mejores decisiones."
  },
  {
    icon: Workflow,
    title: "Automatización e integraciones",
    text: "Conectamos sistemas y eliminamos tareas manuales repetitivas mediante APIs y procesos automáticos."
  }
];

const steps = [
  ["Entendemos", "Levantamos el problema, el proceso y los objetivos de negocio contigo."],
  ["Diseñamos", "Definimos experiencia, funcionalidades y arquitectura antes de escribir código."],
  ["Desarrollamos", "Construimos en iteraciones cortas, con entregas que puedes probar."],
  ["Acompañamos", "Publicamos, damos soporte y dejamos el sistema preparado para crecer."]
];

const stack = ["React", "Spring Boot", "Java", "PostgreSQL", "Docker", "APIs REST", "Next.js", "Automatización"];

const hasLink = url => Boolean(url && url !== "#");
const displayHost = url => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

function useContent() {
  const [state, setState] = useState({ loading: true, error: false, projects: [], clients: [] });

  const load = useCallback(async () => {
    try {
      const [projects, clients] = await Promise.all([publicApi.projects(), publicApi.clients()]);
      setState({ loading: false, error: false, projects, clients });
    } catch {
      setState(s => ({ ...s, loading: false, error: true }));
    }
  }, []);

  useEffect(() => {
    load();
    // Si vuelves a la pestaña después de editar en /admin, la landing se refresca sola.
    const onVisible = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [load]);

  return state;
}

export default function Landing() {
  const { loading, error, projects, clients } = useContent();
  const [activeProject, setActiveProject] = useState(null);
  const showClients = clients.length > 0;

  return (
    <div className="site">
      <Header showClients={showClients} />

      <main>
        <section id="inicio" className="hero">
          <div className="hero-grid-bg" aria-hidden="true" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="kicker">Estudio de desarrollo de software · Chile</span>
              <h1>
                Software construido <em>a la medida</em> de tu negocio.
              </h1>
              <p className="hero-lead">
                Diseñamos y desarrollamos sistemas web, plataformas de gestión y
                automatizaciones que ordenan tus procesos y crecen contigo.
              </p>
              <div className="hero-actions">
                <a className="btn btn-light" href="#contacto">Cuéntanos tu proyecto <ArrowRight size={18} /></a>
                <a className="btn btn-ghost-light" href="#desarrollos">Ver desarrollos</a>
              </div>
            </div>

            <div className="hero-panel" aria-hidden="true">
              <div className="terminal">
                <div className="terminal-bar">
                  <span /><span /><span />
                  <small>chg ~ nuevo-proyecto</small>
                </div>
                <pre className="terminal-body">
<span className="t-dim">$</span> chg init <span className="t-str">"tu-empresa"</span>{"\n"}
<span className="t-ok">✓</span> Levantamiento de procesos{"\n"}
<span className="t-ok">✓</span> Diseño de la solución{"\n"}
<span className="t-ok">✓</span> API · Spring Boot{"\n"}
<span className="t-ok">✓</span> Frontend · React{"\n"}
<span className="t-ok">✓</span> Base de datos · PostgreSQL{"\n"}
<span className="t-dim">$</span> chg deploy --prod{"\n"}
<span className="t-str">→ Listo. Tu sistema está en línea.</span><span className="caret" />
                </pre>
              </div>
            </div>
          </div>

          <div className="container hero-facts">
            <div><strong>01</strong><span>Desarrollo 100% a medida</span></div>
            <div><strong>02</strong><span>Web y multidispositivo</span></div>
            <div><strong>03</strong><span>Arquitectura escalable</span></div>
            <div><strong>04</strong><span>Soporte directo</span></div>
          </div>
        </section>

        <div className="stack-strip" aria-label="Tecnologías">
          <div className="stack-track">
            {[...stack, ...stack].map((t, i) => <span key={i}>{t}</span>)}
          </div>
        </div>

        <section id="servicios" className="section">
          <div className="container">
            <SectionHeading index="01" eyebrow="Qué hacemos" title="Tecnología que se adapta a tu operación" text="Primero entendemos tu necesidad; después construimos la solución. Sin plantillas, sin funcionalidades que no usarás." />
            <div className="service-grid">
              {services.map(({ icon: Icon, title, text }, i) => (
                <article className="service" key={title}>
                  <div className="service-top">
                    <span className="mono">0{i + 1}</span>
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="desarrollos" className="section section-dark">
          <div className="container">
            <SectionHeading index="02" eyebrow="Desarrollos" title="Proyectos que convierten necesidades en soluciones" light />
            {loading ? (
              <div className="project-grid">{[0, 1, 2].map(i => <div className="project skeleton" key={i} />)}</div>
            ) : projects.length > 0 ? (
              <div className="project-grid">
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} index={i} onOpen={() => setActiveProject(project)} />
                ))}
              </div>
            ) : (
              <p className="empty-note">{error ? "No pudimos cargar los desarrollos en este momento." : "Pronto publicaremos nuestros desarrollos."}</p>
            )}
          </div>
        </section>

        {showClients && (
          <section id="clientes" className="section">
            <div className="container">
              <SectionHeading index="03" eyebrow="Clientes" title="Empresas que confían en nuestro trabajo" />
              <div className="client-wall">
                {clients.map(client => <ClientTile key={client.id} client={client} />)}
              </div>
            </div>
          </section>
        )}

        <section className="section section-dark process">
          <div className="container">
            <SectionHeading index={showClients ? "04" : "03"} eyebrow="Cómo trabajamos" title="De la idea al sistema funcionando" light />
            <ol className="process-grid">
              {steps.map(([title, text], i) => (
                <li key={title}>
                  <span className="mono">Paso 0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contacto" className="section contact">
          <div className="container contact-grid">
            <div>
              <span className="kicker dark">Contacto</span>
              <h2 className="display">¿Tienes un proceso que podría <em>funcionar mejor?</em></h2>
              <p className="contact-lead">Cuéntanos qué necesitas. Te responderemos para agendar una conversación sin compromiso.</p>
              <a className="contact-mail" href={`mailto:${CONTACT_EMAIL}`}><Mail size={18} /> {CONTACT_EMAIL}</a>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <img src="/logo-light.png" alt="CHG Desarrollo" />
          <nav>
            <a href="#servicios">Servicios</a>
            <a href="#desarrollos">Desarrollos</a>
            {showClients && <a href="#clientes">Clientes</a>}
            <a href="#contacto">Contacto</a>
          </nav>
          <small>© {new Date().getFullYear()} CHG Desarrollo · Desarrollos a tu medida</small>
        </div>
      </footer>

      {activeProject && <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />}
    </div>
  );
}

function Header({ showClients }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["servicios", "Servicios"],
    ["desarrollos", "Desarrollos"],
    ...(showClients ? [["clientes", "Clientes"]] : []),
    ["contacto", "Contacto"]
  ];

  return (
    <header className={`header ${scrolled || open ? "is-solid" : ""}`}>
      <div className="container nav">
        <a className="brand" href="#inicio" onClick={() => setOpen(false)}>
          <img src="/logo-mark-light.png" alt="CHG Desarrollo" />
        </a>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <a className="nav-cta" href="#contacto">Hablemos <ArrowUpRight size={16} /></a>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Cerrar menú" : "Abrir menú"}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function SectionHeading({ index, eyebrow, title, text, light = false }) {
  return (
    <div className={`section-heading ${light ? "light" : ""}`}>
      <span className="kicker">
        <span className="mono">({index})</span> {eyebrow}
      </span>
      <h2 className="display">{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <article className="project">
      <button className="project-media" onClick={onOpen} aria-label={`Ver detalle de ${project.title}`}>
        {project.imageUrl
          ? <img src={project.imageUrl} alt="" loading="lazy" />
          : <span className="project-monogram">{project.title.slice(0, 1)}</span>}
      </button>
      <div className="project-body">
        <div className="project-meta">
          <span className="mono">{String(index + 1).padStart(2, "0")}</span>
          <span>{project.category || "Desarrollo"}</span>
        </div>
        <h3>{project.title}</h3>
        {project.description && <p>{project.description}</p>}
        <div className="tags">{project.technologies.map(t => <span key={t}>{t}</span>)}</div>
        <div className="project-actions">
          <button className="link-btn" onClick={onOpen}>Ver detalle <ArrowRight size={16} /></button>
          {hasLink(project.demoUrl) && (
            <a className="link-btn" href={project.demoUrl} target="_blank" rel="noreferrer">Demo <ArrowUpRight size={16} /></a>
          )}
        </div>
      </div>
    </article>
  );
}

function ClientTile({ client }) {
  const content = (
    <>
      <div className="client-logo">
        {client.logoUrl ? <img src={client.logoUrl} alt={client.name} loading="lazy" /> : <span>{client.name}</span>}
      </div>
      <div className="client-info">
        <strong>{client.name}</strong>
        {hasLink(client.website) && <span>{displayHost(client.website)} <ArrowUpRight size={13} /></span>}
      </div>
    </>
  );
  return hasLink(client.website)
    ? <a className="client-tile" href={client.website} target="_blank" rel="noreferrer" title={client.description || client.name}>{content}</a>
    : <div className="client-tile" title={client.description || client.name}>{content}</div>;
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const set = key => e => setForm({ ...form, [key]: e.target.value });

  const submit = e => {
    e.preventDefault();
    const subject = encodeURIComponent(`Consulta desde chgdesarrollo.cl — ${form.name}`);
    const body = encodeURIComponent(
      `Nombre: ${form.name}\nCorreo: ${form.email}\nEmpresa: ${form.company || "-"}\n\n${form.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field-row">
        <label>Nombre<input required value={form.name} onChange={set("name")} placeholder="Tu nombre" /></label>
        <label>Correo<input required type="email" value={form.email} onChange={set("email")} placeholder="tu@empresa.cl" /></label>
      </div>
      <label><span>Empresa <small>(opcional)</small></span><input value={form.company} onChange={set("company")} placeholder="Nombre de tu empresa" /></label>
      <label>¿Qué necesitas?<textarea required rows="5" value={form.message} onChange={set("message")} placeholder="Cuéntanos brevemente tu proyecto o el proceso que quieres mejorar…" /></label>
      <button className="btn btn-dark" type="submit">Enviar consulta <ArrowRight size={18} /></button>
      {sent && <small className="form-note">Se abrió tu aplicación de correo para completar el envío.</small>}
    </form>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = e => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={project.title} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="modal-image" />}
        <div className="modal-content">
          <span className="kicker dark">{project.category || "Proyecto"}</span>
          <h2 className="display">{project.title}</h2>
          {project.description && <p>{project.description}</p>}
          <div className="tags tags-light">{project.technologies.map(t => <span key={t}>{t}</span>)}</div>
          {hasLink(project.demoUrl) && (
            <a className="btn btn-dark" href={project.demoUrl} target="_blank" rel="noreferrer">Visitar proyecto <ArrowUpRight size={17} /></a>
          )}
        </div>
      </div>
    </div>
  );
}
