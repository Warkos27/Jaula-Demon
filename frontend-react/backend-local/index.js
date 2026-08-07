require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Conexión a tu base de datos PostgreSQL (Docker)
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'don_pollito_local',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

pool.connect()
  .then(() => console.log('✅ Conectado a la base de datos PostgreSQL'))
  .catch(err => console.error('❌ Error conectando a PostgreSQL:', err.stack));

// 2. Conexión a tu Broker MQTT (Mosquitto)
const mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.on('connect', () => {
  console.log('✅ Conectado al Broker MQTT local');
  
  mqttClient.subscribe('jaula/sensores', (err) => {
    if (!err) {
      console.log('🎧 Escuchando datos de los sensores en el tema: jaula/sensores');
    }
  });
});

// 3. Evento para cuando llega un dato nuevo de los sensores
mqttClient.on('message', async (topic, message) => {
  try {
    const dato = JSON.parse(message.toString());
    
    // Insertamos el dato indicando que aún no se sincroniza con la nube (false)
    const query = `
      INSERT INTO lecturas_sensores (temperatura, humedad, luminosidad, amoniaco, co2, sincronizado_nube) 
      VALUES ($1, $2, $3, $4, $5, false)
    `;
    const valores = [dato.temperatura, dato.humedad, dato.luminosidad, dato.amoniaco, dato.co2];
    
    await pool.query(query, valores);
    // Nota: Eliminamos el console.log aquí para mantener la terminal limpia
  } catch (error) {
    console.error('❌ Error al intentar guardar el dato:', error);
  }
});

// 4. Rutas de la API
app.get('/api/estado', (req, res) => {
  res.json({ mensaje: 'El backend local de Don Pollito está funcionando al 100%' });
});

// Ruta para el Dashboard en tiempo real
app.get('/api/sensores/actual', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM lecturas_sensores ORDER BY id DESC LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ mensaje: 'Aún no hay datos registrados' });
    }
  } catch (error) {
    console.error('❌ Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// NUEVA RUTA: Para la pestaña de Historial en React
app.get('/api/sensores/historial', async (req, res) => {
  try {
    const horas = req.query.horas || 24;
    const query = `
      SELECT * FROM lecturas_sensores 
      WHERE fecha_registro >= NOW() - $1::interval 
      ORDER BY fecha_registro ASC
    `;
    const result = await pool.query(query, [`${horas} hours`]);
    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al consultar el historial:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// 5. Encender el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor puente corriendo en http://localhost:${PORT}`);
});