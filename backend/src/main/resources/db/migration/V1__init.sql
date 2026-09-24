CREATE TABLE client (
    id           BIGSERIAL PRIMARY KEY,
    name         VARCHAR(150)  NOT NULL,
    logo_url     VARCHAR(500),
    website      VARCHAR(500),
    description  VARCHAR(1000),
    active       BOOLEAN       NOT NULL DEFAULT TRUE,
    sort_order   INTEGER       NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE TABLE project (
    id           BIGSERIAL PRIMARY KEY,
    title        VARCHAR(150)  NOT NULL,
    description  VARCHAR(2000),
    image_url    VARCHAR(500),
    demo_url     VARCHAR(500),
    category     VARCHAR(100),
    technologies VARCHAR(500),
    active       BOOLEAN       NOT NULL DEFAULT TRUE,
    sort_order   INTEGER       NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_active_order  ON client  (active, sort_order);
CREATE INDEX idx_project_active_order ON project (active, sort_order);

-- Contenido inicial (se puede editar o eliminar desde /admin)
INSERT INTO project (title, description, category, technologies, sort_order) VALUES
('Sistema de Reportería',
 'Plataforma web personalizada para centralizar información, generar reportes y visualizar indicadores.',
 'Sistemas a medida', 'React,Spring Boot,PostgreSQL', 1),
('Gestión Operacional',
 'Aplicación orientada a optimizar procesos internos y facilitar el seguimiento de operaciones.',
 'Aplicaciones web', 'React,Spring Boot,Docker', 2);
