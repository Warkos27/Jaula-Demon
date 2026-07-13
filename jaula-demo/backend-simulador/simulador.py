import requests
import time
import random

URL_API = "https://8pkac0pg3d.execute-api.us-east-2.amazonaws.com/lecturas"

TIEMPO_ESPERA_MINUTOS = 3

print(f"Iniciando simulador de sensores de la jaula...")
print(f"Los datos se enviarán cada {TIEMPO_ESPERA_MINUTOS} minutos.")
print("Presiona las teclas Ctrl+C en esta consola para detenerlo en cualquier momento.\n")

while True:
    try:
     
        temp = round(random.uniform(20.0, 26.0), 1)  
        hum = round(random.uniform(50.0, 75.0), 1)   
        amon = round(random.uniform(0.5, 2.5), 2)   
        luz = round(random.uniform(100.0, 500.0), 1)
        co2 = round(random.uniform(400.0, 800.0), 1)
      
        paquete_datos = {
            "id_jaula": 1,
            "lecturas": [
                {"id_sensor": 1, "nombre": "Temperatura", "valor": temp, "unidad": "°C"},
                {"id_sensor": 2, "nombre": "Humedad", "valor": hum, "unidad": "%"},
                {"id_sensor": 4, "nombre": "Luminosidad", "valor": luz, "unidad": "lx"},
                {"id_sensor": 3, "nombre": "Amoniaco", "valor": amon, "unidad": "ppm"},
                {"id_sensor": 5, "nombre": "CO2", "valor": co2, "unidad": "ppm"}   
            ]
        }
        
        respuesta = requests.post(URL_API, json=paquete_datos)
        
        print(f"[ENVIADO] Temp: {temp}°C | Hum: {hum}% | Luz: {luz}lx | Amoníaco: {amon}ppm | CO2: {co2}ppm")
        print(f"[AWS RESPONDE] {respuesta.text}\n")
        
    except Exception as e:
        print(f"[ERROR] Hubo un problema al enviar los datos: {e}")
        
    time.sleep(TIEMPO_ESPERA_MINUTOS * 60)