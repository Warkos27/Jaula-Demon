import { API_URL, JaulaData, SensorReading } from "./constants";

// Definimos la ruta de tu nuevo cerebro local
const LOCAL_API_URL = "http://192.168.4.4:3000/api";

// Función 1: Obtener la configuración ideal según la Etapa del pollo
export async function fetchConfiguracionEtapa(etapa: string) {
  try {
    const res = await fetch(`${API_URL}/configuraciones?etapa=${etapa}`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.error("Error al traer configuración de AWS:", err);
    return null;
  }
}

// Función 2: Obtener datos con Arquitectura Híbrida (AWS -> Fallback Local)
export async function fetchLatestReadings(jaulaId: number = 1): Promise<JaulaData | null> {
  try {
    let response;
    let isLocal = false;
    let rawData;

    // 1. Lógica Híbrida: Verificamos si hay red
    if (navigator.onLine) {
      try {
        // Intentamos ir a AWS primero (Límite de 3 segundos)
        response = await fetch(`${API_URL}/lecturas?jaula=${jaulaId}`, { signal: AbortSignal.timeout(3000) });
        if (!response.ok) throw new Error("AWS respondió con error");
        
        rawData = await response.json();
        
        // EL TRUCO: Si AWS responde bien, pero está VACÍO, forzamos el error para ir a tu Local
        if (Array.isArray(rawData) && rawData.length === 0) {
          throw new Error("AWS está vacío en este momento");
        }
        
      } catch (e) {
        // Si no hay internet, AWS se cayó o está vacío, ACTIVAMOS EL PLAN B LOCAL
        console.warn("⚠️ AWS vacío o inalcanzable, cambiando a servidor local (PostgreSQL)...");
        response = await fetch(`${LOCAL_API_URL}/sensores/actual`);
        rawData = await response.json();
        isLocal = true;
      }
    } else {
      // Sin internet total, vamos directo al plan B
      console.log("🔌 Sin internet. Operando en modo Offline con servidor local.");
      response = await fetch(`${LOCAL_API_URL}/sensores/actual`);
      rawData = await response.json();
      isLocal = true;
    }

    if (!response?.ok || !rawData) return null;

    // 2. Transformamos los datos para que React los entienda
    if (isLocal) {
      // Estructura de tu PostgreSQL Local
      const lecturasFormateadas: SensorReading[] = [
        { id_sensor: 1, nombre: "Temperatura", valor: Number(rawData.temperatura), unidad: "°C" },
        { id_sensor: 2, nombre: "Humedad", valor: Number(rawData.humedad), unidad: "%" },
        { id_sensor: 4, nombre: "Luminosidad", valor: Number(rawData.luminosidad), unidad: "lx" },
        { id_sensor: 3, nombre: "Amoniaco", valor: Number(rawData.amoniaco), unidad: "ppm" },
        { id_sensor: 5, nombre: "CO2", valor: Number(rawData.co2), unidad: "ppm" },
      ];
      return { id_jaula: jaulaId, lecturas: lecturasFormateadas, timestamp: rawData.fecha_registro };
      
    } else {
      // Estructura de DynamoDB AWS
      let finalData = rawData;
      if (Array.isArray(rawData) && rawData.length > 0) {
        finalData = rawData[rawData.length - 1]; 
      }

      const lecturasFinales = finalData.datos_sensores || finalData.lecturas;
      if (!lecturasFinales || lecturasFinales.length === 0) return null;
      
      return { 
        id_jaula: jaulaId, 
        lecturas: lecturasFinales, 
        timestamp: finalData.fecha_hora || new Date().toISOString() 
      };
    }
    
  } catch (error) {
    console.error("❌ Fallo crítico: Ni AWS ni Local están respondiendo.", error);
    return null; 
  }
}

//ETAPA FUNCTION HISTORY SIN PARCHE

export async function generateHistoricalData(hours: number = 24): Promise<Array<{ time: string; readings: SensorReading[] }>> {
  try {
    // Si no hay internet, pedimos los datos al backend local
    if (!navigator.onLine) {
      const response = await fetch(`${LOCAL_API_URL}/sensores/historial?horas=${hours}`);
      if (!response.ok) return [];
      
      const rawRows = await response.json();
      return rawRows.map((fila: any) => ({
        // Formateamos la hora para que se vea bien en la gráfica (ej: 14:30)
        time: new Date(fila.fecha_registro).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        readings: [
          { id_sensor: 1, nombre: "Temperatura", valor: Number(fila.temperatura), unidad: "°C" },
          { id_sensor: 2, nombre: "Humedad", valor: Number(fila.humedad), unidad: "%" },
          { id_sensor: 4, nombre: "Luminosidad", valor: Number(fila.luminosidad), unidad: "lx" },
          { id_sensor: 3, nombre: "Amoniaco", valor: Number(fila.amoniaco), unidad: "ppm" },
          { id_sensor: 5, nombre: "CO2", valor: Number(fila.co2), unidad: "ppm" }
        ]
      }));
    }
    
    // Aquí iría el fetch  API de AWS para el historial si hay internet
    // const response = await fetch(`${API_URL}/historial?horas=${hours}`); ...
    
    return []; // Temporal hasta que LUIGI amigo configure la ruta en AWS
  } catch (err) {
    console.error("Error obteniendo historial:", err);
    return [];
  }
}