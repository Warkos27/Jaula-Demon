import { useState, useEffect, useMemo } from "react";
import { generateHistoricalData } from "@/lib/api";
import { SENSOR_INFO, SENSOR_THRESHOLDS, SensorReading } from "@/lib/constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { Loader2 } from "lucide-react"; // Importamos un ícono de carga

export default function History() {
  const [selectedSensor, setSelectedSensor] = useState(0);
  const [timeRange, setTimeRange] = useState(24);
  
  // Nuevos estados para manejar los datos asíncronos de la base de datos
  const [historicalData, setHistoricalData] = useState<Array<{ time: string; readings: SensorReading[] }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect para cargar los datos cada vez que cambie el rango de horas
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      const data = await generateHistoricalData(timeRange);
      if (isMounted) {
        setHistoricalData(data);
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [timeRange]);

  const sensor = SENSOR_INFO[selectedSensor];
  const threshold = SENSOR_THRESHOLDS[sensor.name];

  // Filtramos los datos solo para el sensor seleccionado
  const chartData = useMemo(() => {
    return historicalData.map((d) => ({
      time: d.time,
      value: d.readings.find((r) => r.id_sensor === sensor.id)?.valor || 0,
    }));
  }, [historicalData, sensor.id]);

  // Cálculos seguros por si el arreglo viene vacío
  const avgValue = chartData.length > 0 
    ? chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length 
    : 0;
  const maxValue = chartData.length > 0 ? Math.max(...chartData.map((d) => d.value)) : 0;
  const minValue = chartData.length > 0 ? Math.min(...chartData.map((d) => d.value)) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Historial de Sensores</h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            {navigator.onLine ? (
              <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Datos Históricos AWS</>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Historial Local (PostgreSQL)</>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {[6, 12, 24, 48].map((h) => (
            <button
              key={h}
              onClick={() => setTimeRange(h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                timeRange === h
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      {/* Sensor selector */}
      <div className="flex flex-wrap gap-2 opacity-0 animate-slide-up">
        {SENSOR_INFO.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelectedSensor(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              selectedSensor === i
                ? "border shadow-lg"
                : "bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
            }`}
            style={
              selectedSensor === i
                ? { backgroundColor: `${s.color}10`, borderColor: `${s.color}50`, color: s.color }
                : {}
            }
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.name}
          </button>
        ))}
      </div>

      {/* Main chart */}
      <div className="rounded-xl border bg-card p-5 opacity-0 animate-slide-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{sensor.name}</h3>
            <p className="text-xs text-muted-foreground">Sensor: {sensor.sensor} · Últimas {timeRange} horas</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-muted-foreground">
              Promedio: <span className="font-semibold tabular-nums" style={{ color: sensor.color }}>{avgValue.toFixed(1)}{sensor.unit}</span>
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-80 relative flex items-center justify-center">
          {isLoading ? (
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
               <Loader2 className="w-8 h-8 animate-spin text-primary" />
               <p className="text-sm">Consultando base de datos...</p>
             </div>
          ) : chartData.length === 0 ? (
             <p className="text-sm text-muted-foreground">No hay datos históricos en este rango de tiempo.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={sensor.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={sensor.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 15%)" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(215 20% 45%)"
                  fontSize={10}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="hsl(215 20% 45%)"
                  fontSize={10}
                  tickLine={false}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(220 20% 10%)",
                    border: "1px solid hsl(220 15% 20%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "hsl(210 40% 96%)" }}
                  formatter={(value: any) => [`${Number(value).toFixed(2)} ${sensor.unit}`, sensor.name]}
                />
                {threshold && (
                  <>
                    <ReferenceLine
                      y={threshold.max}
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                      label={{ value: `Máx: ${threshold.max}`, position: "right", fontSize: 10, fill: "#f59e0b" }}
                    />
                    {threshold.dangerMax && (
                      <ReferenceLine
                        y={threshold.dangerMax}
                        stroke="#ef4444"
                        strokeDasharray="4 4"
                        strokeWidth={1}
                        label={{ value: `Peligro: ${threshold.dangerMax}`, position: "right", fontSize: 10, fill: "#ef4444" }}
                      />
                    )}
                  </>
                )}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={sensor.color}
                  strokeWidth={2}
                  fill={`url(#gradient-${sensor.id})`}
                  dot={false}
                  activeDot={{ r: 4, fill: sensor.color }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-slide-up stagger-3">
        <StatCard label="Valor Actual" value={chartData[chartData.length - 1]?.value.toFixed(1) || "0"} unit={sensor.unit} color={sensor.color} />
        <StatCard label="Promedio" value={avgValue.toFixed(1)} unit={sensor.unit} color="#3b82f6" />
        <StatCard label="Máximo" value={maxValue.toFixed(1)} unit={sensor.unit} color="#ef4444" />
        <StatCard label="Mínimo" value={minValue.toFixed(1)} unit={sensor.unit} color="#06b6d4" />
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold tabular-nums" style={{ color }}>{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}