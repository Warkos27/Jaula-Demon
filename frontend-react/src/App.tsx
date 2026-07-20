import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Index";
import Lifecycle from "@/pages/Lifecycle";
import History from "@/pages/History";
import Alerts from "@/pages/Alerts";
import SensorMap from "@/pages/SensorMap";
import Administrative from "@/pages/Administrative";
import { Toaster } from "@/components/ui/toaster"; // <-- IMPORTACIÓN NUEVA

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
          <Route path="/administrative" element={<Administrative />} />          
        </Routes>
      </Layout>
      <Toaster /> {/* <-- CONTENEDOR DE NOTIFICACIONES */}
    </Router>
  );
}

export default App;