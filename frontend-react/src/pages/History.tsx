import { useState, useMemo } from "react";
import { generateHistoricalData } from "@/lib/api";
import { SENSOR_INFO, SENSOR_THRESHOLDS } from "@/lib/constants";
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

export default function History() {
  const [selectedSensor, setSelectedSensor] = useState(0);
  const [timeRange, setTimeRange] = useState(24);

  const historicalData = useMemo(() => generateHistoricalData(timeRange), [timeRange]);
  const sensor = SENSOR_INFO[selectedSensor];
  const threshold = SENSOR_THRESHOLDS[sensor.name];

  const chartData = historicalData.map((d) => ({
    time: d.time,
    value: d.readings.find((r) => r.id_sensor === sensor.id)?.valor || 0,
  }));

  const avgValue = chartData.reduce((sum, d) => sum + d.value, 0) / chartData.length;
  const maxValue = Math.max(...chartData.map((d) => d.value));
  const minValue = Math.min(...chartData.map((d) => d.value));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Historial de Sensores</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Datos históricos y tendencias de los sensores
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

        <div className="h-64 sm:h-80">
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
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 opacity-0 animate-slide-up stagger-3">
        <StatCard label="Valor Actual" value={chartData[chartData.length - 1]?.value.toFixed(1) || "0"} unit={sensor.unit} color={sensor.color} />
        <StatCard label="Promedio" value={avgValue.toFixed(1)} unit={sensor.unit} color="#3b82f6" />
        <StatCard label="Máximo" value={maxValue.toFixed(1)} unit={sensor.unit} color="#ef4444" />
        <StatCard label="Mínimo" value={minValue.toFixed(1)} unit={sensor.unit} color="#06b6d4" />
      </div>

      {/* All sensors mini charts */}
      <div className="rounded-xl border bg-card p-5 opacity-0 animate-slide-up stagger-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Vista General - Todos los Sensores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SENSOR_INFO.map((s) => {
            const sData = historicalData.map((d) => ({
              time: d.time,
              value: d.readings.find((r) => r.id_sensor === s.id)?.valor || 0,
            }));
            return (
              <div key={s.id} className="p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">{s.name}</span>
                  <span className="text-xs font-semibold tabular-nums" style={{ color: s.color }}>
                    {sData[sData.length - 1]?.value.toFixed(1)}{s.unit}
                  </span>
                </div>
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sData.slice(-20)}>
                      <Line type="monotone" dataKey="value" stroke={s.color} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
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