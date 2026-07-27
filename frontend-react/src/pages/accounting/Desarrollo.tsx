import { motion } from "framer-motion";
import {
  Code2,
  Cpu,
  Wifi,
  Database,
  Server,
  Globe,
  GitBranch,
  Layers,
  Gauge,
  Shield,
  Zap,
  CheckCircle,
  Monitor,
  Smartphone,
} from "lucide-react";

const arquitectura = [
  {
    capa: "Capa IoT / Hardware",
    descripcion: "Microcontrolador ESP32 con sensores de temperatura, humedad y NH₃",
    tecnologias: ["ESP32", "DHT22", "MQ-135", "MQTT"],
    icon: Cpu,
    color: "#22c55e",
  },
  {
    capa: "Capa de Comunicación",
    descripcion: "Protocolo HTTP/MQTT para transmisión de datos en tiempo real",
    tecnologias: ["MQTT", "HTTP REST", "WebSocket", "JSON"],
    icon: Wifi,
    color: "#3b82f6",
  },
  {
    capa: "Capa de Datos",
    descripcion: "Base de datos relacional para almacenamiento histórico y análisis",
    tecnologias: ["MySQL", "DynamoDB", "SQLAlchemy", "AWS"],
    icon: Database,
    color: "#8b5cf6",
  },
  {
    capa: "Capa de Aplicación",
    descripcion: "Dashboard web con React, visualización 3D y análisis en tiempo real",
    tecnologias: ["React", "TypeScript", "Tailwind", "Recharts"],
    icon: Globe,
    color: "#f59e0b",
  },
];

const metricas = [
  { label: "Tiempo de Respuesta", value: "< 200ms", icon: Gauge, color: "#22c55e" },
  { label: "Uptime del Sistema", value: "99.7%", icon: Shield, color: "#3b82f6" },
  { label: "Lecturas/Minuto", value: "30", icon: Zap, color: "#f59e0b" },
  { label: "Endpoints API", value: "12", icon: Server, color: "#8b5cf6" },
  { label: "Componentes UI", value: "25+", icon: Layers, color: "#06b6d4" },
  { label: "Versión Actual", value: "v3.0", icon: GitBranch, color: "#ec4899" },
];

const contribuciones = [
  {
    area: "Reducción de Mortalidad",
    antes: "8-12%",
    despues: "3-5%",
    impacto: "Alertas automáticas permiten acción inmediata ante cambios ambientales críticos.",
  },
  {
    area: "Eficiencia Alimentaria",
    antes: "Manual",
    despues: "Automatizado",
    impacto: "Control preciso de raciones según etapa de crecimiento y datos históricos.",
  },
  {
    area: "Toma de Decisiones",
    antes: "Intuición",
    despues: "Datos",
    impacto: "Dashboard con KPIs y recomendaciones basadas en análisis de datos reales.",
  },
  {
    area: "Costos Operativos",
    antes: "Sin control",
    despues: "-20%",
    impacto: "Módulo contable permite identificar gastos excesivos y optimizar recursos.",
  },
];

const timeline = [
  { fase: "Fase 1", titulo: "Investigación y Diseño", estado: "completado" },
  { fase: "Fase 2", titulo: "Hardware IoT (ESP32 + Sensores)", estado: "completado" },
  { fase: "Fase 3", titulo: "Backend API + Base de Datos", estado: "completado" },
  { fase: "Fase 4", titulo: "Dashboard Frontend v1.0", estado: "completado" },
  { fase: "Fase 5", titulo: "Módulo Contable + 3D UI", estado: "completado" },
  { fase: "Fase 6", titulo: "Optimización y Despliegue", estado: "en_progreso" },
];

export default function Desarrollo() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-l-2xl" />
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10">
            <Code2 className="w-6 h-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Desarrollo de Software</h1>
            <p className="text-sm text-muted-foreground">Cómo influyó el software en este proyecto</p>
          </div>
        </div>
      </motion.div>

      {/* Métricas del Sistema */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metricas.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="card-3d"
          >
            <div className="card-3d-inner glass rounded-xl p-4 border border-border text-center">
              <m.icon className="w-5 h-5 mx-auto mb-2" style={{ color: m.color }} />
              <p className="text-lg font-bold text-foreground">{m.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Arquitectura IoT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          Arquitectura del Sistema IoT
        </h3>
        <div className="space-y-4">
          {arquitectura.map((capa, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/50 relative"
            >
              {/* Connection line */}
              {i < arquitectura.length - 1 && (
                <div className="absolute left-[29px] top-full w-0.5 h-4 bg-gradient-to-b from-border to-transparent z-10" />
              )}
              <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: `${capa.color}15` }}>
                <capa.icon className="w-5 h-5" style={{ color: capa.color }} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm">{capa.capa}</h4>
                <p className="text-xs text-muted-foreground mt-1">{capa.descripcion}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {capa.tecnologias.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-secondary text-muted-foreground border border-border/50">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contribuciones del Software */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Contribuciones del Software al Negocio
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contribuciones.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-secondary/20 border border-border/50">
              <h4 className="font-semibold text-foreground text-sm mb-2">{c.area}</h4>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-red-400 line-through">{c.antes}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-xs font-bold text-green-500">{c.despues}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{c.impacto}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Timeline del Proyecto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-purple-500" />
          Timeline del Proyecto
        </h3>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 opacity-30" />
          <div className="space-y-4">
            {timeline.map((fase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-4 pl-2"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  fase.estado === "completado" ? "bg-green-500" : "bg-amber-500 animate-pulse"
                }`}>
                  {fase.estado === "completado" ? (
                    <CheckCircle className="w-3 h-3 text-white" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/50">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{fase.fase}</span>
                    <p className="text-sm font-medium text-foreground">{fase.titulo}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    fase.estado === "completado" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {fase.estado === "completado" ? "Completado" : "En Progreso"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Dispositivos Compatibles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-500" />
          Plataformas Compatibles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Monitor, label: "Desktop", desc: "Chrome, Firefox, Safari", color: "#3b82f6" },
            { icon: Smartphone, label: "Mobile", desc: "Responsive Design", color: "#22c55e" },
            { icon: Cpu, label: "IoT Device", desc: "ESP32 + Sensores", color: "#f59e0b" },
          ].map((plat, i) => (
            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/20 border border-border/50">
              <plat.icon className="w-8 h-8" style={{ color: plat.color }} />
              <div>
                <p className="font-semibold text-foreground text-sm">{plat.label}</p>
                <p className="text-xs text-muted-foreground">{plat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}