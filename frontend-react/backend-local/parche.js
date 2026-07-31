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
    // Le decimos a PostgreSQL que amplíe el cajón a 7 dígitos (hasta 99999.99)
    await pool.query('ALTER TABLE lecturas_sensores ALTER COLUMN co2 TYPE DECIMAL(7,2);');
    console.log("✅ ¡El cajón de CO2 fue ampliado correctamente!");
  } catch (error) {
    console.error("❌ Error al aplicar el parche:", error);
  } finally {
    pool.end();
  }
};

aplicarParche();