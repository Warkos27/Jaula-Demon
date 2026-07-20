import { API_URL, JaulaData, SensorReading } from "./constants";

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

// Función 2: Obtener datos 100% REALES de la base de datos para una Jaula específica
export async function fetchLatestReadings(jaulaId: number = 1): Promise<JaulaData | null> {
  try {
    const response = await fetch(`${API_URL}/lecturas?jaula=${jaulaId}`);
    
    if (!response.ok) {
      throw new Error(`AWS API respondió con error: ${response.status}`);
    }
    
    const rawData = await response.json();
    let finalData = rawData;

    // Extraemos el paquete de la lista que devuelve AWS
    if (Array.isArray(rawData) && rawData.length > 0) {
      finalData = rawData[rawData.length - 1]; 
    } else if (Array.isArray(rawData) && rawData.length === 0) {
      return null; 
    }

    // Adaptamos a la estructura de la base de datos (datos_sensores o lecturas)
    const lecturasFinales = finalData.datos_sensores || finalData.lecturas;
    
    if (!lecturasFinales || lecturasFinales.length === 0) {
      return null;
    }
    
    return { 
      id_jaula: jaulaId, 
      lecturas: lecturasFinales, 
      timestamp: finalData.fecha_hora || new Date().toISOString() 
    };
    
  } catch (error) {
    console.error("❌ Conexión fallida o sin datos. NO se usarán datos falsos.", error);
    return null; // El simulador local está muerto y enterrado
  }
}

// Función 3: EL PARCHE QUE FALTABA PARA QUE HISTORY.TSX NO COLAPSE
// Por ahora devolvemos un arreglo vacío. Más adelante conectaremos esto a AWS.
export function generateHistoricalData(_hours: number = 24): Array<{ time: string; readings: SensorReading[] }> {
  return []; 
}