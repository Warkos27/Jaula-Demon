import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { SensorStatus } from "@/lib/constants";

interface AlertBadgeProps {
  status: SensorStatus;
  message: string;
  sensorName: string;
  value: number;
  unit: string;
}

export default function AlertBadge({ status, message, sensorName, value, unit }: AlertBadgeProps) {
  if (status === "normal") return null;

  const isDanger = status === "danger";

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 ${
        isDanger
          ? "bg-red-500/5 border-red-500/30 animate-blink-warning"
          : "bg-amber-500/5 border-amber-500/30"
      }`}
    >
      {isDanger ? (
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${isDanger ? "text-red-400" : "text-amber-400"}`}>
            {sensorName}
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">
            {value}{unit}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

export function StatusSummary({ normalCount, warningCount, dangerCount }: { normalCount: number; warningCount: number; dangerCount: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-400 font-medium">{normalCount}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-sm text-amber-400 font-medium">{warningCount}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-400 font-medium">{dangerCount}</span>
      </div>
    </div>
  );
}