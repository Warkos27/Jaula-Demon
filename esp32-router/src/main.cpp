#include <Arduino.h>
#include <WiFi.h>

// El nombre y contraseña de la red exclusiva para las jaulas
const char *ssid = "JaulaDemon_Red";
const char *password = "pollitos123"; // Mínimo 8 caracteres

void setup() {
  Serial.begin(115200);
  Serial.println("\nIniciando el Router ESP32...");

  // Configurar el ESP32 como Punto de Acceso (Access Point)
  WiFi.mode(WIFI_AP);
  WiFi.softAP(ssid, password);

  Serial.print("✅ Red Wi-Fi creada con éxito: ");
  Serial.println(ssid);
  
  // El ESP32 Router siempre se asigna a sí mismo la IP 192.168.4.1 por defecto
  Serial.print("IP del Router: ");
  Serial.println(WiFi.softAPIP()); 
}

void loop() {
  // Este ESP32 no necesita hacer nada más, solo existir y mantener la red viva
  delay(1000);
}