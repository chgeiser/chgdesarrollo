# CHG Desarrollo — Landing React

Landing responsive para CHG Desarrollo construida con React + Vite.

## Ejecutar

```bash
npm install
npm run dev
```

Luego abrir la URL que indique Vite (normalmente http://localhost:5173).

## Funcionalidades

- Landing responsive.
- Secciones: Inicio, Qué hacemos, Desarrollos, Clientes y Contacto.
- Modal de detalle para cada desarrollo.
- Enlace a demo/sitio de cada proyecto.
- Panel `/admin` para agregar, editar y eliminar clientes y desarrollos.
- Carga de logos/capturas mediante archivo.
- Persistencia local con `localStorage`.
- Diseño preparado para reemplazar la persistencia local por una API/backend.

## Importante para producción

El panel `/admin` es una solución inicial de frontend: los datos se guardan en el navegador y no existe autenticación real.

Para una versión productiva recomiendo conectar:
- Backend Spring Boot / Node.
- PostgreSQL.
- Login de administrador.
- Almacenamiento de imágenes (S3, Cloudinary u otro).
- CRUD de clientes/proyectos vía API.

## Personalización inmediata

1. Cambiar correo `contacto@chgdesarrollo.cl` en `src/App.jsx`.
2. Agregar tus clientes desde `/admin`.
3. Agregar tus proyectos desde `/admin`.
4. Cambiar textos y servicios en `src/App.jsx`.
5. El logo está en `public/logo.png`.
