import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  LineChart,
  AlertTriangle,
  Map,
  Menu,
  X,
  Egg,
  Settings,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/lifecycle", label: "Ciclo de Vida", icon: Activity },
  { path: "/history", label: "Historial", icon: LineChart },
  { path: "/alerts", label: "Alertas", icon: AlertTriangle },
  { path: "/sensor-map", label: "Mapa Sensores", icon: Map },
  { path: "/administrative", label: "Administrativo", icon: Settings },
];

function LogoSvg() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
      {/* Chick body */}
      <ellipse cx="24" cy="28" rx="14" ry="13" fill="#f59e0b" opacity="0.9" />
      {/* Chick head */}
      <circle cx="24" cy="16" r="9" fill="#fbbf24" />
      {/* Eye */}
      <circle cx="21" cy="14" r="2" fill="#1f2937" />
      <circle cx="21.5" cy="13.5" r="0.7" fill="white" />
      {/* Beak */}
      <polygon points="27,16 33,15 27,18" fill="#f97316" />
      {/* Crest */}
      <path d="M22 8 Q24 4 26 8 Q28 5 29 9" fill="#ef4444" opacity="0.8" />
      {/* Wing */}
      <ellipse cx="17" cy="30" rx="5" ry="7" fill="#d97706" opacity="0.6" transform="rotate(-15 17 30)" />
      {/* Circuit lines */}
      <path d="M6 38 L12 38 L14 36 L18 36" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
      <path d="M30 36 L34 36 L36 38 L42 38" stroke="#22c55e" strokeWidth="1.5" opacity="0.7" />
      <circle cx="6" cy="38" r="1.5" fill="#22c55e" opacity="0.7" />
      <circle cx="42" cy="38" r="1.5" fill="#22c55e" opacity="0.7" />
      {/* Sensor dots */}
      <circle cx="14" cy="36" r="1" fill="#3b82f6" className="animate-pulse" />
      <circle cx="34" cy="36" r="1" fill="#3b82f6" className="animate-pulse" />
    </svg>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))] transform transition-transform duration-300 ease-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-[hsl(var(--sidebar-border))]">
            <LogoSvg />
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">Don Pollito</h1>
              <p className="text-xs text-muted-foreground">Sistema de Monitoreo</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-[hsl(var(--sidebar-accent))] hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-[hsl(var(--sidebar-border))]">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Egg className="w-4 h-4 text-amber-500" />
              <span>Jaula #1 · Activa</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-400">Sensores conectados</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-card/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Última lectura: {new Date().toLocaleTimeString("es-ES")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
              v2.0
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}