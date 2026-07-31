const { Pool } = require('pg');

// Conexión a tu PostgreSQL local en Docker
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'don_pollito_local',
  password: 'adminpassword',
  port: 5432,
});

const crearTablas = async () => {
  const query = `
    -- 1. Tabla principal de Lotes (Para controlar la semana de vida de las aves)
    CREATE TABLE IF NOT EXISTS lotes (
        id SERIAL PRIMARY KEY,
        nombre_lote VARCHAR(100) NOT NULL,
        fecha_inicio DATE DEFAULT CURRENT_DATE,
        estado VARCHAR(50) DEFAULT 'activo'
    );

    -- 2. Tabla del historial de sensores (Lo que viene del MQTT)
    CREATE TABLE IF NOT EXISTS lecturas_sensores (
        id SERIAL PRIMARY KEY,
        lote_id INTEGER REFERENCES lotes(id),
        temperatura DECIMAL(5,2),
        humedad DECIMAL(5,2),
        luminosidad DECIMAL(5,2),
        amoniaco DECIMAL(5,2),
        co2 DECIMAL(7,2),
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Tabla para el módulo Administrativo y Contable
    CREATE TABLE IF NOT EXISTS contabilidad (
        id SERIAL PRIMARY KEY,
        lote_id INTEGER REFERENCES lotes(id),
        tipo_movimiento VARCHAR(20) NOT NULL, -- Ej: 'gasto', 'venta', 'mortalidad'
        monto DECIMAL(10,2),
        descripcion TEXT,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log("⏳ Construyendo tablas en PostgreSQL...");
    await pool.query(query);
    console.log("✅ ¡Tablas de Don Pollito creadas con éxito! La bóveda está lista.");
  } catch (err) {
    console.error("❌ Error al crear las tablas:", err);
  } finally {
    pool.end(); // Cerramos la conexión al terminar
  }
};

crearTablas();