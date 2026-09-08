#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// ==========================================
// 1. CREDENCIALES DE TU HOTSPOT WINDOWS
// ==========================================
const char* ssid = "JaulaDemon_Red";            
const char* pass = "pollitos123";                   
const char* mqtt_server = "192.168.4.3";    

// ==========================================
// 2. CONFIGURACIÓN DE SENSORES
// ==========================================
#define DHTPIN 4
#define DHTTYPE DHT22
#define MQ135_PIN 32

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.print("\nConectando a la red: ");
  Serial.println(ssid);

  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n¡WiFi conectado exitosamente!");
  Serial.print("IP asignada al ESP32: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Buscando a Mosquitto en la PC... ");
    if (client.connect("esp32-jaula")) {
      Serial.println("¡Conexión MQTT exitosa!");
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
  
  // Encendemos Sensores Físicos
  dht.begin();
  pinMode(MQ135_PIN, INPUT);

  // Encendemos Red
  setup_wifi();
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // --- LECTURA DHT22 ---
  float temperatura = dht.readTemperature();
  float humedad = dht.readHumidity();

  if (isnan(temperatura) || isnan(humedad)) {
    Serial.println("¡ALERTA! Fallo al leer DHT22.");
    delay(2000);
    return;
  }

  // --- LECTURA MQ-135 ---
  int valor_mq135 = analogRead(MQ135_PIN);
  float amoniaco = valor_mq135 * (100.0 / 4095.0); 
  int co2 = map(valor_mq135, 0, 4095, 400, 2000);

  // --- SIMULACIÓN (Hasta conectar fotorresistencia) ---
  int luminosidad = random(30, 45);

  // --- EMPAQUETADO ---
  StaticJsonDocument<256> doc;
  doc["temperatura"] = temperatura;
  doc["humedad"] = humedad;
  doc["luminosidad"] = luminosidad;
  doc["amoniaco"] = amoniaco;
  doc["co2"] = co2;

  char payload[256];
  size_t n = serializeJson(doc, payload);

  Serial.print("Enviando paquete a React: ");
  Serial.println(payload);
  
  // --- ENVÍO A MOSQUITTO ---
  client.publish("jaula/sensores", payload, n);

  delay(3000); 
}