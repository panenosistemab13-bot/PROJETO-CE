import React from 'react';
import {
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  iconBg: string;
  iconColor: string;
}

const ACTIVITIES: ActivityItem[] = [];

interface RecentActivitiesProps {
  onSelectActivity?: (activity: ActivityItem) => void;
}

export function RecentActivities({ onSelectActivity }: RecentActivitiesProps) {
  return (
    <div className="bg-[#151b26] border border-[#1f2737] hover:border-[#c9a265]/50 rounded-2xl p-5 flex flex-col justify-between h-full min-h-[300px] shadow-xl transition-all">
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#c9a265] animate-pulse"></span>
            <h3 className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wider">
              ATIVIDADES RECENTES
            </h3>
          </div>
          <span className="text-[9px] text-[#34d399] font-bold bg-[#10241e] px-2 py-0.5 rounded-md border border-[#10b981]/40 shadow-xs">
            TEMPO REAL
          </span>
        </div>

        {/* Activity Items List */}
        {ACTIVITIES.length > 0 ? (
          <div className="space-y-2">
            {ACTIVITIES.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  onClick={() => onSelectActivity?.(act)}
                  className="p-2.5 rounded-xl bg-[#0c1017] border border-[#1f2737] hover:border-[#c9a265]/50 transition-all flex items-center space-x-3 cursor-pointer group shadow-sm hover:shadow-md"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${act.iconBg} ${act.iconColor}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate group-hover:text-[#c9a265] transition-colors leading-tight">
                      {act.title}
                    </p>
                    <p className="text-[10px] text-[#94a3b8] truncate mt-0.5 font-normal">
                      {act.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-[210px] flex flex-col items-center justify-center text-center p-4 rounded-xl bg-[#0c1017] border border-[#1f2737]/60">
            <div className="w-10 h-10 rounded-xl bg-[#151b26] border border-[#1f2737] flex items-center justify-center mb-2.5 text-[#c9a265]/60 shadow-xs">
              <Clock className="w-5 h-5 text-[#c9a265]" />
            </div>
            <p className="text-xs font-bold text-slate-200">Nenhuma atividade registrada</p>
            <p className="text-[10px] text-[#94a3b8] max-w-[220px] mt-1">
              Novos registros de rondas, ocorrências e trocas de turno aparecerão aqui em tempo real.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[9.5px] font-bold text-[#34d399] bg-[#10241e] px-2 py-0.5 rounded-md border border-[#10b981]/30">
              <ShieldCheck className="w-3 h-3" />
              <span>SISTEMA ATIVO & MONITORANDO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

