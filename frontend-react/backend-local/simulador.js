const mqtt = require('mqtt');

// Nos conectamos al mensajero local
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('🤖 Simulador de sensores activado y conectado a MQTT');
  console.log('Comenzando a emitir datos cada 5 segundos...\n');
  
  // El "Lambda" que se ejecuta cada 5 segundos
  setInterval(() => {
    // Generamos números aleatorios realistas para pollos
    const datosSimulados = {
      temperatura: (Math.random() * (35 - 30) + 30).toFixed(2), // Entre 30 y 35°C
      humedad: (Math.random() * (70 - 55) + 55).toFixed(2),     // Entre 55 y 70%
      luminosidad: (Math.random() * (45 - 30) + 30).toFixed(2), // Entre 30 y 45 lux
      amoniaco: (Math.random() * (20 - 10) + 10).toFixed(2),    // Entre 10 y 20 ppm
      co2: (Math.random() * (1600 - 1000) + 1000).toFixed(2)    // Entre 1000 y 1600 ppm
    };
    
    // Convertimos a texto y lo enviamos por el canal de radio
    const mensaje = JSON.stringify(datosSimulados);
    client.publish('jaula/sensores', mensaje);
    
    console.log(`📤 Sensor Falso emitió: ${mensaje}`);
  }, 5000); // 5000 milisegundos = 5 segundos
});