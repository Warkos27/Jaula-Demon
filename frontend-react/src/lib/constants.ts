export const API_URL = "https://8pkac0pg3d.execute-api.us-east-2.amazonaws.com";

export interface SensorReading {
  id_sensor: number;
  nombre: string;
  valor: number;
  unidad: string;
}

export interface JaulaData {
  id_jaula: number;
  lecturas: SensorReading[];
  timestamp?: string;
}

export interface SensorThreshold {
  min: number;
  max: number;
  dangerMin?: number;
  dangerMax?: number;
  unit: string;
}

export interface LifecyclePhase {
  name: string;
  days: string;
  dayRange: [number, number];
  tempRange: [number, number];
  humidity: [number, number];
  light: [number, number];
  nh3Max: number;
  co2Max: number;
  feeding: string;
  consumption: string;
  description: string;
  color: string;
}

export const SENSOR_THRESHOLDS: Record<string, SensorThreshold> = {
  Temperatura: { min: 20, max: 33, dangerMin: 15, dangerMax: 38, unit: "°C" },
  Humedad: { min: 45, max: 70, dangerMin: 30, dangerMax: 80, unit: "%" },
  Luminosidad: { min: 20, max: 50, dangerMin: 5, dangerMax: 100, unit: "lx" },
  Amoniaco: { min: 0, max: 25, dangerMax: 40, unit: "ppm" },
  CO2: { min: 0, max: 2000, dangerMax: 3000, unit: "ppm" },
};

export const LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    name: "Inicio",
    days: "Días 1-14",
    dayRange: [1, 14],
    tempRange: [32, 33],
    humidity: [60, 70],
    light: [30, 40],
    nh3Max: 10,
    co2Max: 1500,
    feeding: "Iniciador (Alta proteína)",
    consumption: "15g al inicio hasta 50g diarios (Aprox. 500g total)",
    description: "Dependencia total de criadora. Etapa de mayor vulnerabilidad.",
    color: "#f59e0b",
  },
  {
    name: "Crecimiento",
    days: "Días 15-28",
    dayRange: [15, 28],
    tempRange: [24, 28],
    humidity: [55, 65],
    light: [20, 30],
    nh3Max: 20,
    co2Max: 2000,
    feeding: "Pellets medianos (Crecimiento)",
    consumption: "60g hasta 120g diarios (Aprox. 1.2-1.5 Kg total)",
    description: "Generación de calor corporal. Crecimiento rápido muscular y óseo.",
    color: "#3b82f6",
  },
  {
    name: "Engorde",
    days: "Días 29-42",
    dayRange: [29, 42],
    tempRange: [20, 22],
    humidity: [50, 60],
    light: [15, 20],
    nh3Max: 25,
    co2Max: 2000,
    feeding: "Finalizador (Alta energía)",
    consumption: "130g hasta 200g diarios (Aprox. 2.5-3 Kg total)",
    description: "Riesgo de estrés calórico. Máxima ventilación requerida.",
    color: "#22c55e",
  },
];

export const SENSOR_INFO = [
  { id: 1, name: "Temperatura", icon: "thermometer", unit: "°C", color: "#ef4444", sensor: "DHT22" },
  { id: 2, name: "Humedad", icon: "droplets", unit: "%", color: "#3b82f6", sensor: "DHT22" },
  { id: 4, name: "Luminosidad", icon: "sun", unit: "lx", color: "#f59e0b", sensor: "BH1750" },
  { id: 3, name: "Amoniaco", icon: "wind", unit: "ppm", color: "#a855f7", sensor: "MQ-137" },
  { id: 5, name: "CO2", icon: "cloud", unit: "ppm", color: "#06b6d4", sensor: "MQ-135" },
];

export const RISK_MESSAGES: Record<string, { high: string; low: string }> = {
  Temperatura: {
    high: "Estrés calórico: jadeo, menor consumo de alimento, riesgo de mortalidad",
    low: "Hipotermia: los pollitos se amontonan, menor crecimiento",
  },
  Humedad: {
    high: "Cama húmeda, proliferación bacteriana, dermatitis plantar",
    low: "Polvo excesivo, irritación ocular y respiratoria",
  },
  Luminosidad: {
    high: "Estrés, agresividad, problemas oculares",
    low: "Oscuridad insuficiente, ciclos de sueño alterados",
  },
  Amoniaco: {
    high: "Conjuntivitis, lesiones en tráquea, menor ganancia de peso",
    low: "",
  },
  CO2: {
    high: "Hipoxia, jadeo, mortalidad en primeras semanas",
    low: "",
  },
};

export type SensorStatus = "normal" | "warning" | "danger";

export function getSensorStatus(name: string, value: number): SensorStatus {
  const threshold = SENSOR_THRESHOLDS[name];
  if (!threshold) return "normal";

  if (threshold.dangerMax && value >= threshold.dangerMax) return "danger";
  if (threshold.dangerMin && value <= threshold.dangerMin) return "danger";
  if (value > threshold.max) return "warning";
  if (value < threshold.min) return "warning";
  return "normal";
}

export function getStatusColor(status: SensorStatus): string {
  switch (status) {
    case "normal": return "#22c55e";
    case "warning": return "#f59e0b";
    case "danger": return "#ef4444";
  }
}