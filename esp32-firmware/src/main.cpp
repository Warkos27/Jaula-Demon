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