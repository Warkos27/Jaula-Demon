import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Activity, LineChart, AlertTriangle, Map, Menu, X, Settings, 
  Calculator, ShieldCheck, TrendingUp, Code, ChevronDown, Sun, Moon
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/lifecycle", label: "Ciclo de Vida", icon: Activity },
  { path: "/history", label: "Historial", icon: LineChart },
  { path: "/alerts", label: "Alertas", icon: AlertTriangle },
  { path: "/sensor-map", label: "Mapa Sensores", icon: Map },
  { path: "/administrative", label: "Operaciones", icon: Settings },
];

const contableItems = [
  { path: "/accounting/finances", label: "Contabilidad", desc: "Costos de crianza", icon: Calculator },
  { path: "/accounting/admin", label: "Administración", desc: "Decisiones y metas", icon: ShieldCheck },
  { path: "/accounting/sales", label: "Ventas", desc: "Estrategias de venta", icon: TrendingUp },
  { path: "/accounting/software", label: "Desarrollo", desc: "Impacto tecnológico", icon: Code },
];

function LogoSvg() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      <ellipse cx="24" cy="28" rx="14" ry="13" fill="#f59e0b" opacity="0.9" />
      <circle cx="24" cy="16" r="9" fill="#fbbf24" />
      <circle cx="21" cy="14" r="2" fill="#1f2937" />
      <circle cx="21.5" cy="13.5" r="0.7" fill="white" />
      <polygon points="27,16 33,15 27,18" fill="#f97316" />
      <path d="M22 8 Q24 4 26 8 Q28 5 29 9" fill="#ef4444" opacity="0.8" />
      <ellipse cx="17" cy="30" rx="5" ry="7" fill="#d97706" opacity="0.6" transform="rotate(-15 17 30)" />
      <path d="M6 38 L12 38 L14 36 L18 36" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
      <path d="M30 36 L34 36 L36 38 L42 38" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
      <circle cx="6" cy="38" r="1.5" fill="#22c55e" opacity="0.7" />
      <circle cx="42" cy="38" r="1.5" fill="#22c55e" opacity="0.7" />
      <circle cx="14" cy="36" r="1" fill="#3b82f6" className="animate-pulse" />
      <circle cx="34" cy="36" r="1" fill="#3b82f6" className="animate-pulse" />
    </svg>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contableOpen, setContableOpen] = useState(true);

  // === SISTEMA MODO CLARO / OSCURO ===
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "light" ? "light" : "dark";
    }
    return "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  // =====================================

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-500">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-300 ease-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border">
          <LogoSvg />
          <div>
            <h1 className="text-xl font-black text-foreground tracking-tight">Don Pollito</h1>
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">IoT Systems</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
          <nav className="space-y-1">
            <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">General</p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary drop-shadow-sm" : "opacity-70"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-1">
            <button
              onClick={() => setContableOpen(!contableOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-amber-500 hover:bg-amber-500/10 transition-all border border-transparent hover:border-amber-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-amber-500/20 rounded-lg shadow-sm">
                  <Calculator className="w-4 h-4 text-amber-500" />
                </div>
                Módulo Contable
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${contableOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${contableOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden space-y-1 pl-4 border-l-2 border-border ml-6">
                {contableItems.map((item) => {
                  const isActive = location.pathname.includes(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-300 group ${
                        isActive ? "bg-secondary text-foreground font-bold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                      <div className="flex flex-col">
                        <span>{item.label}</span>
                        <span className="text-[10px] font-normal opacity-70">{item.desc}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-700 flex items-center justify-center border-2 border-primary/20 shadow-sm">
              <span className="font-bold text-white">DP</span>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Admin Global</p>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> AWS Conectado
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors text-foreground">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground font-medium bg-secondary px-4 py-1.5 rounded-full border border-border">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Sincronización en tiempo real activa
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* BOTÓN DEL SOL Y LA LUNA */}
            <button 
              onClick={toggleTheme} 
              className="p-2.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-border transition-all shadow-sm"
              title="Cambiar Modo"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20 hidden sm:block">
              Enterprise v2.0
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background transition-colors duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}