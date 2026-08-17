import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  Radio,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

interface PriorityAlertsProps {
  onOpenAllAlerts: () => void;
  onDispatchTeam?: (alertTitle: string) => void;
}

export function PriorityAlerts({ onOpenAllAlerts, onDispatchTeam }: PriorityAlertsProps) {
  return (
    <div className="bg-[#151b26] border border-[#1f2737] hover:border-[#c9a265]/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between relative transition-all">
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-[#ef4444]" />
            <h3 className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wider">
              Alertas Prioritários
            </h3>
          </div>
          <span className="text-[9px] bg-[#10241e] text-[#34d399] border border-[#10b981]/40 px-2 py-0.5 rounded-md font-bold uppercase">
            0 Ativos
          </span>
        </div>

        {/* Empty State */}
        <div className="h-[210px] flex flex-col items-center justify-center text-center p-4 rounded-xl bg-[#0c1017] border border-[#1f2737]/60">
          <div className="w-10 h-10 rounded-xl bg-[#10241e] border border-[#10b981]/30 flex items-center justify-center mb-2.5 shadow-xs">
            <ShieldAlert className="w-5 h-5 text-[#34d399]" />
          </div>
          <p className="text-xs font-bold text-slate-200">Nenhum alerta prioritário</p>
          <p className="text-[10px] text-[#94a3b8] max-w-[220px] mt-1">
            Nenhuma ocorrência crítica detectada no perímetro monitorado.
          </p>
        </div>
      </div>

      {/* Footer Link */}
      <button
        onClick={onOpenAllAlerts}
        className="w-full mt-3 py-2 text-center text-xs text-[#c9a265] hover:text-[#dfbe85] font-semibold border-t border-[#1f2737] pt-3 flex items-center justify-center space-x-1 group cursor-pointer"
      >
        <span>Ver Histórico de Alertas</span>
        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

