import React from 'react';
import {
  Briefcase,
  RotateCcw,
  Users,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

interface KpiCardsProps {
  onCardClick?: (type: string) => void;
}

export function KpiCards({ onCardClick }: KpiCardsProps) {
  const cards = [
    {
      id: 'ocorrencias',
      title: 'OCORRÊNCIAS HOJE',
      value: '00',
      change: 'Nenhuma ocorrência',
      changeColor: 'text-[#94a3b8]',
      icon: Briefcase,
      iconBg: 'bg-[#241e15] border-[#c9a265]/40 text-[#c9a265]',
    },
    {
      id: 'rondas',
      title: 'RONDAS REALIZADAS',
      value: '00',
      change: 'Aguardando turnos',
      changeColor: 'text-[#94a3b8]',
      icon: RotateCcw,
      iconBg: 'bg-[#241e15] border-[#c9a265]/40 text-[#c9a265]',
    },
    {
      id: 'equipes',
      title: 'EQUIPES ATIVAS',
      value: '00',
      change: 'Escala em espera',
      changeColor: 'text-[#94a3b8]',
      icon: Users,
      iconBg: 'bg-[#10241e] border-[#10b981]/40 text-[#34d399]',
    },
    {
      id: 'alertas',
      title: 'ALERTAS CRÍTICOS',
      value: '00',
      change: 'Nenhum alerta ativo',
      changeColor: 'text-[#34d399]',
      icon: AlertTriangle,
      iconBg: 'bg-[#10241e] border-[#10b981]/40 text-[#34d399]',
    },
    {
      id: 'status',
      title: 'STATUS DO SISTEMA',
      value: '100%',
      change: 'Operacional',
      changeColor: 'text-[#34d399]',
      icon: ShieldCheck,
      iconBg: 'bg-[#10241e] border-[#10b981]/40 text-[#34d399]',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 2xl:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card.id)}
            className="bg-[#151b26] border border-[#1f2737] hover:border-[#c9a265]/60 p-4 2xl:p-5 rounded-2xl shadow-xl transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer flex items-center space-x-3.5"
          >
            {/* Icon Box */}
            <div
              className={`w-11 h-11 2xl:w-12 2xl:h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${card.iconBg} shadow-sm group-hover:scale-105 transition-transform`}
            >
              <Icon className="w-5 h-5 2xl:w-6 2xl:h-6" />
            </div>

            {/* Metric Info */}
            <div className="min-w-0 flex-1">
              <span className="text-[9px] 2xl:text-[10px] font-bold text-[#94a3b8] tracking-wider uppercase block truncate">
                {card.title}
              </span>
              <span className="text-xl 2xl:text-2xl font-extrabold text-white font-sans tracking-tight block leading-tight my-0.5">
                {card.value}
              </span>
              <span className={`text-[10px] 2xl:text-[11px] font-semibold block truncate ${card.changeColor}`}>
                {card.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

