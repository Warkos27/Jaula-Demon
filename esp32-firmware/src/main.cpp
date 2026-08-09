#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// --- CONFIGURACIÓN DE RED ---
const char* ssid = "RED_WIFI";
const char* pass = "CONTRASEÑA_WIFI";
const char* mqtt_server = "192.168.1.100"; // IP local de tu PC (donde corre Mosquitto)

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.print("Conectando a ");
  Serial.println(ssid);

  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.print("Dirección IP del ESP32: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Intentando conexión MQTT...");
    if (client.connect("esp32-jaula")) {
      Serial.println("¡Conectado al broker MQTT!");
    } else {
      Serial.print("Fallo, rc=");
      Serial.print(client.state());
      Serial.println(" Reintentando en 5 segundos...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Si quieres usar sensores reales, reemplaza estas funciones por lecturas ADC/I2C.
  auto readTemperature = []() {
    return random(300, 350) / 10.0;
  };

  auto readHumidity = []() {
    return random(550, 700) / 10.0;
  };

  auto readLuminosity = []() {
    return random(30, 45);
  };

  auto readAmoniaco = []() {
    return random(100, 200) / 10.0;
  };

  auto readCO2 = []() {
    return random(1000, 1600);
  };

  float temperatura = readTemperature();
  float humedad = readHumidity();
  int luminosidad = readLuminosity();
  float amoniaco = readAmoniaco();
  int co2 = readCO2();

  // Construcción del objeto JSON
  StaticJsonDocument<256> doc;
  doc["temperatura"] = temperatura;
  doc["humedad"] = humedad;
  doc["luminosidad"] = luminosidad;
  doc["amoniaco"] = amoniaco;
  doc["co2"] = co2;

  char payload[256];
  size_t n = serializeJson(doc, payload);

  Serial.print("Publicando mensaje MQTT: ");
  Serial.println(payload);
  client.publish("jaula/sensores", payload, n);

  delay(5000);
}

______________________________________________codigo con sensores reales (descomentar al conectar el hardware)______________________________________________

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// --- LIBRERÍAS DE SENSORES REALES (Descomentar al conectar el hardware) ---
// #include <DHT.h>

// --- CONFIGURACIÓN DE RED ---
const char* ssid = "Wokwi-GUEST"; // Red Wi-Fi virtual de Wokwi
const char* pass = "";            // Sin contraseña
const char* mqtt_server = "test.mosquitto.org"; // IP local de tu PC en esa red

// --- CONFIGURACIÓN DE PINES Y SENSORES REALES (Descomentar al conectar hardware) ---
/*
#define DHTPIN 4          // Pin digital para DHT11 / DHT22 (Temperatura y Humedad)
#define DHTTYPE DHT22     // DHT 22 (AM2302)
#define LDR_PIN 34        // Pin analógico ADC para fotorresistencia (Luminosidad)
#define MQ137_PIN 35      // Pin analógico ADC para sensor de Amoniaco
#define MQ135_PIN 32      // Pin analógico ADC para sensor de CO2 / Calidad de aire

DHT dht(DHTPIN, DHTTYPE);
*/

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.print("Conectando a ");
  Serial.println(ssid);

  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi conectado");
  Serial.print("Dirección IP del ESP32: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Intentando conexión MQTT...");
    if (client.connect("esp32-jaula")) {
      Serial.println("¡Conectado al broker MQTT!");
    } else {
      Serial.print("Fallo, rc=");
      Serial.print(client.state());
      Serial.println(" Reintentando en 5 segundos...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);

  // --- INICIALIZACIÓN DE SENSORES REALES ---
  // dht.begin();
  // pinMode(LDR_PIN, INPUT);
  // pinMode(MQ137_PIN, INPUT);
  // pinMode(MQ135_PIN, INPUT);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // =========================================================================
  // 1. LECTURA DE SENSORES - OPCIÓN SIMULADA (ACTIVA)
  // =========================================================================
  float temperatura = random(300, 350) / 10.0;
  float humedad = random(550, 700) / 10.0;
  int luminosidad = random(30, 45);
  float amoniaco = random(100, 200) / 10.0;
  int co2 = random(1000, 1600);

  // =========================================================================
  // 2. LECTURA DE SENSORES - OPCIÓN HARDWARE REAL (DESCOMENTAR CUANDO CONECTES)
  // =========================================================================
  /*
  float temperatura = dht.readTemperature();
  float humedad = dht.readHumidity();
  int luminosidad = analogRead(LDR_PIN);
  
  // Conversión simple de señal ADC (0-4095) a valores estimativos
  float amoniaco = analogRead(MQ137_PIN) * (100.0 / 4095.0); 
  int co2 = map(analogRead(MQ135_PIN), 0, 4095, 400, 2000);

  // Verificación de errores en lectura del DHT
  if (isnan(temperatura) || isnan(humedad)) {
    Serial.println("Error al leer el sensor DHT!");
    delay(2000);
    return;
  }
  */

  // --- CONSTRUCCIÓN Y ENVÍO DEL JSON ---
  StaticJsonDocument<256> doc;
  doc["temperatura"] = temperatura;
  doc["humedad"] = humedad;
  doc["luminosidad"] = luminosidad;
  doc["amoniaco"] = amoniaco;
  doc["co2"] = co2;

  char payload[256];
  size_t n = serializeJson(doc, payload);

  Serial.print("Publicando mensaje MQTT: ");
  Serial.println(payload);
  client.publish("jaula/sensores", payload, n);

  delay(5000);
}