import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
} from "recharts";

// === DATOS DE VENTAS EN USD ===

const ventasRealizadas = [
  { id: 1, lote: "Lote 10", aves: 1500, pesoTotal: 3750, precioKg: 2.20, total: 8250, fecha: "2024-01-15", comprador: "Mercado Central", estado: "Pagado" },
  { id: 2, lote: "Lote 11", aves: 1800, pesoTotal: 4680, precioKg: 2.12, total: 9900, fecha: "2024-02-02", comprador: "Restaurante El Pollo Dorado", estado: "Pagado" },
  { id: 3, lote: "Lote 12", aves: 2000, pesoTotal: 5200, precioKg: 2.12, total: 11000, fecha: "2024-02-28", comprador: "Distribuidora Avícola Sur", estado: "Pagado" },
  { id: 4, lote: "Lote 13", aves: 1600, pesoTotal: 4000, precioKg: 2.20, total: 8800, fecha: "2024-03-15", comprador: "Mercado Municipal", estado: "Pagado" },
  { id: 5, lote: "Lote 14", aves: 1950, pesoTotal: 5070, precioKg: 2.13, total: 10800, fecha: "2024-04-01", comprador: "Pollería Don Julio", estado: "Pagado" },
  { id: 6, lote: "Lote 15", aves: 2100, pesoTotal: 5460, precioKg: 2.15, total: 11739, fecha: "2024-04-20", comprador: "Supermercado La Economía", estado: "Pendiente" },
];

const resumenVentas = {
  totalVentas: 60489,
  ventasMes: 11739,
  lotesVendidos: 6,
  clientesActivos: 5,
  precioPromedioKg: 2.15,
  kilosTotales: 28160,
  avesTotalesVendidas: 10950,
  ticketPromedio: 10081,
};

const ventasMensuales = [
  { mes: "Ene", ventas: 8250, kilos: 3750, aves: 1500 },
  { mes: "Feb", ventas: 20900, kilos: 9880, aves: 3800 },
  { mes: "Mar", ventas: 8800, kilos: 4000, aves: 1600 },
  { mes: "Abr", ventas: 22539, kilos: 10530, aves: 4050 },
  { mes: "May", ventas: 12500, kilos: 5800, aves: 2200 },
  { mes: "Jun", ventas: 14200, kilos: 6600, aves: 2500 },
];

const precioHistorico = [
  { semana: "S1", precio: 2.10 },
  { semana: "S2", precio: 2.15 },
  { semana: "S3", precio: 2.12 },
  { semana: "S4", precio: 2.18 },
  { semana: "S5", precio: 2.20 },
  { semana: "S6", precio: 2.22 },
  { semana: "S7", precio: 2.19 },
  { semana: "S8", precio: 2.25 },
  { semana: "S9", precio: 2.28 },
  { semana: "S10", precio: 2.30 },
  { semana: "S11", precio: 2.27 },
  { semana: "S12", precio: 2.32 },
];

const clientesTop = [
  { nombre: "Distribuidora Avícola Sur", compras: 3, totalComprado: 28500, ultimaCompra: "2024-04-01" },
  { nombre: "Mercado Central", compras: 5, totalComprado: 22400, ultimaCompra: "2024-03-28" },
  { nombre: "Restaurante El Pollo Dorado", compras: 4, totalComprado: 18900, ultimaCompra: "2024-04-10" },
  { nombre: "Pollería Don Julio", compras: 2, totalComprado: 15200, ultimaCompra: "2024-04-01" },
  { nombre: "Supermercado La Economía", compras: 1, totalComprado: 11739, ultimaCompra: "2024-04-20" },
];

const sparkVentas = [{ v: 8250 }, { v: 20900 }, { v: 8800 }, { v: 22539 }, { v: 12500 }, { v: 14200 }];
const sparkPrecio = [{ v: 2.10 }, { v: 2.15 }, { v: 2.20 }, { v: 2.25 }, { v: 2.28 }, { v: 2.32 }];

function MiniSparkline({ data, color }: { data: { v: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
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

export default function Ventas() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-l-2xl" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <ShoppingCart className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Módulo de Ventas</h1>
              <p className="text-sm text-muted-foreground">
                Registro de ventas realizadas por lote · Evaluado en USD ($)
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <ShoppingCart className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-xs font-medium text-purple-500">{resumenVentas.lotesVendidos} lotes vendidos</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards - Estilo Bolsa de Valores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Ventas",
            value: `$${resumenVentas.totalVentas.toLocaleString()}`,
            change: "+18.5%",
            up: true,
            icon: DollarSign,
            color: "#22c55e",
            spark: sparkVentas,
          },
          {
            label: "Ventas del Mes",
            value: `$${resumenVentas.ventasMes.toLocaleString()}`,
            change: "+12.3%",
            up: true,
            icon: TrendingUp,
            color: "#3b82f6",
            spark: sparkVentas,
          },
          {
            label: "Precio/Kg Promedio",
            value: `$${resumenVentas.precioPromedioKg.toFixed(2)}`,
            change: "+4.8%",
            up: true,
            icon: BarChart3,
            color: "#8b5cf6",
            spark: sparkPrecio,
          },
          {
            label: "Clientes Activos",
            value: `${resumenVentas.clientesActivos}`,
            change: "+2",
            up: true,
            icon: Users,
            color: "#f59e0b",
            spark: [{ v: 2 }, { v: 3 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 5 }],
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card-3d"
          >
            <div className="card-3d-inner glass rounded-xl p-5 border border-border relative overflow-hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{kpi.label}</span>
                <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.up ? <ArrowUpRight className="w-3.5 h-3.5 text-green-500" /> : <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
                    <span className={`text-xs font-semibold ${kpi.up ? "text-green-500" : "text-red-500"}`}>{kpi.change}</span>
                  </div>
                </div>
                <div className="w-24 h-10">
                  <MiniSparkline data={kpi.spark} color={kpi.up ? "#22c55e" : "#ef4444"} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${kpi.color}, transparent)` }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats secundarios */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Aves Vendidas", value: resumenVentas.avesTotalesVendidas.toLocaleString(), icon: Package, color: "#06b6d4" },
          { label: "Kilos Totales", value: `${resumenVentas.kilosTotales.toLocaleString()} kg`, icon: BarChart3, color: "#f59e0b" },
          { label: "Ticket Promedio", value: `$${resumenVentas.ticketPromedio.toLocaleString()}`, icon: DollarSign, color: "#22c55e" },
          { label: "Lotes Vendidos", value: resumenVentas.lotesVendidos.toString(), icon: Package, color: "#8b5cf6" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="glass rounded-xl p-4 border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span className="text-[11px] text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabla de Ventas Realizadas - PRINCIPAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-purple-500" />
          Ventas Realizadas por Lote
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-muted-foreground font-medium">Lote</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Aves</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Peso (kg)</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">$/kg</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Comprador</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Fecha</th>
                <th className="text-center py-3 px-3 text-muted-foreground font-medium">Estado</th>
                <th className="text-right py-3 px-3 text-muted-foreground font-medium">Total (USD)</th>
              </tr>
            </thead>
            <tbody>
              {ventasRealizadas.map((venta) => (
                <tr key={venta.id} className="border-b border-border/50 hover:bg-purple-500/5 transition-colors">
                  <td className="py-3 px-3 text-foreground font-semibold">{venta.lote}</td>
                  <td className="py-3 px-3 text-center text-foreground">{venta.aves.toLocaleString()}</td>
                  <td className="py-3 px-3 text-center text-foreground">{venta.pesoTotal.toLocaleString()}</td>
                  <td className="py-3 px-3 text-center text-foreground">${venta.precioKg.toFixed(2)}</td>
                  <td className="py-3 px-3 text-center text-muted-foreground text-xs">{venta.comprador}</td>
                  <td className="py-3 px-3 text-center text-muted-foreground text-xs">{venta.fecha}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      venta.estado === "Pagado"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {venta.estado === "Pagado" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {venta.estado}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-green-500">${venta.total.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="bg-purple-500/5">
                <td className="py-3 px-3 font-bold text-foreground" colSpan={7}>TOTAL VENTAS</td>
                <td className="py-3 px-3 text-right font-bold text-green-500 text-lg">
                  ${ventasRealizadas.reduce((s, v) => s + v.total, 0).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas Mensuales */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Ingresos por Ventas Mensuales (USD)
          </h3>
          <ChartDescription text="Muestra cuánto dinero ingresó cada mes por la venta de pollos. Los picos indican meses donde se vendieron más lotes o a mejor precio." />
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={ventasMensuales}>
              <defs>
                <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, ""]}
              />
              <Area type="monotone" dataKey="ventas" stroke="#8b5cf6" fill="url(#gradVentas)" strokeWidth={2.5} name="Ventas (USD)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Precio por Kg - Evolución tipo bolsa */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 }}
          className="glass rounded-2xl p-6 border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Precio por Kg (Evolución)
          </h3>
          <ChartDescription text="Evolución del precio de venta por kilogramo de pollo en el mercado. Si la línea sube, el precio está mejorando y las ganancias por lote aumentan." />
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={precioHistorico}>
              <defs>
                <linearGradient id="gradPrecio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="semana" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[2.0, 2.4]} tickFormatter={(v) => `$${v.toFixed(2)}`} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
                formatter={(value: any) => [`$${value.toFixed(2)}/kg`, ""]}
              />
              <Area type="monotone" dataKey="precio" stroke="#22c55e" fill="url(#gradPrecio)" strokeWidth={2.5} dot={{ r: 3, fill: "#22c55e" }} name="Precio/Kg" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Volumen de ventas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
          <Package className="w-5 h-5 text-cyan-500" />
          Volumen de Ventas (Aves y Kilos por Mes)
        </h3>
        <ChartDescription text="Muestra la cantidad de aves vendidas (barras) y los kilogramos totales (línea) cada mes. Permite ver si estás vendiendo más producto con el tiempo y si el negocio está creciendo." />
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={ventasMensuales}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="aves" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Aves Vendidas" />
            <Line yAxisId="right" type="monotone" dataKey="kilos" stroke="#06b6d4" strokeWidth={2.5} dot={{ r: 4 }} name="Kilos (kg)" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Clientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="glass rounded-2xl p-6 border border-border"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-500" />
          Top Clientes / Compradores
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">#</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Cliente</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Compras</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Última Compra</th>
                <th className="text-right py-3 px-4 text-muted-foreground font-medium">Total Comprado</th>
              </tr>
            </thead>
            <tbody>
              {clientesTop.map((cliente, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-amber-500/5 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? "bg-amber-500/20 text-amber-500" :
                      i === 1 ? "bg-slate-400/20 text-slate-400" :
                      i === 2 ? "bg-orange-600/20 text-orange-600" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground font-medium">{cliente.nombre}</td>
                  <td className="py-3 px-4 text-center text-foreground">{cliente.compras}</td>
                  <td className="py-3 px-4 text-center text-muted-foreground text-xs">{cliente.ultimaCompra}</td>
                  <td className="py-3 px-4 text-right font-bold text-green-500">${cliente.totalComprado.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}