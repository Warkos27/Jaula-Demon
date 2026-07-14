import { API_URL, JaulaData, SensorReading } from "./constants";

// Simulated data for when API is unavailable
function generateSimulatedData(): JaulaData {
  return {
    id_jaula: 1,
    lecturas: [
      { id_sensor: 1, nombre: "Temperatura", valor: parseFloat((20 + Math.random() * 13).toFixed(1)), unidad: "°C" },
      { id_sensor: 2, nombre: "Humedad", valor: parseFloat((45 + Math.random() * 30).toFixed(1)), unidad: "%" },
      { id_sensor: 4, nombre: "Luminosidad", valor: parseFloat((10 + Math.random() * 50).toFixed(1)), unidad: "lx" },
      { id_sensor: 3, nombre: "Amoniaco", valor: parseFloat((0.5 + Math.random() * 30).toFixed(2)), unidad: "ppm" },
      { id_sensor: 5, nombre: "CO2", valor: parseFloat((400 + Math.random() * 2200).toFixed(1)), unidad: "ppm" },
    ],
    timestamp: new Date().toISOString(),
  };
}

export async function fetchLatestReadings(): Promise<JaulaData> {
  try {
    const response = await fetch(`${API_URL}/lecturas`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("API error");
    const data = await response.json();
    return { ...data, timestamp: new Date().toISOString() };
  } catch {
    // Return simulated data when API is unavailable
    return generateSimulatedData();
  }
}

// Generate historical data for charts
export function generateHistoricalData(hours: number = 24): Array<{ time: string; readings: SensorReading[] }> {
  const data = [];
  const now = new Date();
  const interval = (hours * 60) / 48; // 48 data points

  for (let i = 47; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval * 60000);
    const timeStr = time.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    
    // Add some realistic variation patterns
    const hourOfDay = time.getHours();
    const tempBase = hourOfDay >= 6 && hourOfDay <= 18 ? 26 : 23;
    const lightBase = hourOfDay >= 6 && hourOfDay <= 20 ? 30 : 5;
    
    data.push({
      time: timeStr,
      readings: [
        { id_sensor: 1, nombre: "Temperatura", valor: parseFloat((tempBase + Math.random() * 4 - 2).toFixed(1)), unidad: "°C" },
        { id_sensor: 2, nombre: "Humedad", valor: parseFloat((55 + Math.random() * 15 - 7).toFixed(1)), unidad: "%" },
        { id_sensor: 4, nombre: "Luminosidad", valor: parseFloat((lightBase + Math.random() * 10).toFixed(1)), unidad: "lx" },
        { id_sensor: 3, nombre: "Amoniaco", valor: parseFloat((5 + Math.random() * 15).toFixed(2)), unidad: "ppm" },
        { id_sensor: 5, nombre: "CO2", valor: parseFloat((600 + Math.random() * 800).toFixed(1)), unidad: "ppm" },
      ],
    });
  }
  return data;
}