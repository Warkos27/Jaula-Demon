import { motion } from "framer-motion";
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Scale,
  Gauge,
  ClipboardList,
  Boxes,
  Brain,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ComposedChart,
  Area,
  Line,
} from "recharts";
import { useState } from "react";

// === METAS Y PLANIFICACIÓN POR LOTE ===

const metasLotes = [
  {
    lote: "Lote 14",
    estado: "En curso",
    metas: {
      pesoObjetivo: 2.8,
      pesoActual: 2.6,
      mortalidadMax: 5.0,
      mortalidadActual: 4.8,
      conversionAlimenticia: 1.8,
      conversionActual: 1.85,
      diasCiclo: 42,
      diasActuales: 35,
      ingresosEsperados: 12000,
      costoMaximo: 7000,
    },
  },
  {
    lote: "Lote 15",
    estado: "En curso",
    metas: {
      pesoObjetivo: 3.0,
      pesoActual: 1.8,
      mortalidadMax: 4.5,
      mortalidadActual: 3.2,
      conversionAlimenticia: 1.75,
      conversionActual: 1.70,
      diasCiclo: 45,
      diasActuales: 22,
      ingresosEsperados: 14000,
      costoMaximo: 7500,
    },
  },
  {
    lote: "Lote 13",
    estado: "Finalizado",
    metas: {
      pesoObjetivo: 2.5,
      pesoActual: 2.5,
      mortalidadMax: 5.0,
      mortalidadActual: 5.3,
      conversionAlimenticia: 1.80,
      conversionActual: 1.82,
      diasCiclo: 42,
      diasActuales: 42,
      ingresosEsperados: 9000,
      costoMaximo: 5500,
    },
  },
];

const rendimientoRadar = [
  { subject: "Peso", A: 93, meta: 100 },
  { subject: "Mortalidad", A: 88, meta: 100 },
  { subject: "Conversión", A: 85, meta: 100 },
  { subject: "Costos", A: 90, meta: 100 },
  { subject: "Tiempo", A: 95, meta: 100 },
  { subject: "Sanidad", A: 92, meta: 100 },
];

const progresoSemanal = [
  { semana: "S1", pesoReal: 0.3, pesoMeta: 0.35, mortalidad: 1.2 },
  { semana: "S2", pesoReal: 0.7, pesoMeta: 0.75, mortalidad: 0.8 },
  { semana: "S3", pesoReal: 1.1, pesoMeta: 1.15, mortalidad: 0.5 },
  { semana: "S4", pesoReal: 1.6, pesoMeta: 1.60, mortalidad: 0.4 },
  { semana: "S5", pesoReal: 2.1, pesoMeta: 2.10, mortalidad: 0.3 },
  { semana: "S6", pesoReal: 2.6, pesoMeta: 2.80, mortalidad: 0.2 },
];

const recursosDistribucion = [
  { recurso: "Alimento", asignado: 6500, usado: 5800, porcentaje: 89 },
  { recurso: "Medicina", asignado: 2000, usado: 1650, porcentaje: 82 },
  { recurso: "Servicios", asignado: 1500, usado: 1320, porcentaje: 88 },
  { recurso: "Personal", asignado: 3200, usado: 3200, porcentaje: 100 },
  { recurso: "Contingencia", asignado: 800, usado: 230, porcentaje: 29 },
];

const decisiones = [
  {
    titulo: "Aumentar ración de alimento en Lote 14",
    razon: "El peso actual (2.6 kg) está 7% por debajo de la meta (2.8 kg) a 5 semanas.",
    prioridad: "alta",
    accion: "Incrementar 10% la ración diaria",
  },
  {
    titulo: "Mantener protocolo sanitario en Lote 15",
    razon: "La mortalidad (3.2%) está por debajo de la meta máxima (4.5%). Buen resultado.",
    prioridad: "info",
    accion: "Continuar sin cambios",
  },
  {
    titulo: "Revisar proveedor de alimento",
    razon: "La conversión alimenticia del Lote 14 (1.85) supera ligeramente la meta (1.80).",
    prioridad: "media",
    accion: "Evaluar calidad del alimento actual",
  },
  {
    titulo: "Programar venta de Lote 14 en 7 días",
    razon: "El lote alcanzará los 42 días de ciclo. Contactar compradores.",
    prioridad: "media",
    accion: "Contactar Distribuidora Avícola Sur",
  },
];

function ChartDescription({ text }: { text: string }) {
  return (
    <div className="relative inline-block group mb-1">
      <div className="w-5 h-5 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center cursor-help hover:bg-blue-500/10 hover:border-blue-500/30 transition-colors">
        <span className="text-[10px] font-bold text-muted-foreground group-hover:text-blue-500 transition-colors">?</span>
      </div>
      <div className="absolute left-0 top-7 z-50 w-72 p-3 rounded-xl bg-card border border-border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 rounded-full bg-secondary/50 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function Administracion() {
  const [loteSeleccionado, setLoteSeleccionado] = useState(0);
  const lote = metasLotes[loteSeleccionado];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-l-2xl" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Administración</h1>
              <p className="text-sm text-muted-foreground">
                Planificación de metas · Manejo de recursos · Toma de decisiones
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Target className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-xs font-medium text-blue-500">Metas Activas</span>
          </div>
        </div>
      </motion.div>

      {/* Selector de Lote */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3 flex-wrap"
      >
        {metasLotes.map((l, i) => (
          <button
            key={i}
            onClick={() => setLoteSeleccionado(i)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              loteSeleccionado === i
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                : "glass border border-border text-foreground hover:bg-secondary/50"
            }`}
          >
            <span className="flex items-center gap-2">
              {l.lote}
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                l.estado === "En curso" ? "bg-green-500/20 text-green-500" : "bg-slate-500/20 text-slate-400"
              }`}>
                {l.estado}
              </span>
            </span>
          </button>
        ))}
      </motion.div>

      {/* Metas del Lote Seleccionado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Metas y Objetivos — {lote.lote}
        </h3>
        <ChartDescription text="Define los objetivos para cada lote: peso promedio deseado, mortalidad máxima aceptable, conversión alimenticia ideal y presupuesto. Compara el progreso real vs la meta para tomar decisiones a tiempo." />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Peso */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Peso Promedio</span>
              <Gauge className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-foreground">{lote.metas.pesoActual} kg</span>
              <span className="text-xs text-muted-foreground mb-1">/ {lote.metas.pesoObjetivo} kg meta</span>
            </div>
            <ProgressBar value={lote.metas.pesoActual} max={lote.metas.pesoObjetivo} color="#3b82f6" />
            <div className="flex items-center gap-1 mt-2">
              {lote.metas.pesoActual >= lote.metas.pesoObjetivo ? (
                <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-xs text-green-500">Meta alcanzada</span></>
              ) : (
                <><ArrowUpRight className="w-3.5 h-3.5 text-amber-500" /><span className="text-xs text-amber-500">Faltan {(lote.metas.pesoObjetivo - lote.metas.pesoActual).toFixed(1)} kg</span></>
              )}
            </div>
          </div>

          {/* Mortalidad */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Mortalidad</span>
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-foreground">{lote.metas.mortalidadActual}%</span>
              <span className="text-xs text-muted-foreground mb-1">/ {lote.metas.mortalidadMax}% máx</span>
            </div>
            <ProgressBar value={lote.metas.mortalidadActual} max={lote.metas.mortalidadMax} color={lote.metas.mortalidadActual > lote.metas.mortalidadMax ? "#ef4444" : "#22c55e"} />
            <div className="flex items-center gap-1 mt-2">
              {lote.metas.mortalidadActual <= lote.metas.mortalidadMax ? (
                <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-xs text-green-500">Dentro del rango</span></>
              ) : (
                <><XCircle className="w-3.5 h-3.5 text-red-500" /><span className="text-xs text-red-500">Excede la meta</span></>
              )}
            </div>
          </div>

          {/* Conversión Alimenticia */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Conversión Alimenticia</span>
              <Scale className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-foreground">{lote.metas.conversionActual}</span>
              <span className="text-xs text-muted-foreground mb-1">/ {lote.metas.conversionAlimenticia} meta</span>
            </div>
            <ProgressBar value={lote.metas.conversionAlimenticia} max={lote.metas.conversionActual} color={lote.metas.conversionActual <= lote.metas.conversionAlimenticia ? "#22c55e" : "#f59e0b"} />
            <p className="text-[10px] text-muted-foreground mt-2">Kg alimento / Kg peso ganado (menor = mejor)</p>
          </div>

          {/* Días de Ciclo */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Progreso del Ciclo</span>
              <ClipboardList className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-foreground">{lote.metas.diasActuales}</span>
              <span className="text-xs text-muted-foreground mb-1">/ {lote.metas.diasCiclo} días</span>
            </div>
            <ProgressBar value={lote.metas.diasActuales} max={lote.metas.diasCiclo} color="#8b5cf6" />
            <p className="text-[10px] text-muted-foreground mt-2">Faltan {lote.metas.diasCiclo - lote.metas.diasActuales} días para venta</p>
          </div>

          {/* Ingresos Esperados */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Ingresos Esperados</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-green-500">${lote.metas.ingresosEsperados.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Proyección basada en peso y precio actual</p>
          </div>

          {/* Costo Máximo */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Presupuesto Máximo</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">${lote.metas.costoMaximo.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Costo máximo aceptable para mantener rentabilidad</p>
          </div>
        </div>
      </motion.div>

      {/* Gráficos: Radar + Progreso Semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar de Rendimiento */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-indigo-500" />
            Rendimiento General vs Metas
          </h3>
          <ChartDescription text="Muestra qué tan cerca estás de cumplir cada meta. 100% = meta cumplida perfectamente. Si un eje está por debajo de 100, significa que esa área necesita atención." />
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={rendimientoRadar}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <PolarRadiusAxis stroke="hsl(var(--border))" fontSize={10} domain={[0, 100]} />
              <Radar name="Rendimiento Actual" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Radar name="Meta (100%)" dataKey="meta" stroke="#22c55e" fill="#22c55e" fillOpacity={0.05} strokeDasharray="5 5" />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Curva de Crecimiento vs Meta */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Curva de Crecimiento: Real vs Meta
          </h3>
          <ChartDescription text="Compara el peso real de las aves semana a semana contra la curva de crecimiento ideal (meta). Si la línea real está por debajo, las aves están creciendo más lento de lo esperado." />
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={progresoSemanal}>
              <defs>
                <linearGradient id="gradPesoReal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="semana" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit=" kg" />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
              />
              <Legend />
              <Area type="monotone" dataKey="pesoReal" stroke="#3b82f6" fill="url(#gradPesoReal)" strokeWidth={2.5} name="Peso Real (kg)" />
              <Line type="monotone" dataKey="pesoMeta" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="Meta (kg)" />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Manejo de Recursos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Boxes className="w-5 h-5 text-cyan-500" />
          Manejo de Recursos (Presupuesto Asignado vs Usado)
        </h3>
        <ChartDescription text="Muestra cuánto del presupuesto asignado para cada recurso ya se ha utilizado. Si un recurso llega al 100% antes de terminar el ciclo, necesitas reasignar fondos o reducir consumo." />

        <div className="space-y-4">
          {recursosDistribucion.map((r, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground w-24">{r.recurso}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">${r.usado.toLocaleString()} / ${r.asignado.toLocaleString()}</span>
                  <span className={`text-xs font-bold ${
                    r.porcentaje >= 95 ? "text-red-500" : r.porcentaje >= 80 ? "text-amber-500" : "text-green-500"
                  }`}>
                    {r.porcentaje}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-secondary/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.porcentaje}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{
                      background: r.porcentaje >= 95 ? "#ef4444" : r.porcentaje >= 80 ? "#f59e0b" : "#22c55e",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Presupuesto Total</span>
            <span className="text-sm font-bold text-foreground">
              ${recursosDistribucion.reduce((s, r) => s + r.usado, 0).toLocaleString()} / ${recursosDistribucion.reduce((s, r) => s + r.asignado, 0).toLocaleString()} USD
            </span>
          </div>
        </div>
      </motion.div>

      {/* Toma de Decisiones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          Toma de Decisiones
        </h3>
        <ChartDescription text="Recomendaciones basadas en la comparación entre las metas definidas y los resultados reales. Cada decisión tiene una prioridad y una acción sugerida para mantener el lote en camino al objetivo." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decisiones.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + i * 0.08 }}
              className="card-3d"
            >
              <div className="card-3d-inner glass rounded-xl p-5 border border-border relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${
                  d.prioridad === "alta" ? "bg-red-500" :
                  d.prioridad === "media" ? "bg-amber-500" : "bg-green-500"
                }`} />
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-2 rounded-lg ${
                    d.prioridad === "alta" ? "bg-red-500/10" :
                    d.prioridad === "media" ? "bg-amber-500/10" : "bg-green-500/10"
                  }`}>
                    {d.prioridad === "alta" ? <AlertTriangle className="w-4 h-4 text-red-500" /> :
                     d.prioridad === "media" ? <Target className="w-4 h-4 text-amber-500" /> :
                     <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground">{d.titulo}</h4>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        d.prioridad === "alta" ? "bg-red-500/10 text-red-500" :
                        d.prioridad === "media" ? "bg-amber-500/10 text-amber-500" :
                        "bg-green-500/10 text-green-500"
                      }`}>
                        {d.prioridad}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{d.razon}</p>
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 border border-border/50">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-medium text-foreground">{d.accion}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Resumen de Cumplimiento */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6 border border-emerald-500/20"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          Resumen de Cumplimiento de Metas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Lote</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Peso</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Mortalidad</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Conversión</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {metasLotes.map((l, i) => {
                const pesoCumple = l.metas.pesoActual >= l.metas.pesoObjetivo * 0.9;
                const mortCumple = l.metas.mortalidadActual <= l.metas.mortalidadMax;
                const convCumple = l.metas.conversionActual <= l.metas.conversionAlimenticia * 1.05;
                const todoOk = pesoCumple && mortCumple && convCumple;
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-3 font-semibold text-foreground">{l.lote}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${pesoCumple ? "text-green-500" : "text-amber-500"}`}>
                        {pesoCumple ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        {l.metas.pesoActual}/{l.metas.pesoObjetivo} kg
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${mortCumple ? "text-green-500" : "text-red-500"}`}>
                        {mortCumple ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {l.metas.mortalidadActual}% / {l.metas.mortalidadMax}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${convCumple ? "text-green-500" : "text-amber-500"}`}>
                        {convCumple ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {l.metas.conversionActual}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        todoOk ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"
                      }`}>
                        {todoOk ? "✓ En meta" : "⚠ Ajustar"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}