# ESP32 Firmware para Jaula-Demon

Este firmware es un ejemplo para el ESP32 que publica datos de sensores simulados al broker MQTT del proyecto.

## Qué hace

- Conecta el ESP32 a tu red WiFi
- Se conecta al broker MQTT de Mosquitto
- Publica JSON en el topic `jaula/sensores`
- Usa valores aleatorios dentro de rangos similares al simulador actual

## Configuración

Edita `src/main.cpp` y cambia:

- `ssid` por tu red WiFi
- `pass` por tu contraseña
- `mqtt_server` por la IP de la máquina donde corre Mosquitto

Si usas Docker en Windows, `mqtt_server` puede ser `host.docker.internal`.

## Rango de datos simulados

- Temperatura: 30.0 - 35.0 °C
- Humedad: 55.0 - 70.0 %
- Luminosidad: 30 - 45 lx
- Amoníaco: 10.0 - 20.0 ppm
- CO2: 1000 - 1600 ppm

## Notas

- El código actual no lee sensores reales.
- Para hardware real reemplaza las funciones de sensor por lecturas de ADC/I2C.
- El broker MQTT debe estar accesible desde la red WiFi del ESP32.
