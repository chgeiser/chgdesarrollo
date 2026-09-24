# CHG Desarrollo

Sitio de chgdesarrollo.cl: landing pública, panel de administración y API REST.

```
                 CHG DESARROLLO
                       │
          ┌────────────┴────────────┐
       LANDING                 ADMIN PANEL
       pública                  /admin (JWT)
          └────────────┬────────────┘
                   REST API  (/api)
                  Spring Boot 3 · Java 21
          ┌────────────┴────────────┐
      PostgreSQL                 Imágenes
  clientes / proyectos      volumen /data/uploads
```

| Carpeta / archivo  | Contenido |
|--------------------|-----------|
| `src/`             | Frontend React + Vite (landing y panel) |
| `backend/`         | API Spring Boot + Flyway + PostgreSQL |
| `nginx.conf`       | Sirve el frontend y redirige `/api` al backend |
| `docker-compose.yml` | Stack completo: `db`, `api`, `landing` |

## API

| Método | Ruta | Acceso |
|--------|------|--------|
| GET | `/api/public/projects` · `/api/public/clients` | Público (solo registros activos) |
| POST | `/api/auth/login` | Público → devuelve JWT |
| GET/POST/PUT/DELETE | `/api/admin/projects[/{id}]` · `/api/admin/clients[/{id}]` | Admin |
| POST | `/api/admin/uploads` (multipart `file`) | Admin: PNG, JPG, WEBP o GIF, máx. 5 MB |
| GET | `/api/uploads/{archivo}` | Público |

El esquema de la base de datos se crea con Flyway (`backend/src/main/resources/db/migration`).
Para cambiarlo, agrega un `V2__...sql`; no edites el `V1`.

## Desarrollo local

Requisitos: Node 20+, Java 21, Maven y Docker.

```bash
# 1. Base de datos
docker run -d --name chg-pg -p 5432:5432 \
  -e POSTGRES_DB=chgdesarrollo -e POSTGRES_USER=chg -e POSTGRES_PASSWORD=chg postgres:16-alpine

# 2. API (http://localhost:8080)
cd backend && mvn spring-boot:run

# 3. Frontend (http://localhost:5173, redirige /api al puerto 8080)
npm install && npm run dev
```

Credenciales por defecto en desarrollo: `admin` / `admin123` (`backend/src/main/resources/application.yml`).

## Producción (servidor con Docker)

1. Copia `.env.example` a `.env` y define claves reales:
   ```bash
   cp .env.example .env
   openssl rand -base64 48   # usar como JWT_SECRET
   ```
2. El servicio `landing` se conecta a la red externa `proxy` (tu proxy inverso con TLS).
   Si no existe todavía: `docker network create proxy`.
3. Levanta el stack:
   ```bash
   docker compose up -d --build
   ```
4. Apunta `chgdesarrollo.cl` al contenedor `chgdesarrollo-landing` (puerto 80) desde tu proxy.
5. Entra a `https://chgdesarrollo.cl/admin` con `ADMIN_USERNAME` / `ADMIN_PASSWORD`.

Los datos quedan en los volúmenes `db-data` (PostgreSQL) y `uploads` (imágenes); respáldalos.

## Personalización

- Correo de contacto: constante `CONTACT_EMAIL` en `src/landing/Landing.jsx`.
- Textos de servicios, proceso y tecnologías: arreglos al inicio de `src/landing/Landing.jsx`.
- Colores y tipografías: variables en `:root` de `src/styles.css`.
- Logos: `public/logo-light.png` (fondos oscuros), `public/logo-dark.png` (fondos claros),
  `public/logo-mark-light.png` (header, sin lema) y `public/favicon.png`.
