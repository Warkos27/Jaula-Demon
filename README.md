# Jaula-Demon

## Requisitos

- Node.js + npm
- Python 3
- Docker / docker compose (opcional, pero recomendado para la DB y MQTT)

## ¿Necesitas VM?

No. Puedes correr el proyecto en tu máquina local.
No es necesario crear una máquina virtual solo para este proyecto.

## Qué instala cada parte

- `frontend-react` contiene la app React/Vite.
- `frontend-react/backend-local` contiene el backend Node que usa PostgreSQL y MQTT.
- `frontend-react/infraestructura/docker-compose.yml` monta:
  - PostgreSQL en `localhost:5432`
  - Mosquitto MQTT en `localhost:1883`

## Instalación rápida

1. Instala dependencias del frontend:

```bash
npm run install-frontend
```

2. Instala dependencias del backend local:

```bash
cd frontend-react/backend-local
npm install
```

3. Levanta la infraestructura de Docker (DB + MQTT):

```bash
cd frontend-react
docker compose up -d
```

4. Inicia el backend local:

```bash
cd frontend-react/backend-local
node index.js
```

5. Inicia el frontend:

```bash
cd frontend-react
npm run dev
```

## Archivo de entorno

- `frontend-react/backend-local/.env` ya incluye `DB_PASSWORD=adminpassword`.
- Si falta, crea el archivo con ese valor.

## Nota importante sobre Docker

El Docker actual solo levanta la base de datos y el broker MQTT.
No levanta la app React ni el backend Node. Es decir:

- Docker yes: PostgreSQL + MQTT
- Docker no: React y backend Node deben arrancarse con `npm run dev` y `node index.js`

## Generar datos de prueba

```bash
npm run seed-admin-data
```

El script usa solo Python estándar.
