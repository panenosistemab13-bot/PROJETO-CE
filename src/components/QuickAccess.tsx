import React from 'react';
import {
  FilePlus,
  ArrowLeftRight,
  Shield,
  Video,
  Users,
  BarChart2,
} from 'lucide-react';

interface QuickAccessProps {
  onAction: (actionId: string) => void;
}

export function QuickAccess({ onAction }: QuickAccessProps) {
  const actions = [
    {
      id: 'novo-registro',
      label: 'Novo Registro',
      desc: 'Ocorrência Imediata',
      icon: FilePlus,
      color: '#c9a265',
    },
    {
      id: 'passagem-plantao',
      label: 'Passagem Plantão',
      desc: 'Troca de Turno CCO',
      icon: ArrowLeftRight,
      color: '#60a5fa',
    },
    {
      id: 'rondas-ativas',
      label: 'Rondas Ativas',
      desc: 'Checklist & GPS',
      icon: Shield,
      color: '#34d399',
    },
    {
      id: 'cameras',
      label: 'Câmeras',
      desc: 'Mosaico CFTV 4K',
      icon: Video,
      color: '#94a3b8',
    },
    {
      id: 'lideres',
      label: 'Líderes',
      desc: 'Contato Rádio & Posto',
      icon: Users,
      color: '#c9a265',
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      desc: 'Analytics & SLA',
      icon: BarChart2,
      color: '#dfbe85',
    },
  ];

  return (
    <div className="bg-[#151b26] border border-[#1f2737] hover:border-[#c9a265]/50 rounded-2xl p-5 shadow-xl transition-all">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wider">
          Acesso Rápido
        </h3>
        <span className="text-[10px] text-[#94a3b8]">6 Atalhos</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onAction(act.id)}
              className="bg-[#0c1017] hover:bg-[#151b26] border border-[#1f2737] hover:border-[#c9a265]/50 p-3 rounded-xl text-left transition-all duration-150 hover:-translate-y-0.5 group flex items-start space-x-2.5 cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{
                  backgroundColor: `${act.color}18`,
                  border: `1px solid ${act.color}40`,
                }}
              >
                <Icon className="w-4 h-4" style={{ color: act.color }} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold text-white group-hover:text-[#c9a265] transition-colors truncate">
                  {act.label}
                </p>
                <p className="text-[10px] text-[#94a3b8] truncate mt-0.5">{act.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

