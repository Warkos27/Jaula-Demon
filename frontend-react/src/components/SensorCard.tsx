import { SensorReading, getSensorStatus, getStatusColor, SENSOR_THRESHOLDS } from "@/lib/constants";
import { Thermometer, Droplets, Sun, Wind, Cloud } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Temperatura: Thermometer,
  Humedad: Droplets,
  Luminosidad: Sun,
  Amoniaco: Wind,
  CO2: Cloud,
};

const colorMap: Record<string, string> = {
  Temperatura: "#ef4444",
  Humedad: "#3b82f6",
  Luminosidad: "#f59e0b",
  Amoniaco: "#a855f7",
  CO2: "#06b6d4",
};

interface SensorCardProps {
  reading: SensorReading;
  index: number;
}

export default function SensorCard({ reading, index }: SensorCardProps) {
  const status = getSensorStatus(reading.nombre, reading.valor);
  const statusColor = getStatusColor(status);
  const Icon = iconMap[reading.nombre] || Cloud;
  const sensorColor = colorMap[reading.nombre] || "#22c55e";
  const threshold = SENSOR_THRESHOLDS[reading.nombre];

  const percentage = threshold
    ? Math.min(100, Math.max(0, ((reading.valor - (threshold.min || 0)) / ((threshold.dangerMax || threshold.max) - (threshold.min || 0))) * 100))
    : 50;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg opacity-0 animate-slide-up stagger-${index + 1} ${
        status === "danger" ? "sensor-card-danger" : status === "warning" ? "sensor-card-warning" : "sensor-card-normal"
      }`}
    >
      {/* Background SVG pattern */}
      <svg className="absolute top-0 right-0 w-24 h-24 opacity-5" viewBox="0 0 100 100">
        <circle cx="80" cy="20" r="40" fill={sensorColor} />
      </svg>

      {/* Status indicator */}
      <div className="absolute top-3 right-3">
        <div
          className={`w-3 h-3 rounded-full ${status === "danger" ? "animate-blink-warning" : status === "warning" ? "animate-pulse" : ""}`}
          style={{ backgroundColor: statusColor }}
        />
      </div>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center mb-3"
        style={{ backgroundColor: `${sensorColor}15` }}
      >
        <Icon className="w-6 h-6" style={{ color: sensorColor }} />
      </div>

      {/* Name */}
      <p className="text-sm text-muted-foreground font-medium mb-1">{reading.nombre}</p>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tabular-nums" style={{ color: statusColor }}>
          {reading.valor}
        </span>
        <span className="text-sm text-muted-foreground">{reading.unidad}</span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: statusColor,
          }}
        />
      </div>

      {/* Range labels */}
      {threshold && (
        <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
          <span>{threshold.min}{reading.unidad}</span>
          <span className="uppercase tracking-wider font-medium" style={{ color: statusColor }}>
            {status === "normal" ? "Normal" : status === "warning" ? "Alerta" : "Peligro"}
          </span>
          <span>{threshold.max}{reading.unidad}</span>
        </div>
      )}
    </div>
  );
}