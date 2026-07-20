import { useState, useEffect } from "react";
import { fetchLatestReadings, fetchConfiguracionEtapa } from "@/lib/api";
import { JaulaData, getSensorStatus, getStatusColor, convertirConfiguracionAWS } from "@/lib/constants";

interface SensorPosition {
  id: number;
  name: string;
  zone: string;
  x: number;
  y: number;
  sensorType: string;
}

const sensorPositions: SensorPosition[] = [
  // Zone A - Left
  { id: 1, name: "Temp A", zone: "Zona A", x: 15, y: 25, sensorType: "DHT22" },
  { id: 2, name: "Hum A", zone: "Zona A", x: 15, y: 45, sensorType: "DHT22" },
  { id: 3, name: "Luz A", zone: "Zona A", x: 15, y: 65, sensorType: "BH1750" },
  // Zone B - Center
  { id: 4, name: "Temp B", zone: "Zona B", x: 50, y: 25, sensorType: "DHT22" },
  { id: 5, name: "NH3 B", zone: "Zona B", x: 50, y: 45, sensorType: "MQ-137" },
  { id: 6, name: "CO2 B", zone: "Zona B", x: 50, y: 65, sensorType: "MQ-135" },
  // Zone C - Right
  { id: 7, name: "Temp C", zone: "Zona C", x: 85, y: 25, sensorType: "DHT22" },
  { id: 8, name: "Hum C", zone: "Zona C", x: 85, y: 45, sensorType: "DHT22" },
  { id: 9, name: "Luz C", zone: "Zona C", x: 85, y: 65, sensorType: "BH1750" },
  // Additional sensors
  { id: 10, name: "NH3 A", zone: "Zona A", x: 25, y: 80, sensorType: "MQ-137" },
  { id: 11, name: "CO2 A", zone: "Zona A", x: 35, y: 80, sensorType: "MQ-135" },
  { id: 12, name: "Luz B", zone: "Zona B", x: 65, y: 80, sensorType: "BH1750" },
];

export default function SensorMap() {
  const [data, setData] = useState<JaulaData | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<number | null>(null);
  const [etapa] = useState<string>('pollitos_semana_1');
  const [dynamicThresholds, setDynamicThresholds] = useState<any>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const conf = await fetchConfiguracionEtapa(etapa);
      if (conf) {
        const thresholds = convertirConfiguracionAWS(conf);
        setDynamicThresholds(thresholds);
      }
    };
    loadConfig();
  }, [etapa]);

  useEffect(() => {
    const load = async () => {
      const result = await fetchLatestReadings();
      setData(result);
    };
    load();
    const interval = setInterval(load, 180000);
    return () => clearInterval(interval);
  }, []);

  // Map sensor positions to actual readings (cycling through the 5 sensor types)
  const getSensorReading = (position: SensorPosition) => {
    if (!data) return null;
    const typeMap: Record<string, number> = {
      DHT22: position.name.includes("Temp") ? 0 : 1,
      BH1750: 2,
      "MQ-137": 3,
      "MQ-135": 4,
    };
    const readingIndex = typeMap[position.sensorType] ?? 0;
    const reading = data.lecturas[readingIndex];
    if (!reading) return null;
    // Add slight variation for different zones
    const variation = (position.id % 3 - 1) * 0.5;
    return { ...reading, valor: parseFloat((reading.valor + variation).toFixed(1)) };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Mapa de Sensores</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Distribución espacial de los 12 sensores en la jaula
        </p>
      </div>

      {/* Map */}
      <div className="rounded-xl border bg-card p-5 opacity-0 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Jaula #1 - Vista Superior</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Normal</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Alerta</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Peligro</span>
          </div>
        </div>

        <div className="relative w-full aspect-[2/1] bg-secondary/30 rounded-xl border border-border overflow-hidden">
          {/* Background grid */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="hsl(220 15% 15%)" strokeWidth="0.2" />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="hsl(220 15% 15%)" strokeWidth="0.2" />
            ))}

            {/* Zone dividers */}
            <line x1="33" y1="5" x2="33" y2="95" stroke="hsl(220 15% 25%)" strokeWidth="0.3" strokeDasharray="2 1" />
            <line x1="66" y1="5" x2="66" y2="95" stroke="hsl(220 15% 25%)" strokeWidth="0.3" strokeDasharray="2 1" />

            {/* Zone labels */}
            <text x="16" y="12" fill="hsl(215 20% 45%)" fontSize="3" textAnchor="middle" fontWeight="600">ZONA A</text>
            <text x="50" y="12" fill="hsl(215 20% 45%)" fontSize="3" textAnchor="middle" fontWeight="600">ZONA B</text>
            <text x="83" y="12" fill="hsl(215 20% 45%)" fontSize="3" textAnchor="middle" fontWeight="600">ZONA C</text>

            {/* Walls */}
            <rect x="2" y="2" width="96" height="96" fill="none" stroke="hsl(220 15% 30%)" strokeWidth="0.5" rx="2" />

            {/* Doors */}
            <rect x="45" y="96" width="10" height="2" fill="hsl(142 71% 45%)" opacity="0.5" rx="0.5" />

            {/* Feeders */}
            <circle cx="16" cy="50" r="2" fill="hsl(38 92% 50%)" opacity="0.2" stroke="hsl(38 92% 50%)" strokeWidth="0.3" />
            <circle cx="50" cy="50" r="2" fill="hsl(38 92% 50%)" opacity="0.2" stroke="hsl(38 92% 50%)" strokeWidth="0.3" />
            <circle cx="83" cy="50" r="2" fill="hsl(38 92% 50%)" opacity="0.2" stroke="hsl(38 92% 50%)" strokeWidth="0.3" />

            {/* Sensor nodes */}
            {sensorPositions.map((pos) => {
              const reading = getSensorReading(pos);
              const status = reading ? getSensorStatus(reading.nombre, reading.valor, dynamicThresholds) : "normal";
              const color = getStatusColor(status);
              const isSelected = selectedSensor === pos.id;

              return (
                <g key={pos.id} className="cursor-pointer" onClick={() => setSelectedSensor(isSelected ? null : pos.id)}>
                  {/* Pulse ring */}
                  <circle cx={pos.x} cy={pos.y} r={isSelected ? "4" : "3"} fill="none" stroke={color} strokeWidth="0.3" opacity="0.4">
                    <animate attributeName="r" values={isSelected ? "4;6;4" : "3;4.5;3"} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Main dot */}
                  <circle cx={pos.x} cy={pos.y} r={isSelected ? "2.5" : "1.8"} fill={color} opacity="0.9">
                    {status !== "normal" && (
                      <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.5s" repeatCount="indefinite" />
                    )}
                  </circle>
                  {/* Label */}
                  <text x={pos.x} y={pos.y - 4} fill="hsl(210 40% 96%)" fontSize="2" textAnchor="middle" opacity="0.7">
                    {pos.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Sensor details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-0 animate-slide-up stagger-2">
        {/* Selected sensor info */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            {selectedSensor ? `Sensor: ${sensorPositions.find((s) => s.id === selectedSensor)?.name}` : "Selecciona un sensor"}
          </h3>
          {selectedSensor ? (
            <SensorDetail position={sensorPositions.find((s) => s.id === selectedSensor)!} reading={getSensorReading(sensorPositions.find((s) => s.id === selectedSensor)!)} dynamicThresholds={dynamicThresholds} />
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 mx-auto mb-3 opacity-20" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
                <circle cx="24" cy="24" r="4" fill="currentColor" opacity="0.3" />
                <line x1="24" y1="8" x2="24" y2="16" stroke="currentColor" strokeWidth="1" />
                <line x1="24" y1="32" x2="24" y2="40" stroke="currentColor" strokeWidth="1" />
                <line x1="8" y1="24" x2="16" y2="24" stroke="currentColor" strokeWidth="1" />
                <line x1="32" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="1" />
              </svg>
              <p className="text-xs text-muted-foreground">Haz clic en un sensor del mapa para ver detalles</p>
            </div>
          )}
        </div>

        {/* Sensor inventory */}
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Inventario de Sensores</h3>
          <div className="space-y-3">
            {[
              { type: "DHT22", count: 3, measures: "Temperatura y Humedad", color: "#ef4444" },
              { type: "BH1750", count: 3, measures: "Intensidad de Luz", color: "#f59e0b" },
              { type: "MQ-137", count: 3, measures: "Amoníaco (NH3)", color: "#a855f7" },
              { type: "MQ-135", count: 3, measures: "CO2 / Calidad de Aire", color: "#06b6d4" },
            ].map((sensor) => (
              <div key={sensor.type} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${sensor.color}15` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sensor.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{sensor.type}</p>
                  <p className="text-xs text-muted-foreground">{sensor.measures}</p>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  ×{sensor.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SensorDetail({ position, reading, dynamicThresholds }: { position: SensorPosition; reading: { nombre: string; valor: number; unidad: string } | null; dynamicThresholds?: any }) {
  if (!reading) return <p className="text-sm text-muted-foreground">Sin datos</p>;

  const status = getSensorStatus(reading.nombre, reading.valor, dynamicThresholds);
  const color = getStatusColor(status);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        <span className="text-sm font-medium text-foreground">{position.zone}</span>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>
          {status === "normal" ? "Normal" : status === "warning" ? "Alerta" : "Peligro"}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Tipo</p>
          <p className="text-sm font-medium text-foreground">{position.sensorType}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Medición</p>
          <p className="text-sm font-semibold tabular-nums" style={{ color }}>{reading.valor} {reading.unidad}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Parámetro</p>
          <p className="text-sm font-medium text-foreground">{reading.nombre}</p>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30">
          <p className="text-xs text-muted-foreground">Ubicación</p>
          <p className="text-sm font-medium text-foreground">{position.zone}</p>
        </div>
      </div>
    </div>
  );
}