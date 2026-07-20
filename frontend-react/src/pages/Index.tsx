import { useState, useEffect, useRef } from "react";
import { fetchLatestReadings, fetchConfiguracionEtapa } from "@/lib/api";
import { JaulaData, getSensorStatus, convertirConfiguracionAWS } from "@/lib/constants";
import SensorCard from "@/components/SensorCard";
import AlertBadge from "@/components/AlertBadge";
import { useToast } from "@/hooks/use-toast";
import { Database, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  // 1. Estados de Selección (Lo que el usuario elige)
  const [selectedJaula, setSelectedJaula] = useState<number>(1);
  const [etapa, setEtapa] = useState<string>('pollitos_semana_1');

  // 2. Estados de Datos Reales (Lo que devuelve AWS)
  const [data, setData] = useState<JaulaData | null>(null);
  const [configAWS, setConfigAWS] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // 3. Thresholds dinámicos derivados de la configuración
  const [dynamicThresholds, setDynamicThresholds] = useState<any>(null);

  const { toast } = useToast();
  const notifiedAlerts = useRef<Set<number>>(new Set());

  // Efecto para cargar la Configuración de la Etapa cuando el usuario la cambia
  useEffect(() => {
    const loadConfig = async () => {
      const conf = await fetchConfiguracionEtapa(etapa);
      setConfigAWS(conf);
      // Convertir la configuración de AWS a thresholds dinámicos
      if (conf) {
        const thresholds = convertirConfiguracionAWS(conf);
        setDynamicThresholds(thresholds);
        console.log("✅ Configuración de AWS cargada para etapa:", etapa, conf);
      }
    };
    loadConfig();
  }, [etapa]);

  // Efecto para cargar los Sensores Reales de la Jaula seleccionada
  useEffect(() => {
    const loadSensores = async () => {
      const result = await fetchLatestReadings(selectedJaula);
      setData(result);
      setLoading(false);

      if (result && result.lecturas) {
        result.lecturas.forEach((r: any) => {
          // Usar los thresholds dinámicos si existen, si no, usar los por defecto
          const status = getSensorStatus(r.nombre, r.valor, dynamicThresholds);
          if (status === "danger" && !notifiedAlerts.current.has(r.id_sensor)) {
            toast({
              variant: "destructive",
              title: `⚠️ Alerta Crítica en la Jaula #${selectedJaula}`,
              description: `El sensor de ${r.nombre} registra ${r.valor}${r.unidad}. Acción requerida.`,
              duration: 25000,
            });
            notifiedAlerts.current.add(r.id_sensor);
          } else if (status !== "danger") {
            notifiedAlerts.current.delete(r.id_sensor);
          }
        });
      }
    };
    
    loadSensores();
    // Petición a la base de datos cada 10 segundos
    const interval = setInterval(loadSensores, 2000); 
    return () => clearInterval(interval);
  }, [selectedJaula, toast, dynamicThresholds]);

  // Cálculos de Alertas
  const alerts = data?.lecturas
    .map((r: any) => {
      const status = getSensorStatus(r.nombre, r.valor, dynamicThresholds);
      return { ...r, status, message: status !== "normal" ? "Revisar parámetros fuera de rango" : "" };
    })
    .filter((a: any) => a.status !== "normal") || [];

  // <-- normalCount eliminado para limpiar el error de TypeScript

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Database className="w-10 h-10 animate-pulse text-primary" />
          <p className="text-muted-foreground font-medium">Consultando Base de Datos AWS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ---------------- BARRA DE CONTROL PRINCIPAL ---------------- */}
      <header className="bg-card rounded-2xl shadow-sm border border-border p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-2xl" />
        
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard de Monitoreo</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Conectado a DynamoDB (Datos Reales)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Selector de Jaula */}
          <div className="flex-1 sm:w-48">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Sector / Jaula
            </label>
            <select 
              value={selectedJaula}
              onChange={(e) => {
                setLoading(true);
                setData(null);
                setSelectedJaula(Number(e.target.value));
              }}
              className="w-full bg-secondary/50 border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5 outline-none cursor-pointer font-medium transition-colors hover:bg-secondary"
            >
              <option value={1}>Cámara de Crianza #1</option>
              <option value={2}>Cámara de Crianza #2</option>
              <option value={3}>Cámara de Crianza #3</option>
            </select>
          </div>

          {/* Selector de Etapa / Ciclo de Vida */}
          <div className="flex-1 sm:w-56">
            <label className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Ciclo de Vida
            </label>
            <select 
              value={etapa}
              onChange={(e) => setEtapa(e.target.value)}
              className="w-full bg-secondary/50 border border-border text-foreground text-sm rounded-lg focus:ring-primary focus:border-primary p-2.5 outline-none cursor-pointer font-medium transition-colors hover:bg-secondary"
            >
              <option value="pollitos_semana_1">Semana 1 (Días 1-7)</option>
              <option value="pollitos_semana_2">Semana 2 (Días 8-14)</option>
              <option value="pollitos_semana_3">Semana 3 (Días 15-21)</option>
              <option value="pollitos_semana_4">Semana 4 (Días 22-28)</option>
              <option value="pollitos_semana_5">Semana 5 (Días 29-35)</option>
              <option value="pollitos_semana_6">Semana 6 (Días 36-42)</option>
            </select>
          </div>
        </div>
      </header>

      {/* ---------------- RESUMEN DE ETAPA ---------------- */}
      {configAWS && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3 opacity-0 animate-slide-up">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Database className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              <span className="font-bold text-primary mr-1">Estado Biológico:</span> 
              {configAWS.descripcion || "Parámetros actualizados según etapa de crianza."}
            </p>
          </div>
        </div>
      )}

      {/* ---------------- PANTALLA SI LA JAULA NO TIENE DATOS ---------------- */}
      {!data ? (
        <div className="rounded-2xl border border-dashed border-border p-12 flex flex-col items-center justify-center text-center opacity-0 animate-fade-in bg-card/50">
          <AlertTriangle className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-bold text-foreground">Sin Registros en Base de Datos</h3>
          <p className="text-muted-foreground text-sm max-w-md mt-2">
            La Cámara de Crianza #{selectedJaula} actualmente no tiene datos guardados en AWS DynamoDB. Asegúrate de que los sensores estén encendidos y transmitiendo.
          </p>
        </div>
      ) : (
        <>
          {/* ---------------- CUADRÍCULA DE SENSORES ---------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {data.lecturas.map((reading: any, i: number) => (
              <SensorCard key={reading.id_sensor || i} reading={reading} index={i} thresholds={dynamicThresholds} />
            ))}
          </div>

          {/* ---------------- ALERTAS ACTIVAS ---------------- */}
          {alerts.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3 opacity-0 animate-slide-up stagger-3">
              <h3 className="text-sm font-bold text-amber-500 flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4" />
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
        </>
      )}
    </div>
  );
}