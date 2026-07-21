# Jaula-Demon

## Requisitos

- Node.js (para la interfaz React)
- Python 3 (para el script de datos de prueba)

## Instalación

Instala las dependencias del frontend:

```bash
npm run install-frontend
```

Esto ejecuta `npm install` dentro de `frontend-react`.

## Ejecutar la aplicación

Desde el directorio raíz:

```bash
cd frontend-react
npm run dev
```

## Generar datos de prueba

El script de datos de prueba usa solo la biblioteca estándar de Python, por lo que no necesita paquetes adicionales.

```bash
npm run seed-admin-data
```

## Notas

- El script `seed-admin-data` crea lotes activos, registros de gastos, mortalidad y ventas.
- Si bajas el repositorio nuevo, ejecuta primero `npm run install-frontend` y luego `npm run seed-admin-data`.
