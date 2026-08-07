require('dotenv').config();

const { Pool } = require('pg');

// Conexión a tu PostgreSQL local
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'don_pollito_local',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Tu API de AWS
const AWS_API_URL = "https://8pkac0pg3d.execute-api.us-east-2.amazonaws.com/lecturas";

const sincronizarDatos = async () => {
  try {
    // 1. Buscamos hasta 100 registros atrapados
    const result = await pool.query(
      'SELECT * FROM lecturas_sensores WHERE sincronizado_nube = false ORDER BY id ASC LIMIT 100'
    );

    if (result.rows.length === 0) return;
    
    console.log(`\n📦 BATCHING: Empaquetando ${result.rows.length} datos pendientes para AWS...`);

    // 2. Transformamos todas las filas
    const payloadMasivo = result.rows.map(fila => ({
      id_jaula: fila.lote_id || 1,
      fecha_hora: Math.floor(new Date(fila.fecha_registro).getTime() / 1000),
      lecturas: [
        { id_sensor: 1, nombre: "Temperatura", valor: parseFloat(fila.temperatura), unidad: "°C" },
        { id_sensor: 2, nombre: "Humedad", valor: parseFloat(fila.humedad), unidad: "%" },
        { id_sensor: 4, nombre: "Luminosidad", valor: parseFloat(fila.luminosidad), unidad: "lx" },
        { id_sensor: 3, nombre: "Amoniaco", valor: parseFloat(fila.amoniaco), unidad: "ppm" },
        { id_sensor: 5, nombre: "CO2", valor: parseFloat(fila.co2), unidad: "ppm" }
      ]
    }));

    // ---------------------------------------------------------
    // 2.5 NUEVO: FILTRO ANTI-DUPLICADOS PARA DYNAMODB
    // ---------------------------------------------------------
    const payloadLimpio = [];
    const firmasVistas = new Set();

    for (const dato of payloadMasivo) {
      // Creamos una firma única combinando la jaula y el segundo exacto
      const firma = `${dato.id_jaula}_${dato.fecha_hora}`;
      
      // Si no hemos visto esta firma en este paquete, lo agregamos
      if (!firmasVistas.has(firma)) {
        firmasVistas.add(firma);
        payloadLimpio.push(dato);
      }
    }
    
    if (payloadMasivo.length !== payloadLimpio.length) {
       console.log(`🧹 Filtro activo: Se eliminaron ${payloadMasivo.length - payloadLimpio.length} datos con fechas duplicadas para evitar colisión en AWS.`);
    }
    // ---------------------------------------------------------

    // 3. Hacemos UNA sola petición enviando la caja LIMPIA
    const awsResponse = await fetch(AWS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadLimpio)
    });

    if (awsResponse.ok) {
      // 4. Si la nube acepta la caja, le ponemos el sello de "enviado" a TODOS los 100 datos locales (incluso los duplicados) para destrabar la cola
      const idsActualizados = result.rows.map(r => r.id);
      await pool.query('UPDATE lecturas_sensores SET sincronizado_nube = true WHERE id = ANY($1::int[])', [idsActualizados]);
      console.log(`✅ ¡Éxito! Caja aceptada en la nube. Cola local avanzada.`);
    } else {
      const errorAWS = await awsResponse.text();
      console.error(`❌ AWS rechazó el paquete (Código ${awsResponse.status}). Razón:`, errorAWS);
    }
  } catch (error) {
    console.log("📡 Sin internet o AWS inalcanzable. Protegiendo datos en PostgreSQL local...");
  }
};

// Se ejecuta cada 1 minuto para proteger los costos de AWS
setInterval(sincronizarDatos, 60000);
console.log("🚀 Sincronizador Edge-to-Cloud con Batching iniciado.");