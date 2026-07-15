import { useState, useEffect, useRef } from "react";
import { fetchLatestReadings } from "@/lib/api";
import { JaulaData, getSensorStatus, RISK_MESSAGES, LIFECYCLE_PHASES } from "@/lib/constants";
import SensorCard from "@/components/SensorCard";
import AlertBadge, { StatusSummary } from "@/components/AlertBadge";
import { Activity, Clock, Egg, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [data, setData] = useState<JaulaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDay] = useState(18); // Día simulado del ciclo de vida

  // Herramientas para las notificaciones push
  const { toast } = useToast();
  const notifiedAlerts = useRef<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      const result = await fetchLatestReadings();
      setData(result);
      setLoading(false);

      // Escáner de peligros para lanzar notificaciones visuales (Toasts)
      if (result && result.lecturas) {
        result.lecturas.forEach((r: any) => {
          const status = getSensorStatus(r.nombre, r.valor);
          
          // Si hay un peligro y no lo hemos notificado aún en esta sesión
          if (status === "danger" && !notifiedAlerts.current.has(r.id_sensor)) {
            toast({
              variant: "destructive",
              title: `⚠️ Alerta Crítica en la Jaula #1`,
              description: `El sensor de ${r.nombre} registra ${r.valor}${r.unidad}. Revisa la ventilación inmediatamente.`,
            });
            notifiedAlerts.current.add(r.id_sensor); // Marcamos como notificado
          } 
          // Si el sensor vuelve a la normalidad, lo sacamos de la lista negra
          else if (status !== "danger") {
            notifiedAlerts.current.delete(r.id_sensor);
          }
        });
      }
    };
    
    load();
    const interval = setInterval(load, 10000); // 10 segundos // Se actualiza cada 3 minutos
    return () => clearInterval(interval);
  }, [toast]);

  // Cálculos para la fase actual y las alertas en la tabla
  const currentPhase = LIFECYCLE_PHASES.find(
    (p: any) => currentDay >= p.dayRange[0] && currentDay <= p.dayRange[1]
  ) || LIFECYCLE_PHASES[0];

  const alerts = data?.lecturas
    .map((r: any) => {
      const status = getSensorStatus(r.nombre, r.valor);
      const riskMsg = RISK_MESSAGES[r.nombre];
      const message = status !== "normal"
        ? r.valor > (status === "danger" ? 999 : 50) ? riskMsg?.high : riskMsg?.low || riskMsg?.high
        : "";
      return { ...r, status, message: message || "" };
    })
    .filter((a: any) => a.status !== "normal") || [];

  const normalCount = (data?.lecturas.length || 0) - alerts.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-16 h-16 animate-spin-slow" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" stroke="hsl(142 71% 45%)" strokeWidth="2" strokeDasharray="8 4" opacity="0.3" />
            <circle cx="24" cy="24" r="12" stroke="hsl(142 71% 45%)" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            <circle cx="24" cy="8" r="3" fill="hsl(142 71% 45%)" />
          </svg>
          <p className="text-muted-foreground text-sm">Conectando con sensores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sección del encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Panel de Control</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoreo en tiempo real · Jaula #1
          </p>
        </div>
        <StatusSummary
          normalCount={normalCount}
          warningCount={alerts.filter((a: any) => a.status === "warning").length}
          dangerCount={alerts.filter((a: any) => a.status === "danger").length}
        />
      </div>

      {/* Indicador de fase biológica */}
      <div className="rounded-xl border bg-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 opacity-0 animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${currentPhase.color}15` }}>
            <Egg className="w-5 h-5" style={{ color: currentPhase.color }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Fase: {currentPhase.name}
            </p>
            <p className="text-xs text-muted-foreground">{currentPhase.days} · Día actual: {currentDay}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 sm:ml-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Activity className="w-3.5 h-3.5" style={{ color: currentPhase.color }} />
            <span>Temp ideal: {currentPhase.tempRange[0]}-{currentPhase.tempRange[1]}°C</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: currentPhase.color }} />
            <span>{currentPhase.feeding}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" style={{ color: currentPhase.color }} />
            <span>{currentPhase.consumption}</span>
          </div>
        </div>
      </div>

      {/* Cuadrícula de Tarjetas de Sensores (Donde están los velocímetros) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {data?.lecturas.map((reading: any, i: number) => (
          <SensorCard key={reading.id_sensor} reading={reading} index={i} />
        ))}
      </div>

      {/* Sección inferior de Alertas Activas */}
      {alerts.length > 0 && (
        <div className="rounded-xl border bg-card p-5 space-y-3 opacity-0 animate-slide-up stagger-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L1 14h14L8 1z" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
              <path d="M8 6v4M8 11.5v.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Alertas Activas ({alerts.length})
          </h3>
          <div className="space-y-2">
            {alerts.map((alert: any) => (
              <AlertBadge
                key={alert.id_sensor}
                status={alert.status}
                message={alert.message}
                sensorName={alert.nombre}
                value={alert.valor}
                unit={alert.unidad}
              />
            ))}
          </div>
        </div>
      )}

      {/* Estadísticas rápidas inferiores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat
          label="Sensores Activos"
          value="12"
          sublabel="de 12 totales"
          color="#22c55e"
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#22c55e" strokeWidth="2">
              <path d="M12 2a10 10 0 0110 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" />
              <path d="M12 6v6l4 2" strokeLinecap="round" />
            </svg>
          }
        />
        <QuickStat
          label="Tiempo Activo"
          value="99.8%"
          sublabel="últimas 24h"
          color="#3b82f6"
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#3b82f6" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
            </svg>
          }
        />
        <QuickStat
          label="Lecturas Hoy"
          value="480"
          sublabel="cada 3 min"
          color="#f59e0b"
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#f59e0b" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 3v18" />
            </svg>
          }
        />
        <QuickStat
          label="Alertas Hoy"
          value={String(alerts.length)}
          sublabel="activas ahora"
          color={alerts.length > 0 ? "#ef4444" : "#22c55e"}
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={alerts.length > 0 ? "#ef4444" : "#22c55e"} strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

function QuickStat({ label, value, sublabel, color, icon }: { label: string; value: string; sublabel: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4 opacity-0 animate-slide-up stagger-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums" style={{ color }}>{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
    </div>
  );
}