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
  password: 'adminpassword',
  port: 5432,
});

pool.connect()
  .then(() => console.log('✅ Conectado a la base de datos PostgreSQL'))
  .catch(err => console.error('❌ Error conectando a PostgreSQL:', err.stack));

// 2. Conexión a tu Broker MQTT (Mosquitto)
const mqttClient = mqtt.connect('mqtt://localhost:1883');

mqttClient.on('connect', () => {
  console.log('✅ Conectado al Broker MQTT local');
  
  // Nos suscribimos al "canal" donde los sensores enviarán la información
  mqttClient.subscribe('jaula/sensores', (err) => {
    if (!err) {
      console.log('🎧 Escuchando datos de los sensores en el tema: jaula/sensores');
    }
  });
});

// 3. Evento para cuando llega un dato nuevo de los sensores
mqttClient.on('message', async (topic, message) => {
  console.log(`\n📩 Nuevo dato recibido en [${topic}]: ${message.toString()}`);
  
  try {
    // Convertimos el mensaje de texto a un objeto JSON real
    const dato = JSON.parse(message.toString());
    
    // Preparamos la instrucción SQL para insertar en los cajones
    const query = `
      INSERT INTO lecturas_sensores (temperatura, humedad, luminosidad, amoniaco, co2) 
      VALUES ($1, $2, $3, $4, $5)
    `;
    const valores = [dato.temperatura, dato.humedad, dato.luminosidad, dato.amoniaco, dato.co2];
    
    // Ejecutamos el guardado en PostgreSQL
    await pool.query(query, valores);
    console.log('💾 ¡Dato guardado en la bóveda PostgreSQL exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al intentar guardar el dato:', error);
  }
});

// 4. Ruta de prueba para verificar que el servidor responde a tu React
app.get('/api/estado', (req, res) => {
  res.json({ mensaje: 'El backend local de Don Pollito está funcionando al 100%' });
});

// 5. Ruta para que el Frontend (React) consulte el último dato en tiempo real
app.get('/api/sensores/actual', async (req, res) => {
  try {
    // Vamos a la bóveda y sacamos solo el último registro (el más reciente)
    const result = await pool.query(
      'SELECT * FROM lecturas_sensores ORDER BY id DESC LIMIT 1'
    );
    
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // Enviamos el dato a React
    } else {
      res.status(404).json({ mensaje: 'Aún no hay datos registrados' });
    }
  } catch (error) {
    console.error('❌ Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// 6. Encender el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor puente corriendo en http://localhost:${PORT}`);
});