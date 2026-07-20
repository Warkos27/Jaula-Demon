import { useState, useEffect } from "react";
import { fetchLatestReadings, fetchConfiguracionEtapa } from "@/lib/api";
import { JaulaData, getSensorStatus, convertirConfiguracionAWS, RISK_MESSAGES, SENSOR_THRESHOLDS, SENSOR_INFO, SensorStatus } from "@/lib/constants";
import { AlertTriangle, AlertCircle, CheckCircle, Shield, Bell, Clock } from "lucide-react";

interface AlertEntry {
  id: number;
  sensorName: string;
  value: number;
  unit: string;
  status: SensorStatus;
  message: string;
  timestamp: string;
  color: string;
}

export default function Alerts() {
  const [data, setData] = useState<JaulaData | null>(null);
  const [alertHistory, setAlertHistory] = useState<AlertEntry[]>([]);
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

      // Build alert history
      if (!result) return;
      const newAlerts: AlertEntry[] = result.lecturas
        .map((r) => {
          const status = getSensorStatus(r.nombre, r.valor, dynamicThresholds);
          const riskMsg = RISK_MESSAGES[r.nombre];
          const sensorInfo = SENSOR_INFO.find((s) => s.id === r.id_sensor);
          if (status === "normal") return null;
          return {
            id: r.id_sensor,
            sensorName: r.nombre,
            value: r.valor,
            unit: r.unidad,
            status,
            message: r.valor > ((dynamicThresholds?.[r.nombre]?.max) || (SENSOR_THRESHOLDS[r.nombre]?.max) || 0) ? riskMsg?.high || "" : riskMsg?.low || riskMsg?.high || "",
            timestamp: new Date().toLocaleTimeString("es-ES"),
            color: sensorInfo?.color || "#22c55e",
          };
        })
        .filter(Boolean) as AlertEntry[];

      setAlertHistory((prev) => [...newAlerts, ...prev].slice(0, 20));
    };
    load();
    const interval = setInterval(load, 180000);
    return () => clearInterval(interval);
  }, [dynamicThresholds]);

  const currentAlerts = data?.lecturas
    .map((r) => ({
      ...r,
      status: getSensorStatus(r.nombre, r.valor),
    }))
    .filter((r) => r.status !== "normal") || [];

  const dangerCount = currentAlerts.filter((a) => a.status === "danger").length;
  const warningCount = currentAlerts.filter((a) => a.status === "warning").length;
  const normalCount = (data?.lecturas.length || 5) - currentAlerts.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Sistema de Alertas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Monitoreo de umbrales críticos y riesgos ambientales
        </p>
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 opacity-0 animate-slide-up">
        <StatusCard
          icon={<CheckCircle className="w-6 h-6 text-green-500" />}
          label="Normal"
          count={normalCount}
          color="#22c55e"
          description="Parámetros dentro de rango"
        />
        <StatusCard
          icon={<AlertTriangle className="w-6 h-6 text-amber-500" />}
          label="Advertencia"
          count={warningCount}
          color="#f59e0b"
          description="Requiere atención"
        />
        <StatusCard
          icon={<AlertCircle className="w-6 h-6 text-red-500" />}
          label="Peligro"
          count={dangerCount}
          color="#ef4444"
          description="Acción inmediata"
        />
      </div>

      {/* Threshold table */}
      <div className="rounded-xl border bg-card p-5 opacity-0 animate-slide-up stagger-2">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Umbrales de Seguridad
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Sensor</th>
                <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Valor Actual</th>
                <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Rango Normal</th>
                <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Umbral Peligro</th>
                <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data?.lecturas.map((r) => {
                const status = getSensorStatus(r.nombre, r.valor);
                const threshold = SENSOR_THRESHOLDS[r.nombre];
                const sensorInfo = SENSOR_INFO.find((s) => s.id === r.id_sensor);
                return (
                  <tr key={r.id_sensor} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sensorInfo?.color }} />
                        <span className="font-medium text-foreground">{r.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="font-semibold tabular-nums" style={{ color: sensorInfo?.color }}>
                        {r.valor} {r.unidad}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-muted-foreground">
                      {threshold?.min} - {threshold?.max} {r.unidad}
                    </td>
                    <td className="py-3 px-3 text-center text-red-400">
                      {threshold?.dangerMax ? `> ${threshold.dangerMax} ${r.unidad}` : "—"}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        status === "normal" ? "bg-green-500/10 text-green-400" :
                        status === "warning" ? "bg-amber-500/10 text-amber-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {status === "normal" ? "✓ Normal" : status === "warning" ? "⚠ Alerta" : "✕ Peligro"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert history */}
      <div className="rounded-xl border bg-card p-5 opacity-0 animate-slide-up stagger-3">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          Historial de Alertas
        </h3>
        {alertHistory.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Sin alertas recientes</p>
            <p className="text-xs text-muted-foreground mt-1">Todos los parámetros están dentro del rango normal</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alertHistory.map((alert, i) => (
              <div
                key={`${alert.id}-${i}`}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  alert.status === "danger"
                    ? "bg-red-500/5 border-red-500/20"
                    : "bg-amber-500/5 border-amber-500/20"
                }`}
              >
                {alert.status === "danger" ? (
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: alert.color }}>{alert.sensorName}</span>
                    <span className="text-xs tabular-nums text-muted-foreground">{alert.value}{alert.unit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Clock className="w-3 h-3" />
                  {alert.timestamp}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({ icon, label, count, color, description }: { icon: React.ReactNode; label: string; count: number; color: string; description: string }) {
  return (
    <div className="rounded-xl border bg-card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold tabular-nums" style={{ color }}>{count}</p>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}