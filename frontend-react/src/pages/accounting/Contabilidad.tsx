import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Skull,
  Package,
  Pill,
  Zap,
  Droplets,
  Wheat,
  Wrench,
  Receipt,
  PiggyBank,
  Lightbulb,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// === DATOS CONTABLES EN USD ===

const resumenFinanciero = {
  ingresosTotales: 48750,
  egresosTotales: 27340,
  utilidadNeta: 21410,
  perdidaMortalidad: 2850,
  margenUtilidad: 43.9,
  costoPromedioPorAve: 1.82,
  precioVentaPromedio: 3.25,
  roiMensual: 78.3,
};

const ingresosDetalle = [
  { concepto: "Venta Lote 10 - 1,500 pollos", fecha: "2024-01-15", monto: 8250, tipo: "ingreso" },
  { concepto: "Venta Lote 11 - 1,800 pollos", fecha: "2024-02-02", monto: 9900, tipo: "ingreso" },
  { concepto: "Venta Lote 12 - 2,000 pollos", fecha: "2024-02-28", monto: 11000, tipo: "ingreso" },
  { concepto: "Venta Lote 13 - 1,600 pollos", fecha: "2024-03-15", monto: 8800, tipo: "ingreso" },
  { concepto: "Venta Lote 14 - 1,950 pollos", fecha: "2024-04-01", monto: 10800, tipo: "ingreso" },
];

const egresosDetalle = [
  { concepto: "Alimento balanceado (5 toneladas)", fecha: "2024-01-05", monto: 6200, categoria: "Alimentación" },
  { concepto: "Vacuna Newcastle + Gumboro", fecha: "2024-01-10", monto: 1850, categoria: "Medicina" },
  { concepto: "Antibióticos y vitaminas", fecha: "2024-01-20", monto: 920, categoria: "Medicina" },
  { concepto: "Electricidad (calefacción/ventilación)", fecha: "2024-01-30", monto: 1450, categoria: "Servicios" },
  { concepto: "Agua potable", fecha: "2024-01-30", monto: 380, categoria: "Servicios" },
  { concepto: "Alimento balanceado (4.5 toneladas)", fecha: "2024-02-05", monto: 5580, categoria: "Alimentación" },
  { concepto: "Desinfectantes y limpieza", fecha: "2024-02-10", monto: 450, categoria: "Medicina" },
  { concepto: "Cama (viruta/aserrín)", fecha: "2024-02-15", monto: 680, categoria: "Insumos" },
  { concepto: "Mano de obra (2 empleados)", fecha: "2024-02-28", monto: 3200, categoria: "Personal" },
  { concepto: "Mantenimiento equipos", fecha: "2024-03-05", monto: 750, categoria: "Mantenimiento" },
  { concepto: "Alimento balanceado (5.2 toneladas)", fecha: "2024-03-10", monto: 6440, categoria: "Alimentación" },
  { concepto: "Gas propano (calefacción)", fecha: "2024-03-15", monto: 890, categoria: "Servicios" },
];

const perdidasMortalidad = [
  { lote: "Lote 10", avesInicio: 1600, avesMuertas: 100, costoAve: 1.75, perdidaTotal: 175 },
  { lote: "Lote 11", avesInicio: 1900, avesMuertas: 100, costoAve: 1.80, perdidaTotal: 180 },
  { lote: "Lote 12", avesInicio: 2100, avesMuertas: 100, costoAve: 1.82, perdidaTotal: 182 },
  { lote: "Lote 13", avesInicio: 1700, avesMuertas: 100, costoAve: 1.78, perdidaTotal: 178 },
  { lote: "Lote 14", avesInicio: 2050, avesMuertas: 100, costoAve: 1.85, perdidaTotal: 185 },
];

const flujoMensual = [
  { mes: "Ene", ingresos: 8250, egresos: 11800, utilidad: -3550 },
  { mes: "Feb", ingresos: 20900, egresos: 9910, utilidad: 10990 },
  { mes: "Mar", ingresos: 8800, egresos: 8080, utilidad: 720 },
  { mes: "Abr", ingresos: 10800, egresos: 5550, utilidad: 5250 },
  { mes: "May", ingresos: 9500, egresos: 6200, utilidad: 3300 },
  { mes: "Jun", ingresos: 11200, egresos: 7100, utilidad: 4100 },
];

const distribucionEgresos = [
  { name: "Alimentación", value: 18220, color: "#f59e0b" },
  { name: "Medicina/Vacunas", value: 3220, color: "#ef4444" },
  { name: "Servicios (Luz/Agua/Gas)", value: 2720, color: "#3b82f6" },
  { name: "Personal", value: 3200, color: "#8b5cf6" },
  { name: "Insumos/Cama", value: 680, color: "#06b6d4" },
  { name: "Mantenimiento", value: 750, color: "#ec4899" },
  { name: "Mortalidad (Pérdida)", value: 2850, color: "#dc2626" },
];

const sparklineIngresos = [
  { v: 8250 }, { v: 9900 }, { v: 11000 }, { v: 8800 }, { v: 10800 }, { v: 11200 },
];
const sparklineEgresos = [
  { v: 11800 }, { v: 9910 }, { v: 8080 }, { v: 5550 }, { v: 6200 }, { v: 7100 },
];
const sparklineUtilidad = [
  { v: -3550 }, { v: 10990 }, { v: 720 }, { v: 5250 }, { v: 3300 }, { v: 4100 },
];
const sparklineMortalidad = [
  { v: 175 }, { v: 180 }, { v: 182 }, { v: 178 }, { v: 185 },
];

function MiniSparkline({ data, color, height = 40 }: { data: { v: number }[]; color: string; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

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

function KpiCard({
  label,
  value,
  change,
  up,
  icon: Icon,
  color,
  sparkData,
  delay,
  prefix = "$",
}: {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: React.ElementType;
  color: string;
  sparkData: { v: number }[];
  delay: number;
  prefix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card-3d"
    >
      <div className="card-3d-inner glass rounded-xl p-5 border border-border relative overflow-hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </span>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-foreground">{prefix}{value}</p>
            <div className="flex items-center gap-1 mt-1">
              {up ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
              )}
              <span className={`text-xs font-semibold ${up ? "text-green-500" : "text-red-500"}`}>
                {change}
              </span>
            </div>
          </div>
          <div className="w-24 h-10">
            <MiniSparkline data={sparkData} color={up ? "#22c55e" : "#ef4444"} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </div>
    </motion.div>
  );
}

export default function Contabilidad() {
  const totalPerdidaMortalidad = perdidasMortalidad.reduce((s, p) => s + p.perdidaTotal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-green-600 rounded-l-2xl" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <Receipt className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Datos Contables</h1>
              <p className="text-sm text-muted-foreground">
                Ingresos, Egresos, Pérdidas por Mortalidad · Evaluado en USD ($)
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-500">Actualizado hoy</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards - Estilo Bolsa de Valores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Ingresos Totales"
          value={resumenFinanciero.ingresosTotales.toLocaleString()}
          change="+12.4%"
          up={true}
          icon={TrendingUp}
          color="#22c55e"
          sparkData={sparklineIngresos}
          delay={0}
        />
        <KpiCard
          label="Egresos Totales"
          value={resumenFinanciero.egresosTotales.toLocaleString()}
          change="-8.2%"
          up={true}
          icon={TrendingDown}
          color="#3b82f6"
          sparkData={sparklineEgresos}
          delay={0.08}
        />
        <KpiCard
          label="Utilidad Neta"
          value={resumenFinanciero.utilidadNeta.toLocaleString()}
          change="+23.1%"
          up={true}
          icon={PiggyBank}
          color="#8b5cf6"
          sparkData={sparklineUtilidad}
          delay={0.16}
        />
        <KpiCard
          label="Pérdida Mortalidad"
          value={totalPerdidaMortalidad.toLocaleString()}
          change="+5.7%"
          up={false}
          icon={Skull}
          color="#ef4444"
          sparkData={sparklineMortalidad}
          delay={0.24}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Margen Utilidad", value: `${resumenFinanciero.margenUtilidad}%`, icon: DollarSign, color: "#22c55e" },
          { label: "Costo/Ave", value: `$${resumenFinanciero.costoPromedioPorAve}`, icon: Package, color: "#f59e0b" },
          { label: "Precio Venta/Ave", value: `$${resumenFinanciero.precioVentaPromedio}`, icon: TrendingUp, color: "#3b82f6" },
          { label: "ROI Mensual", value: `${resumenFinanciero.roiMensual}%`, icon: PiggyBank, color: "#8b5cf6" },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="glass rounded-xl p-4 border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              <span className="text-[11px] text-muted-foreground">{kpi.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Flujo Mensual - Gráfico Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Flujo de Caja Mensual (USD)
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded bg-emerald-500" /> Ingresos
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded bg-red-400" /> Egresos
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded bg-blue-500" /> Utilidad
            </span>
          </div>
        </div>
        <ChartDescription text="Muestra mes a mes cuánto dinero entra (ventas de pollos) vs cuánto sale (alimento, medicina, servicios, etc.). La línea azul es la utilidad: si está arriba de $0, el negocio es rentable ese mes." />
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={flujoMensual}>
            <defs>
              <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradEgresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "12px",
              }}
              formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
            />
            <Area type="monotone" dataKey="ingresos" stroke="#22c55e" fill="url(#gradIngresos)" strokeWidth={2.5} name="Ingresos" />
            <Area type="monotone" dataKey="egresos" stroke="#ef4444" fill="url(#gradEgresos)" strokeWidth={2} name="Egresos" />
            <Line type="monotone" dataKey="utilidad" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} name="Utilidad" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Distribución de Egresos + Tabla Ingresos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Egresos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <Pill className="w-5 h-5 text-purple-500" />
            Distribución de Egresos
          </h3>
          <ChartDescription text="Muestra en qué se gasta cada dólar: alimentación es el gasto más grande, seguido de medicina y servicios. Permite identificar dónde se puede ahorrar." />
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={distribucionEgresos}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {distribucionEgresos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Costos por Categoría - Barras */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <Wheat className="w-5 h-5 text-amber-500" />
            Egresos por Categoría (USD)
          </h3>
          <ChartDescription text="Compara visualmente el monto gastado en cada categoría. El alimento siempre es el mayor costo operativo en una granja avícola (60-70% del total)." />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={distribucionEgresos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} width={100} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {distribucionEgresos.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tabla de Ingresos (Ventas realizadas) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Registro de Ingresos (Ventas)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Concepto</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Fecha</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Monto (USD)</th>
              </tr>
            </thead>
            <tbody>
              {ingresosDetalle.map((item, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-green-500/5 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{item.concepto}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{item.fecha}</td>
                  <td className="py-3 px-4 text-right font-bold text-green-500">
                    +${item.monto.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="bg-green-500/5">
                <td className="py-3 px-4 font-bold text-foreground" colSpan={2}>TOTAL INGRESOS</td>
                <td className="py-3 px-4 text-right font-bold text-green-500 text-lg">
                  +${ingresosDetalle.reduce((s, i) => s + i.monto, 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Tabla de Egresos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-red-500" />
          Registro de Egresos (Compras y Gastos)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Concepto</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Categoría</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Fecha</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Monto (USD)</th>
              </tr>
            </thead>
            <tbody>
              {egresosDetalle.map((item, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-red-500/5 transition-colors">
                  <td className="py-3 px-4 text-foreground">{item.concepto}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.categoria === "Alimentación" ? "bg-amber-500/10 text-amber-500" :
                      item.categoria === "Medicina" ? "bg-red-500/10 text-red-500" :
                      item.categoria === "Servicios" ? "bg-blue-500/10 text-blue-500" :
                      item.categoria === "Personal" ? "bg-purple-500/10 text-purple-500" :
                      item.categoria === "Insumos" ? "bg-cyan-500/10 text-cyan-500" :
                      "bg-pink-500/10 text-pink-500"
                    }`}>
                      {item.categoria}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-muted-foreground text-xs">{item.fecha}</td>
                  <td className="py-3 px-4 text-right font-bold text-red-500">
                    -${item.monto.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="bg-red-500/5">
                <td className="py-3 px-4 font-bold text-foreground" colSpan={3}>TOTAL EGRESOS</td>
                <td className="py-3 px-4 text-right font-bold text-red-500 text-lg">
                  -${egresosDetalle.reduce((s, e) => s + e.monto, 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Tabla de Pérdidas por Mortalidad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-6 border border-red-500/20"
      >
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Skull className="w-5 h-5 text-red-500" />
          Pérdidas por Mortalidad
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Cada ave que muere representa una pérdida económica (costo de crianza invertido hasta el momento de la muerte)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Lote</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Aves Inicio</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Aves Muertas</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">% Mortalidad</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Costo/Ave</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Pérdida Total</th>
              </tr>
            </thead>
            <tbody>
              {perdidasMortalidad.map((item, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-red-500/5 transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{item.lote}</td>
                  <td className="py-3 px-4 text-center text-foreground">{item.avesInicio.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-500">
                      {item.avesMuertas}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-muted-foreground">
                    {((item.avesMuertas / item.avesInicio) * 100).toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center text-foreground">${item.costoAve}</td>
                  <td className="py-3 px-4 text-right font-bold text-red-500">
                    -${item.perdidaTotal.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="bg-red-500/5">
                <td className="py-3 px-4 font-bold text-foreground" colSpan={5}>TOTAL PÉRDIDA POR MORTALIDAD</td>
                <td className="py-3 px-4 text-right font-bold text-red-500 text-lg">
                  -${totalPerdidaMortalidad.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Balance Final - Pérdidas y Ganancias */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="glass rounded-2xl p-6 border border-emerald-500/20"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-500" />
          Estado de Pérdidas y Ganancias (P&L)
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <span className="text-sm font-medium text-foreground">Ingresos por Ventas</span>
            <span className="text-lg font-bold text-green-500">+${resumenFinanciero.ingresosTotales.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <span className="text-sm font-medium text-foreground">Total Egresos Operativos</span>
            <span className="text-lg font-bold text-red-500">-${resumenFinanciero.egresosTotales.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <span className="text-sm font-medium text-foreground">Pérdida por Mortalidad</span>
            <span className="text-lg font-bold text-red-500">-${totalPerdidaMortalidad.toLocaleString()}</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <div>
              <span className="text-lg font-bold text-foreground">UTILIDAD NETA</span>
              <p className="text-xs text-muted-foreground">Después de egresos y pérdidas por mortalidad</p>
            </div>
            <span className="text-2xl font-bold text-emerald-500">
              +${(resumenFinanciero.ingresosTotales - resumenFinanciero.egresosTotales - totalPerdidaMortalidad).toLocaleString()}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}