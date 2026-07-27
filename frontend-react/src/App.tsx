import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Index";
import Lifecycle from "@/pages/Lifecycle";
import History from "@/pages/History";
import Alerts from "@/pages/Alerts";
import SensorMap from "@/pages/SensorMap";
import Administrative from "@/pages/Administrative";
import { Toaster } from "@/components/ui/toaster";

// --- Importaciones del Nuevo Módulo Contable ---
import Contabilidad from "@/pages/accounting/Contabilidad";
import Administracion from "@/pages/accounting/Administracion";
import Ventas from "@/pages/accounting/Ventas";
import Desarrollo from "@/pages/accounting/Desarrollo";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/lifecycle" element={<Lifecycle />} />
          <Route path="/history" element={<History />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/sensor-map" element={<SensorMap />} />
          
          {/* Ruta Administrativa Original */}
          <Route path="/administrative" element={<Administrative />} />          
          
          {/* --- Rutas del Nuevo Módulo Contable --- */}
          <Route path="/accounting/finances" element={<Contabilidad />} />
          <Route path="/accounting/admin" element={<Administracion />} />
          <Route path="/accounting/sales" element={<Ventas />} />
          <Route path="/accounting/software" element={<Desarrollo />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;