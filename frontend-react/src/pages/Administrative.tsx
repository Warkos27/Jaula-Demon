import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ClipboardList, Factory, Package, ShieldAlert } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Treemap,
  ComposedChart,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

type LoteActivo = {
  id_lote: number;
  id_jaula: string;
  estado?: string;
  fecha_inicio?: string;
  cantidad_inicial?: number;
};

type LoteForm = {
  id_jaula: string;
  cantidad_inicial: string;
  costo_pollito_unitario: string;
  fecha_inicio: string;
};

type GastoForm = {
  id_lote: string;
  tipo_gasto: string;
  monto_total: string;
  cantidad_kg: string;
};

type MortalidadForm = {
  id_lote: string;
  cantidad_bajas: string;
  causa_probable: string;
};

type VentaForm = {
  id_lote: string;
  kilos_totales_vendidos: string;
  precio_por_kilo: string;
  fecha_venta: string;
};

type ResumenReporte = {
  lotes_activos?: number;
  gastos_totales?: number;
  bajas_totales?: number;
  total_ingresos?: number;
  gastos_por_tipo?: Array<{ tipo_gasto: string; monto_total: number }>;
  mortalidad_por_causa?: Array<{ causa: string; cantidad: number }>;
  ventas_por_fecha?: Array<{ fecha: string; ingreso_total: number }>;
  [key: string]: any;
};

const today = new Date().toISOString().slice(0, 10);
const ADMIN_API_URL = "https://36gjnb0h5d.execute-api.us-east-2.amazonaws.com";

const fallbackLotes: LoteActivo[] = [
  { id_lote: 12, id_jaula: "Jaula 01", estado: "activo" },
  { id_lote: 13, id_jaula: "Jaula 02", estado: "activo" },
  { id_lote: 14, id_jaula: "Jaula 03", estado: "activo" },
];

const gastoTipos = [
  { value: "alimento", label: "Alimento" },
  { value: "medicinas", label: "Medicinas" },
  { value: "luz", label: "Luz" },
  { value: "agua", label: "Agua" },
  { value: "otros", label: "Otros" },
];

const causasComunes = [
  "Estrés térmico",
  "Aplastamiento",
  "Problema respiratorio",
  "Desconocido",
  "Enfermedad",
  "Trauma",
];

export default function Administrative() {
  const { toast } = useToast();
  const [lotes, setLotes] = useState<LoteActivo[]>(fallbackLotes);
  const [loadingLotes, setLoadingLotes] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [loteForm, setLoteForm] = useState<LoteForm>({
    id_jaula: "Jaula 01",
    cantidad_inicial: "1500",
    costo_pollito_unitario: "1.25",
    fecha_inicio: today,
  });

  const [gastoForm, setGastoForm] = useState<GastoForm>({
    id_lote: fallbackLotes[0]?.id_lote?.toString() ?? "",
    tipo_gasto: "alimento",
    monto_total: "",
    cantidad_kg: "",
  });

  const [mortalidadForm, setMortalidadForm] = useState<MortalidadForm>({
    id_lote: fallbackLotes[0]?.id_lote?.toString() ?? "",
    cantidad_bajas: "",
    causa_probable: causasComunes[0],
  });

  const [ventaForm, setVentaForm] = useState<VentaForm>({
    id_lote: fallbackLotes[0]?.id_lote?.toString() ?? "",
    kilos_totales_vendidos: "",
    precio_por_kilo: "",
    fecha_venta: today,
  });
  const [reporteResumen, setReporteResumen] = useState<ResumenReporte | null>(null);
  const [reporteError, setReporteError] = useState<string | null>(null);
  const [reporteLoading, setReporteLoading] = useState(true);

  useEffect(() => {
    async function loadLotes() {
      try {
        const res = await fetch(`${ADMIN_API_URL}/lotes/activos`);
        if (res.ok) {
          const activos = await res.json();
          if (Array.isArray(activos) && activos.length > 0) {
            setLotes(activos);
            const firstId = activos[0].id_lote?.toString();
            setGastoForm((prev) => ({ ...prev, id_lote: firstId ?? prev.id_lote }));
            setMortalidadForm((prev) => ({ ...prev, id_lote: firstId ?? prev.id_lote }));
            setVentaForm((prev) => ({ ...prev, id_lote: firstId ?? prev.id_lote }));
            setLoadingLotes(false);
            return;
          }
        }
      } catch {
        // Fallback local silencioso.
      }
      setLotes(fallbackLotes);
      setLoadingLotes(false);
    }

    loadLotes();
    loadReporteResumen();
  }, []);

  async function loadReporteResumen() {
    setReporteLoading(true);
    setReporteError(null);

    try {
      const res = await fetch(`${ADMIN_API_URL}/reportes/resumen`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      const reporteNormalizado: ResumenReporte = {
        ...data,
        lotes_activos: Number(data.lotes_activos ?? 0),
        gastos_totales: Number(data.gastos_totales ?? 0),
        bajas_totales: Number(data.bajas_totales ?? 0),
        gastos_por_tipo: Array.isArray(data.gastos_por_tipo)
          ? data.gastos_por_tipo.map((item: any) => ({
              tipo_gasto: item.tipo_gasto,
              monto_total: Number(item.monto_total ?? 0),
            }))
          : [],
        mortalidad_por_causa: Array.isArray(data.mortalidad_por_causa)
          ? data.mortalidad_por_causa.map((item: any) => ({
              causa: item.causa,
              cantidad: Number(item.cantidad ?? 0),
            }))
          : [],
        ventas_por_fecha: Array.isArray(data.ventas_por_fecha)
          ? data.ventas_por_fecha.map((item: any) => ({
              fecha: item.fecha,
              ingreso_total: Number(item.ingreso_total ?? 0),
            }))
          : [],
      };
      if (!reporteNormalizado.total_ingresos) {
        reporteNormalizado.total_ingresos = reporteNormalizado.ventas_por_fecha?.reduce(
          (sum, item) => sum + Number(item.ingreso_total ?? 0),
          0
        );
      }
      setReporteResumen(reporteNormalizado);
    } catch (error) {
      setReporteError("No se pudo cargar el informe. Revisa la API de resumen.");
    } finally {
      setReporteLoading(false);
    }
  }

  async function saveToBackend(endpoint: string, payload: Record<string, unknown>) {
    const res = await fetch(`${ADMIN_API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("No fue posible sincronizar con la API");
    }

    return res;
  }

  function persistFallback(key: string, payload: Record<string, unknown>) {
    const existing = JSON.parse(localStorage.getItem(key) ?? "[]");
    const next = Array.isArray(existing) ? [...existing, payload] : [payload];
    localStorage.setItem(key, JSON.stringify(next));
  }

  async function handleLoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loteForm.id_jaula || !loteForm.cantidad_inicial || !loteForm.costo_pollito_unitario || !loteForm.fecha_inicio) {
      toast({ title: "Faltan datos", description: "Completa todos los campos del lote antes de guardar.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const payload = {
      id_jaula: loteForm.id_jaula,
      cantidad_inicial: Number(loteForm.cantidad_inicial),
      costo_pollito_unitario: Number(loteForm.costo_pollito_unitario),
      fecha_inicio: loteForm.fecha_inicio,
      estado: "activo",
      fecha_fin: null,
    };

    try {
      await saveToBackend("/lotes", payload);
      toast({ title: "Lote abierto", description: "El nuevo lote quedó registrado correctamente." });
      setLoteForm({ id_jaula: "", cantidad_inicial: "", costo_pollito_unitario: "", fecha_inicio: today });
      setLoadingLotes(true);
      const res = await fetch(`${ADMIN_API_URL}/lotes/activos`);
      if (res.ok) {
        const activos = await res.json();
        if (Array.isArray(activos) && activos.length > 0) setLotes(activos);
      }
    } catch {
      persistFallback("administrative-lotes", payload);
      toast({ title: "Guardado localmente", description: "La API no respondió, pero el registro quedó guardado en este navegador para sincronizar luego.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

    const ventasConAcumulado = (() => {
      if (!reporteResumen?.ventas_por_fecha || !Array.isArray(reporteResumen.ventas_por_fecha)) return [] as Array<any>;
      const arr = [...reporteResumen.ventas_por_fecha]
        .map((r: any) => ({ fecha: r.fecha, ingreso_total: Number(r.ingreso_total ?? 0) }))
        .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
      let cum = 0;
      return arr.map((it: any) => {
        cum += it.ingreso_total ?? 0;
        return { ...it, acumulado: Number(cum.toFixed(2)) };
      });
    })();

    const gastosStackData = (() => {
      const tipos = (reporteResumen?.gastos_por_tipo ?? []).map((g: any) => String(g.tipo_gasto));
      if (tipos.length === 0) return [] as any[];

      // If backend provided grouping by lote (expected shape: [{id_lote, tipo_gasto, monto_total}])
      if (Array.isArray((reporteResumen as any).gastos_por_tipo_por_lote) && (reporteResumen as any).gastos_por_tipo_por_lote.length) {
        const rows = (reporteResumen as any).gastos_por_tipo_por_lote;
        const byLote: Record<string, any> = {};
        rows.forEach((r: any) => {
          const loteKey = `Lote ${r.id_lote}`;
          byLote[loteKey] = byLote[loteKey] || { lote: loteKey };
          byLote[loteKey][r.tipo_gasto] = (byLote[loteKey][r.tipo_gasto] || 0) + Number(r.monto_total ?? 0);
        });
        return Object.values(byLote);
      }

      // Fallback: single-row with types as keys using total per tipo
      const totalRow: any = { grupo: "Total" };
      (reporteResumen?.gastos_por_tipo ?? []).forEach((g: any) => {
        totalRow[String(g.tipo_gasto)] = Number(g.monto_total ?? 0);
      });
      return [totalRow];
    })();

    const mortalidadHeatmap = (() => {
      const days = 35; // show last 35 days (5 weeks)
      const todayDate = new Date();
      const dates: string[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(todayDate);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().slice(0, 10));
      }

      const counts: Record<string, number> = {};

      // prefer backend-provided daily mortalidad if available
      if (Array.isArray((reporteResumen as any)?.mortalidad_por_fecha) && (reporteResumen as any).mortalidad_por_fecha.length) {
        (reporteResumen as any).mortalidad_por_fecha.forEach((r: any) => {
          const key = String(r.fecha).slice(0, 10);
          counts[key] = (counts[key] || 0) + Number(r.cantidad ?? r.cantidad_bajas ?? 0);
        });
      } else if (reporteResumen?.bajas_totales) {
        // fallback: distribute total bajas over the window evenly
        const total = Number(reporteResumen.bajas_totales ?? 0);
        const base = Math.floor(total / days);
        let rem = total - base * days;
        dates.forEach((dt) => {
          counts[dt] = base + (rem > 0 ? 1 : 0);
          if (rem > 0) rem -= 1;
        });
      }

      const max = Math.max(...dates.map((d) => counts[d] || 0), 1);

      return { dates, counts, max };
    })();

    const treemapData = (() => {
      if (!reporteResumen?.gastos_por_tipo || !Array.isArray(reporteResumen.gastos_por_tipo)) return [] as any[];
      return reporteResumen.gastos_por_tipo.map((g: any) => ({ name: String(g.tipo_gasto), size: Number(g.monto_total ?? 0) }));
    })();

    const scatterData = (() => {
      // Prefer detalle de ventas si el backend lo devuelve
      const det = (reporteResumen as any)?.ventas_detalle || (reporteResumen as any)?.ventas || (reporteResumen as any)?.ventas_registros;
      if (Array.isArray(det) && det.length) {
        return det
          .map((v: any) => ({
            kilos: Number(v.kilos_totales_vendidos ?? v.kilos ?? 0),
            precio: Number(v.precio_por_kilo ?? v.precio ?? 0),
            id: v.id_venta ?? v.id ?? undefined,
          }))
          .filter((r: any) => Number.isFinite(r.kilos) && Number.isFinite(r.precio));
      }

      // Fallback: try ventas_por_fecha if it contains average price per kilo (unlikely)
      const byDate = reporteResumen?.ventas_por_fecha;
      if (Array.isArray(byDate) && byDate.length) {
        // If entries include 'kilos_totales_vendidos' and 'precio_por_kilo' use them
        const rows = byDate
          .map((v: any) => ({ kilos: Number(v.kilos_totales_vendidos ?? 0), precio: Number(v.precio_por_kilo ?? (v.ingreso_total && v.kilos_totales_vendidos ? v.ingreso_total / v.kilos_totales_vendidos : 0)), id: v.fecha }))
          .filter((r: any) => r.kilos > 0 && r.precio > 0);
        return rows;
      }

      return [] as any[];
    })();

  async function handleGastoSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!gastoForm.id_lote || !gastoForm.tipo_gasto || !gastoForm.monto_total) {
      toast({ title: "Faltan datos", description: "Selecciona lote, tipo de gasto y monto antes de guardar.", variant: "destructive" });
      return;
    }

    if (gastoForm.tipo_gasto === "alimento" && !gastoForm.cantidad_kg) {
      toast({ title: "Campo obligatorio", description: "Para alimento debes indicar la cantidad en kg.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const payload = {
      id_lote: Number(gastoForm.id_lote),
      tipo_gasto: gastoForm.tipo_gasto,
      monto_total: Number(gastoForm.monto_total),
      cantidad_kg: gastoForm.cantidad_kg ? Number(gastoForm.cantidad_kg) : null,
      fecha_registro: new Date().toISOString(),
    };

    try {
      await saveToBackend("/gastos", payload);
      toast({ title: "Gasto registrado", description: "El gasto operativo quedó guardado." });
      setGastoForm({ id_lote: gastoForm.id_lote, tipo_gasto: "alimento", monto_total: "", cantidad_kg: "" });
    } catch {
      persistFallback("administrative-gastos", payload);
      toast({ title: "Guardado localmente", description: "No se pudo enviar el gasto, pero quedó almacenado temporalmente.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMortalidadSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mortalidadForm.id_lote || !mortalidadForm.cantidad_bajas) {
      toast({ title: "Faltan datos", description: "Selecciona el lote y registra el número de bajas.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const payload = {
      id_lote: Number(mortalidadForm.id_lote),
      cantidad_bajas: Number(mortalidadForm.cantidad_bajas),
      causa_probable: mortalidadForm.causa_probable,
      fecha_registro: new Date().toISOString(),
    };

    try {
      await saveToBackend("/mortalidad", payload);
      toast({ title: "Bitácora actualizada", description: "La mortalidad quedó registrada de forma rápida." });
      setMortalidadForm({ id_lote: mortalidadForm.id_lote, cantidad_bajas: "", causa_probable: causasComunes[0] });
    } catch {
      persistFallback("administrative-mortalidad", payload);
      toast({ title: "Guardado localmente", description: "La bitácora quedó guardada localmente por si la API demora.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVentaSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ventaForm.id_lote || !ventaForm.kilos_totales_vendidos || !ventaForm.precio_por_kilo || !ventaForm.fecha_venta) {
      toast({ title: "Faltan datos", description: "Completa lote, kilos, precio y fecha de venta.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const kilos = Number(ventaForm.kilos_totales_vendidos);
    const precio = Number(ventaForm.precio_por_kilo);
    const payload = {
      id_lote: Number(ventaForm.id_lote),
      kilos_totales_vendidos: kilos,
      precio_por_kilo: precio,
      ingreso_total: kilos * precio,
      fecha_venta: ventaForm.fecha_venta,
    };

    try {
      await saveToBackend("/ventas/cerrar", payload);
      toast({ title: "Venta cerrada", description: "El lote se marcó como finalizado y la venta quedó registrada." });
      setVentaForm({ id_lote: ventaForm.id_lote, kilos_totales_vendidos: "", precio_por_kilo: "", fecha_venta: today });
    } catch {
      persistFallback("administrative-ventas", payload);
      toast({ title: "Guardado localmente", description: "La venta quedó registrada temporalmente para sincronizar después.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Administrativo</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona aperturas de lote, gastos, mortalidad y cierre de ciclo desde un solo panel pensado para operación diaria.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="py-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-900 dark:text-amber-200">
            <p className="font-semibold">Regla de oro</p>
            <p>Los formularios usan siempre un lote activo desde una lista desplegable para evitar registrar información en la jaula equivocada.</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="lote" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-1">
          <TabsTrigger value="lote">Apertura</TabsTrigger>
          <TabsTrigger value="gasto">Gastos</TabsTrigger>
          <TabsTrigger value="mortalidad">Mortalidad</TabsTrigger>
          <TabsTrigger value="venta">Cierre / Venta</TabsTrigger>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
        </TabsList>

        <TabsContent value="lote">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Factory className="h-4 w-4" /> Apertura de nuevo lote</CardTitle>
              <CardDescription>Registra el ingreso de pollitos BB y deja el lote listo para operar.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLoteSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="id_jaula">Identificador de jaula</Label>
                    <select id="id_jaula" value={loteForm.id_jaula} onChange={(e) => setLoteForm({ ...loteForm, id_jaula: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="">Selecciona una jaula</option>
                      <option value="Jaula 01">Jaula 01</option>
                      <option value="Jaula 02">Jaula 02</option>
                      <option value="Jaula 03">Jaula 03</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cantidad_inicial">Cantidad inicial</Label>
                    <Input id="cantidad_inicial" type="number" min="1" value={loteForm.cantidad_inicial} onChange={(e) => setLoteForm({ ...loteForm, cantidad_inicial: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costo_pollito_unitario">Costo unitario</Label>
                    <Input id="costo_pollito_unitario" type="number" step="0.01" min="0" value={loteForm.costo_pollito_unitario} onChange={(e) => setLoteForm({ ...loteForm, costo_pollito_unitario: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha_inicio">Fecha de inicio</Label>
                    <Input id="fecha_inicio" type="date" value={loteForm.fecha_inicio} onChange={(e) => setLoteForm({ ...loteForm, fecha_inicio: e.target.value })} required />
                  </div>
                </div>
                <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : "Guardar apertura de lote"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gasto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="h-4 w-4" /> Registro de gastos operativos</CardTitle>
              <CardDescription>Registra alimento, medicinas, agua, luz y otros gastos por lote activo.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleGastoSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gasto-lote">Lote activo</Label>
                    <select id="gasto-lote" value={gastoForm.id_lote} onChange={(e) => setGastoForm({ ...gastoForm, id_lote: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="">Selecciona un lote</option>
                      {lotes.map((lote) => (
                        <option key={lote.id_lote} value={lote.id_lote}>{`Lote ${lote.id_lote} - ${lote.id_jaula}`}</option>
                      ))}
                    </select>
                    {loadingLotes && <p className="text-xs text-muted-foreground">Cargando lotes activos...</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo_gasto">Tipo de gasto</Label>
                    <select id="tipo_gasto" value={gastoForm.tipo_gasto} onChange={(e) => setGastoForm({ ...gastoForm, tipo_gasto: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      {gastoTipos.map((item) => (
                        <option key={item.value} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monto_total">Monto total</Label>
                    <Input id="monto_total" type="number" step="0.01" min="0" value={gastoForm.monto_total} onChange={(e) => setGastoForm({ ...gastoForm, monto_total: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cantidad_kg">Cantidad en kg</Label>
                    <Input id="cantidad_kg" type="number" step="0.01" min="0" value={gastoForm.cantidad_kg} onChange={(e) => setGastoForm({ ...gastoForm, cantidad_kg: e.target.value })} disabled={gastoForm.tipo_gasto !== "alimento"} required={gastoForm.tipo_gasto === "alimento"} />
                    <p className="text-xs text-muted-foreground">Solo obligatorio cuando el gasto es alimento.</p>
                  </div>
                </div>
                <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : "Guardar gasto"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mortalidad">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-4 w-4" /> Bitácora de mortalidad</CardTitle>
              <CardDescription>Formulario compacto para registrar bajas en recorridos diarios desde celular.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleMortalidadSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mortalidad-lote">Lote activo</Label>
                    <select id="mortalidad-lote" value={mortalidadForm.id_lote} onChange={(e) => setMortalidadForm({ ...mortalidadForm, id_lote: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="">Selecciona un lote</option>
                      {lotes.map((lote) => (
                        <option key={lote.id_lote} value={lote.id_lote}>{`Lote ${lote.id_lote} - ${lote.id_jaula}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cantidad_bajas">Número de bajas</Label>
                    <Input id="cantidad_bajas" type="number" min="1" value={mortalidadForm.cantidad_bajas} onChange={(e) => setMortalidadForm({ ...mortalidadForm, cantidad_bajas: e.target.value })} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="causa_probable">Causa probable</Label>
                    <select id="causa_probable" value={mortalidadForm.causa_probable} onChange={(e) => setMortalidadForm({ ...mortalidadForm, causa_probable: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      {causasComunes.map((causa) => (
                        <option key={causa} value={causa}>{causa}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : "Guardar mortalidad"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resumen">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Resumen administrativo</CardTitle>
                  <CardDescription>Visualiza los datos de lotes, gastos y mortalidad desde tu backend administrativo.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={loadReporteResumen} disabled={reporteLoading}>
                  {reporteLoading ? "Actualizando..." : "Refrescar resumen"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reporteLoading ? (
                <p className="text-sm text-muted-foreground">Cargando resumen...</p>
              ) : reporteError ? (
                <p className="text-sm text-destructive">{reporteError}</p>
              ) : reporteResumen ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-border bg-card p-4 text-sm">
                      <p className="text-muted-foreground">Lotes activos</p>
                      <p className="mt-2 text-2xl font-bold">{reporteResumen.lotes_activos ?? "-"}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 text-sm">
                      <p className="text-muted-foreground">Gastos totales</p>
                      <p className="mt-2 text-2xl font-bold">{reporteResumen.gastos_totales?.toFixed(2) ?? "-"}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 text-sm">
                      <p className="text-muted-foreground">Ingresos totales</p>
                      <p className="mt-2 text-2xl font-bold">{reporteResumen.total_ingresos?.toFixed(2) ?? "-"}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 text-sm">
                      <p className="text-muted-foreground">Bajas totales</p>
                      <p className="mt-2 text-2xl font-bold">{reporteResumen.bajas_totales ?? "-"}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <h3 className="text-sm font-semibold">Gastos por tipo</h3>
                      {reporteResumen.gastos_por_tipo?.length ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <PieChart>
                            <Legend verticalAlign="bottom" height={36} />
                            <Pie
                              data={reporteResumen.gastos_por_tipo}
                              dataKey="monto_total"
                              nameKey="tipo_gasto"
                              outerRadius={90}
                              innerRadius={40}
                              paddingAngle={3}
                            >
                              {reporteResumen.gastos_por_tipo.map((entry, index) => (
                                <Cell key={entry.tipo_gasto} fill={["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7"][index % 5]} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: any, name?: any) => [`$${Number(value || 0).toFixed(2)}`, String(name ?? 'Monto')]}
                              labelFormatter={(label) => `Tipo: ${label}`}
                              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay datos de gastos disponibles.</p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4">
                      <h3 className="text-sm font-semibold">Treemap de gastos por tipo</h3>
                      {treemapData?.length ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <Treemap data={treemapData} dataKey="size" nameKey="name" stroke="#ffffff" fill="#60a5fa" />
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay datos de gastos para el treemap.</p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4">
                      <h3 className="text-sm font-semibold">Heatmap de mortalidad (últimos 35 días)</h3>
                      <p className="text-xs text-muted-foreground mt-1">Intensidad por número de bajas por día.</p>
                      <div className="mt-3">
                        <div className="grid grid-cols-7 gap-1">
                          {mortalidadHeatmap.dates.map((d) => {
                            const c = mortalidadHeatmap.counts[d] || 0;
                            const colors = ["#f8fafc", "#bfdbfe", "#60a5fa", "#2563eb", "#1e3a8a"];
                            const idx = Math.min(colors.length - 1, Math.round((c / (mortalidadHeatmap.max || 1)) * (colors.length - 1)));
                            return (
                              <div key={d} title={`${d}: ${c} bajas`} className="h-6 w-full rounded-sm" style={{ backgroundColor: colors[idx], border: '1px solid rgba(15,23,42,0.06)' }} />
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                          <span className="text-muted-foreground">Bajas:</span>
                          <div className="h-3 w-6 bg-[#f8fafc] border border-border" />
                          <div className="h-3 w-6 bg-[#bfdbfe]" />
                          <div className="h-3 w-6 bg-[#60a5fa]" />
                          <div className="h-3 w-6 bg-[#2563eb]" />
                          <div className="h-3 w-6 bg-[#1e3a8a]" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4">
                      <h3 className="text-sm font-semibold">Mortalidad por causa</h3>
                      {reporteResumen.mortalidad_por_causa?.length ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <BarChart data={reporteResumen.mortalidad_por_causa} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                            <XAxis dataKey="causa" tick={{ fontSize: 12, fill: '#0f172a' }} />
                            <YAxis tick={{ fill: '#0f172a' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a' }} formatter={(value: any) => [value ?? 0, 'Bajas']} />
                            <Bar dataKey="cantidad" fill="#22c55e" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay datos de mortalidad disponibles.</p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4">
                      <h3 className="text-sm font-semibold">Ventas por fecha</h3>
                      {reporteResumen.ventas_por_fecha?.length ? (
                        <ResponsiveContainer width="100%" height={260}>
                          <LineChart data={reporteResumen.ventas_por_fecha} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                            <XAxis
                              dataKey="fecha"
                              tick={{ fontSize: 12, fill: '#0f172a' }}
                              tickFormatter={(value: any) => {
                                try {
                                  return new Date(value).toLocaleDateString();
                                } catch {
                                  return String(value);
                                }
                              }}
                            />
                            <YAxis tick={{ fill: '#0f172a' }} />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a' }}
                              formatter={(value: any) => [`$${Number(value || 0).toFixed(2)}`, 'Ingreso']}
                              labelFormatter={(label: any) => {
                                try {
                                  return new Date(label).toLocaleDateString();
                                } catch {
                                  return String(label);
                                }
                              }}
                            />
                            <Line type="monotone" dataKey="ingreso_total" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay datos de ventas disponibles.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-4">
                    <h3 className="text-sm font-semibold">Ventas: ingreso diario y acumulado</h3>
                    {ventasConAcumulado?.length ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={ventasConAcumulado} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                          <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: '#0f172a' }} tickFormatter={(v: any) => {
                            try { return new Date(v).toLocaleDateString(); } catch { return String(v); }
                          }} />
                          <YAxis tick={{ fill: '#0f172a' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a' }} labelFormatter={(l: any) => {
                            try { return new Date(l).toLocaleDateString(); } catch { return String(l); }
                          }} formatter={(value: any) => [`$${Number(value || 0).toFixed(2)}`, 'Ingreso']} />
                          <Legend verticalAlign="top" align="right" />
                          <Bar dataKey="ingreso_total" name="Ingreso (día)" barSize={20} fill="#60a5fa" />
                          <Line dataKey="acumulado" name="Acumulado" stroke="#0ea5a4" strokeWidth={3} dot={false} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-sm text-muted-foreground">No hay datos de ventas disponibles.</p>
                    )}
                  </div>

                    <div className="rounded-2xl border border-border bg-card p-4">
                      <h3 className="text-sm font-semibold">Scatter: Precio por kilo vs Kilos vendidos</h3>
                      <p className="text-xs text-muted-foreground mt-1">Cada punto es una venta (precio vs kilos).</p>
                      {scatterData?.length ? (
                        <ResponsiveContainer width="100%" height={280}>
                          <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                            <XAxis type="number" dataKey="kilos" name="Kilos" unit="kg" tick={{ fill: '#0f172a' }} />
                            <YAxis type="number" dataKey="precio" name="Precio" unit="$" tick={{ fill: '#0f172a' }} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value: any, name: any) => [typeof value === 'number' ? Number(value).toFixed(2) : value, name]} />
                            <Legend />
                            <Scatter name="Venta" data={scatterData} fill="#ef4444" />
                          </ScatterChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay registros de venta detallados disponibles para el scatter.</p>
                      )}
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-4">
                      <h3 className="text-sm font-semibold">Gastos por tipo (apilado por lote si está disponible)</h3>
                      {gastosStackData?.length ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={gastosStackData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                            <XAxis dataKey={gastosStackData[0].lote ? 'lote' : 'grupo'} tick={{ fontSize: 12, fill: '#0f172a' }} />
                            <YAxis tick={{ fill: '#0f172a' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a' }} formatter={(value: any) => [`$${Number(value || 0).toFixed(2)}`, 'Monto']} />
                            <Legend verticalAlign="top" />
                            {(reporteResumen?.gastos_por_tipo ?? []).map((g: any, idx: number) => (
                              <Bar key={g.tipo_gasto} dataKey={String(g.tipo_gasto)} stackId="a" fill={["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7"][idx % 5]} />
                            ))}
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground">No hay datos de gastos disponibles.</p>
                      )}
                    </div>

                  </div>
              ) : (
                <p className="text-sm text-muted-foreground">El informe no está disponible.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="venta">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Factory className="h-4 w-4" /> Cierre de lote y venta</CardTitle>
              <CardDescription>Cierra el ciclo al vender el lote y actualiza el estado del lote.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleVentaSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="venta-lote">Lote activo</Label>
                    <select id="venta-lote" value={ventaForm.id_lote} onChange={(e) => setVentaForm({ ...ventaForm, id_lote: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="">Selecciona un lote</option>
                      {lotes.map((lote) => (
                        <option key={lote.id_lote} value={lote.id_lote}>{`Lote ${lote.id_lote} - ${lote.id_jaula}`}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kilos_totales_vendidos">Kilos vendidos</Label>
                    <Input id="kilos_totales_vendidos" type="number" step="0.01" min="0" value={ventaForm.kilos_totales_vendidos} onChange={(e) => setVentaForm({ ...ventaForm, kilos_totales_vendidos: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precio_por_kilo">Precio por kilo</Label>
                    <Input id="precio_por_kilo" type="number" step="0.01" min="0" value={ventaForm.precio_por_kilo} onChange={(e) => setVentaForm({ ...ventaForm, precio_por_kilo: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha_venta">Fecha de venta</Label>
                    <Input id="fecha_venta" type="date" value={ventaForm.fecha_venta} onChange={(e) => setVentaForm({ ...ventaForm, fecha_venta: e.target.value })} required />
                  </div>
                </div>
                <Button type="submit" disabled={submitting}>{submitting ? "Guardando..." : "Guardar cierre de lote"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
