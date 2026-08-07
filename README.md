# Gestor de Tareas

Aplicación full-stack para gestionar tareas personales, con persistencia en base de datos. Proyecto desarrollado como parte de mi portafolio, aplicando conceptos de backend, frontend y conexión entre ambos mediante una API REST.

##  Nota sobre el despliegue (demo)

Este proyecto está desplegado en Render (plan gratuito) únicamente para fines de demostración.

- El backend usa SQLite con almacenamiento en disco local.
- En el plan gratuito de Render, la instancia se apaga tras ~15 min de inactividad, y al reactivarse el disco se reinicia — por lo tanto, los datos (usuarios, tareas) se pierden en cada reinicio.
- Es una limitación esperada del entorno de demo gratuito, no del código en sí. En local, o con un disco persistente, los datos se mantienen sin problema.
- El primer acceso después de un período de inactividad puede tardar unos segundos en responder (cold start).

🔗 Demo en vivo: [link]

## Tecnologías utilizadas

**Backend**
- Node.js
- Express
- SQLite3
- CORS
- JWT (jsonwebtoken) — autenticación basada en tokens
- bcrypt — hasheo seguro de contraseñas

**Frontend**
- HTML5
- CSS3
- JavaScript (Vanilla) — manipulación del DOM y `fetch` para consumo de API

## Funcionalidades

- Registro e inicio de sesión de usuarios con autenticación JWT
- Cada usuario ve y gestiona únicamente sus propias tareas
- Crear tareas nuevas
- Listar todas las tareas guardadas
- Marcar tareas como completadas o pendientes
- Eliminar tareas
- Persistencia de datos en base de datos SQLite (los datos se mantienen al recargar o cerrar la aplicación, sujeto a la limitación de despliegue mencionada arriba)

## Arquitectura

El proyecto sigue una arquitectura cliente-servidor simple:
