# Guía rápida: empezar con ESP32 para Jaula-Demon

Propósito: orientar cómo leer sensores en un ESP32 y publicar datos por MQTT al broker (Mosquitto) que ya está en el proyecto.

Resumen mínimo
- Sensores → ESP32 (ADC / I2C / digital) → formatear JSON → publicar en topic `jaula/sensores` vía MQTT.
- Backend (ya existe) escucha `jaula/sensores` y guarda en PostgreSQL.

Requisitos para desarrollo
- ESP32 (DevKitC o similar)
- Entorno: PlatformIO (recomendado) o Arduino IDE
- Librerías MQTT: `PubSubClient` (sincrónico) o `AsyncMqttClient` / `AsyncTCP` para mejor rendimiento

Estructura de mensajes (JSON esperado)
{
  "temperatura": 24.3,
  "humedad": 55.1,
  "luminosidad": 120,
  "amoniaco": 0.12,
  "co2": 420
}

Recomendaciones de sensores/lectura
- Temperatura / Humedad: DHT22 (digital) o SHT3x (I2C). Use la librería correspondiente.
- Luminosidad: LDR con divisor de tensión (ADC) o sensor digital (BH1750 I2C).
- Amoníaco / CO2: sensores analógicos (MQ-series) o sensores específicos con salida analógica; leer con ADC, mapear a unidades aproximadas.

Pasos concretos (rápidos)
1. Configurar WiFi y broker MQTT (IP del host donde corre Mosquitto). En dev suele ser `192.168.X.Y` o `host.docker.internal` si usas Docker en Windows.
2. Leer cada sensor, convertir a unidades, aplicar media móvil simple si hay ruido.
3. Formar JSON y publicar en `jaula/sensores` cada N segundos.

Ejemplo mínimo (PlatformIO / Arduino-style, sintético)
```cpp
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "TU_SSID";
const char* pass = "TU_PASS";
const char* mqtt_server = "192.168.1.100"; // IP del broker

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) delay(500);
}

void reconnect() {
  while (!client.connected()) {
    client.connect("esp32-jaula");
    delay(500);
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  // --- lectura simulada: reemplazar por lectura real de sensores ---
  float temperatura = 24.3;
  float humedad = 55.1;
  int luminosidad = 120;
  float amoniaco = 0.12;
  int co2 = 420;

  StaticJsonDocument<256> doc;
  doc["temperatura"] = temperatura;
  doc["humedad"] = humedad;
  doc["luminosidad"] = luminosidad;
  doc["amoniaco"] = amoniaco;
  doc["co2"] = co2;

  char payload[256];
  size_t n = serializeJson(doc, payload);
  client.publish("jaula/sensores", payload, n);

  client.loop();
  delay(5000);
}
```

Pruebas locales
- Para ver mensajes publicados: en la máquina host (o dentro del contenedor Mosquitto) ejecutar:
```
mosquitto_sub -h localhost -t jaula/sensores -v
```
- Para publicar manualmente:
```
mosquitto_pub -h localhost -t jaula/sensores -m '{"temperatura":20}'
```

Notas de integración
- Asegura que el broker MQTT sea accesible desde la red del ESP32 (mismo WiFi o red con rutas).
- Si Docker corre Mosquitto, en Windows prueba `host.docker.internal` como hostname en el ESP32 config (o la IP real del host).
- Ajusta QoS (0 por defecto) y Retain según necesidad; QoS 0 es suficiente para datos sensoriales frecuentes.

Siguientes pasos recomendados
- Implementar lector real de cada sensor en funciones separadas.
- Añadir reconexión WiFi robusta y manejo de errores MQTT.
- Validar esquema JSON con el backend y ajustar nombres/formatos si hace falta.


