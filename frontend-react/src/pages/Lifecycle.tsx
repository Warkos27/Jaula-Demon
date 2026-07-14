import { useState } from "react";
import { LIFECYCLE_PHASES } from "@/lib/constants";
import { Thermometer, Droplets, Sun, Wind, Cloud, Utensils, TrendingUp } from "lucide-react";

export default function Lifecycle() {
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [currentDay] = useState(18);
  const phase = LIFECYCLE_PHASES[selectedPhase];

  const currentPhaseIndex = LIFECYCLE_PHASES.findIndex(
    (p) => currentDay >= p.dayRange[0] && currentDay <= p.dayRange[1]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Ciclo de Vida Avícola</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Fases de crianza y parámetros ideales por etapa
        </p>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border bg-card p-6 opacity-0 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-foreground">Línea de Tiempo (42 días)</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            Día {currentDay}
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative mb-8">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(currentDay / 42) * 100}%`,
                background: `linear-gradient(90deg, #f59e0b, #3b82f6, #22c55e)`,
              }}
            />
          </div>
          {/* Day marker */}
          <div
            className="absolute top-[-6px] w-5 h-5 rounded-full bg-foreground border-2 border-primary shadow-lg transition-all duration-500"
            style={{ left: `calc(${(currentDay / 42) * 100}% - 10px)` }}
          />
          {/* Phase markers */}
          <div className="absolute top-4 left-0 right-0 flex">
            {LIFECYCLE_PHASES.map((p, i) => (
              <div
                key={i}
                className="flex-1 text-center"
                style={{ width: `${((p.dayRange[1] - p.dayRange[0] + 1) / 42) * 100}%` }}
              >
                <span className="text-[10px] text-muted-foreground">{p.days}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase selector */}
        <div className="grid grid-cols-3 gap-3">
          {LIFECYCLE_PHASES.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelectedPhase(i)}
              className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left ${
                selectedPhase === i
                  ? "border-primary/50 bg-primary/5 shadow-lg"
                  : "border-border hover:border-primary/20 hover:bg-card"
              }`}
            >
              {currentPhaseIndex === i && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
              {/* Chicken SVG for each phase */}
              <ChickenPhaseIcon phase={i} color={p.color} />
              <p className="text-sm font-semibold mt-2" style={{ color: p.color }}>{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.days}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Phase details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-0 animate-slide-up stagger-2">
        {/* Parameters */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" stroke={phase.color} strokeWidth="1.5" />
              <path d="M5 8h6M8 5v6" stroke={phase.color} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Parámetros Ideales - {phase.name}
          </h3>

          <div className="space-y-3">
            <ParamRow icon={<Thermometer className="w-4 h-4 text-red-400" />} label="Temperatura" value={`${phase.tempRange[0]} - ${phase.tempRange[1]} °C`} />
            <ParamRow icon={<Droplets className="w-4 h-4 text-blue-400" />} label="Humedad" value={`${phase.humidity[0]} - ${phase.humidity[1]} %`} />
            <ParamRow icon={<Sun className="w-4 h-4 text-amber-400" />} label="Luminosidad" value={`${phase.light[0]} - ${phase.light[1]} lux`} />
            <ParamRow icon={<Wind className="w-4 h-4 text-purple-400" />} label="Amoníaco máx." value={`< ${phase.nh3Max} ppm`} />
            <ParamRow icon={<Cloud className="w-4 h-4 text-cyan-400" />} label="CO2 máx." value={`< ${phase.co2Max} ppm`} />
          </div>
        </div>

        {/* Feeding info */}
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Utensils className="w-4 h-4" style={{ color: phase.color }} />
            Alimentación - {phase.name}
          </h3>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Tipo de alimento</p>
              <p className="text-sm font-medium text-foreground">{phase.feeding}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Consumo diario por ave</p>
              <p className="text-sm font-medium text-foreground">{phase.consumption}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Descripción de la fase</p>
              <p className="text-sm font-medium text-foreground">{phase.description}</p>
            </div>
          </div>

          {/* Growth indicator */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <TrendingUp className="w-4 h-4" style={{ color: phase.color }} />
            <span className="text-xs text-muted-foreground">
              Progreso en fase: {Math.min(100, Math.round(((currentDay - phase.dayRange[0]) / (phase.dayRange[1] - phase.dayRange[0])) * 100))}%
            </span>
          </div>
        </div>
      </div>

      {/* Risks section */}
      <div className="rounded-xl border bg-card p-5 opacity-0 animate-slide-up stagger-3">
        <h3 className="text-sm font-semibold text-foreground mb-4">⚠️ Riesgos por Incumplimiento de Parámetros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <RiskItem title="Amoníaco alto (>25 ppm)" description="Conjuntivitis, lesiones en tráquea, menor ganancia de peso" severity="danger" />
          <RiskItem title="CO2 alto (>2000 ppm)" description="Hipoxia, jadeo, mortalidad en primeras semanas" severity="danger" />
          <RiskItem title="Humedad >70%" description="Cama húmeda, proliferación bacteriana, dermatitis plantar" severity="warning" />
          <RiskItem title="Exceso de luz (>50 lux)" description="Estrés, agresividad, problemas oculares" severity="warning" />
        </div>
      </div>
    </div>
  );
}

function ParamRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground tabular-nums">{value}</span>
    </div>
  );
}

function RiskItem({ title, description, severity }: { title: string; description: string; severity: "danger" | "warning" }) {
  return (
    <div className={`p-3 rounded-lg border ${severity === "danger" ? "border-red-500/20 bg-red-500/5" : "border-amber-500/20 bg-amber-500/5"}`}>
      <p className={`text-xs font-semibold ${severity === "danger" ? "text-red-400" : "text-amber-400"}`}>{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

function ChickenPhaseIcon({ phase, color }: { phase: number; color: string }) {
  const sizes = [
    { body: 8, head: 5, y: 20 },
    { body: 12, head: 7, y: 18 },
    { body: 16, head: 9, y: 16 },
  ];
  const s = sizes[phase];
  return (
    <svg viewBox="0 0 40 36" className="w-10 h-10" fill="none">
      <ellipse cx="20" cy={s.y + s.body / 2} rx={s.body} ry={s.body * 0.8} fill={color} opacity="0.3" />
      <circle cx="20" cy={s.y - s.head / 2} r={s.head} fill={color} opacity="0.5" />
      <circle cx={18} cy={s.y - s.head / 2 - 1} r="1.5" fill="currentColor" />
      <polygon points={`${22},${s.y - s.head / 2} ${26},${s.y - s.head / 2 - 1} ${22},${s.y - s.head / 2 + 2}`} fill="#f97316" />
    </svg>
  );
}