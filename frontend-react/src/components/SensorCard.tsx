import { SensorReading, getSensorStatus, getStatusColor, SENSOR_THRESHOLDS, SensorThreshold } from "@/lib/constants";
import { Thermometer, Droplets, Sun, Wind, Cloud } from "lucide-react";

// 1. Identidad única para cada sensor (Íconos y Colores Base)
const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Temperatura: Thermometer,
  Humedad: Droplets,
  Luminosidad: Sun,
  Amoniaco: Wind,
  CO2: Cloud,
};

const colorMap: Record<string, string> = {
  Temperatura: "#ef4444", // Rojo
  Humedad: "#3b82f6",     // Azul
  Luminosidad: "#f59e0b", // Ámbar
  Amoniaco: "#a855f7",    // Morado
  CO2: "#06b6d4",         // Cian
};

// --------------------------------------------------------
// COMPONENTE: VELOCÍMETRO (Para Gases, Luz y Humedad)
// --------------------------------------------------------
function SpeedometerGauge({ percentage, statusColor, value, unit }: { percentage: number, statusColor: string, value: number, unit: string }) {
  const radius = 40;
  const circumference = Math.PI * radius; 
  const offset = circumference - (percentage / 100) * circumference;
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <div className="w-full flex flex-col items-center justify-center mt-4">
      {/* Contenedor del SVG */}
      <div className="relative w-44 h-22">
        <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible drop-shadow-md">
          {/* Marcas de los bordes (Ticks) */}
          <path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeDasharray="2 4.5" 
            className="text-muted-foreground/30" 
          />
          
          {/* Arco de fondo gris */}
          <path 
            d="M 15 50 A 35 35 0 0 1 85 50" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="8" 
            strokeLinecap="round" 
            className="text-secondary" 
          />
          
          {/* Arco de color animado según el ESTADO (Verde/Naranja/Rojo) */}
          <path
            d="M 15 50 A 35 35 0 0 1 85 50"
            fill="none"
            stroke={statusColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference * (35/40)}
            strokeDashoffset={offset * (35/40)}
            className="transition-all duration-1000 ease-out"
          />

          {/* Aguja del medidor */}
          <g 
            style={{ 
              transform: `translate(50px, 50px) rotate(${rotation}deg)`, 
              transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)' 
            }}
          >
            <polygon points="-2.5,-3 2.5,-3 0,-38" fill="currentColor" className="text-foreground drop-shadow-lg" />
            <circle cx="0" cy="0" r="5" fill="currentColor" className="text-foreground" />
            <circle cx="0" cy="0" r="2.5" fill={statusColor} />
          </g>
        </svg>
      </div>

      {/* Valor Digital ordenado DEBAJO de la gráfica */}
      <div className="mt-4 flex items-baseline gap-1 bg-secondary/20 px-5 py-1.5 rounded-full border border-border/50">
        <span className="text-2xl font-black tabular-nums tracking-tighter" style={{ color: statusColor }}>{value}</span>
        <span className="text-sm font-bold text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// COMPONENTE: TERMÓMETRO (Exclusivo para Temperatura)
// --------------------------------------------------------
function ThermometerGauge({ percentage, statusColor, value, unit }: { percentage: number, statusColor: string, value: number, unit: string }) {
  const liquidHeight = Math.max(12, Math.min(95, percentage));

  return (
    <div className="w-full flex items-center justify-center mt-4 gap-6">
      {/* Estructura del Termómetro más esbelta (w-8 en lugar de w-10) */}
      <div className="relative w-8 h-28 bg-secondary/40 rounded-full border-2 border-border/60 shadow-inner flex flex-col justify-end p-1">
        
        {/* Marcas de medición */}
        <div className="absolute -left-3 top-3 bottom-6 w-2 flex flex-col justify-between items-end">
          <div className="w-2 h-[2px] bg-muted-foreground/40 rounded-full" />
          <div className="w-1 h-[2px] bg-muted-foreground/40 rounded-full" />
          <div className="w-2 h-[2px] bg-muted-foreground/40 rounded-full" />
          <div className="w-1 h-[2px] bg-muted-foreground/40 rounded-full" />
          <div className="w-2 h-[2px] bg-muted-foreground/40 rounded-full" />
        </div>
        
        {/* Líquido animado según ESTADO */}
        <div
          className="w-full rounded-full transition-all duration-1000 ease-out relative z-10"
          style={{ height: `${liquidHeight}%`, backgroundColor: statusColor, boxShadow: `0 0 10px ${statusColor}60` }}
        />
        
        {/* Bulbo base (CENTRADO PERFECTO con left-1/2 y -translate-x-1/2) */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full z-20 border-[4px] border-card transition-colors duration-1000"
          style={{ backgroundColor: statusColor }}
        />
      </div>

      {/* Valor Numérico a la derecha */}
      <div className="flex items-baseline gap-1 bg-secondary/20 px-4 py-2 rounded-xl border border-border/50">
        <span className="text-3xl font-black tabular-nums tracking-tighter" style={{ color: statusColor }}>{value}</span>
        <span className="text-base font-bold text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// TARJETA PRINCIPAL DEL SENSOR
// --------------------------------------------------------
export default function SensorCard({ reading, index, thresholds }: { reading: SensorReading; index: number; thresholds?: Record<string, SensorThreshold> }) {
  const status = getSensorStatus(reading.nombre, reading.valor, thresholds);
  
  // COLOR DEL ESTADO (Verde, Naranja, Rojo) para medidores y alertas
  const statusColor = getStatusColor(status);

  // COLOR BASE DEL SENSOR (Rojo, Azul, Ámbar) para el ícono
  const sensorIdentityColor = colorMap[reading.nombre] || "#ffffff";
  
  const Icon = iconMap[reading.nombre] || Cloud;
  const thresholdData = (thresholds || SENSOR_THRESHOLDS)[reading.nombre];

  const maxLim = thresholdData?.dangerMax || thresholdData?.max || 100;
  const minLim = thresholdData?.dangerMin || thresholdData?.min || 0;
  const percentage = Math.min(100, Math.max(0, ((reading.valor - minLim) / (maxLim - minLim)) * 100));

  const isTemp = reading.nombre === "Temperatura";

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 min-h-[280px] transition-all duration-500 hover:-translate-y-1 hover:shadow-xl opacity-0 animate-slide-up stagger-${index + 1} ${
        status === "danger" ? "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-500/[0.02]" :
        status === "warning" ? "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.08)] bg-amber-500/[0.02]" : "border-border"
      }`}
    >
      {/* Brillo de fondo según ESTADO */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: statusColor }}
      />

      {/* Cabecera de la Tarjeta */}
      <div className="flex justify-between items-start w-full relative z-10">
        <div className="flex items-center gap-3">
          {/* ÍCONO MANTIENE SU COLOR ÚNICO SIEMPRE */}
          <div className="p-2.5 rounded-xl border border-border/50 shadow-sm" style={{ backgroundColor: `${sensorIdentityColor}15` }}>
            <Icon className="w-5 h-5" style={{ color: sensorIdentityColor }} />
          </div>
          <div>
            <p className="font-bold text-foreground text-base tracking-tight">{reading.nombre}</p>
            <p className="text-[10px] uppercase tracking-wider font-black mt-0.5" style={{ color: statusColor }}>
              {status === "normal" ? "Óptimo" : status === "warning" ? "Alerta" : "Peligro"}
            </p>
          </div>
        </div>
        
        {status !== "normal" && (
          <div className="w-3 h-3 rounded-full animate-pulse mt-2" style={{ backgroundColor: statusColor }} />
        )}
      </div>

      {/* Gráfica central que cambia según el ESTADO */}
      <div className="flex-grow flex items-center justify-center relative z-10 w-full">
        {isTemp ? (
          <ThermometerGauge percentage={percentage} statusColor={statusColor} value={reading.valor} unit={reading.unidad} />
        ) : (
          <SpeedometerGauge percentage={percentage} statusColor={statusColor} value={reading.valor} unit={reading.unidad} />
        )}
      </div>

      {/* Rango inferior */}
      {thresholdData && (
        <div className="flex justify-between items-center w-full text-[11px] font-medium text-muted-foreground bg-secondary/30 py-1.5 px-3 rounded-lg border border-border/50 mt-2 relative z-10">
          <span>Min: <strong className="text-foreground">{thresholdData.min}</strong></span>
          <span>Rango Normal</span>
          <span>Max: <strong className="text-foreground">{thresholdData.max}</strong></span>
        </div>
      )}
    </div>
  );
}