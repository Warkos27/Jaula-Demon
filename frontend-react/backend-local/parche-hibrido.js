const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'don_pollito_local',
  password: 'adminpassword',
  port: 5432,
});

const aplicarParche = async () => {
  try {
    // Le agregamos la columna que servirá como etiqueta de envío
    await pool.query('ALTER TABLE lecturas_sensores ADD COLUMN IF NOT EXISTS sincronizado_nube BOOLEAN DEFAULT FALSE;');
    console.log("✅ ¡Etiqueta de sincronización agregada a la bóveda PostgreSQL!");
  } catch (error) {
    console.error("❌ Error al aplicar el parche:", error);
  } finally {
    pool.end();
  }
};

aplicarParche();