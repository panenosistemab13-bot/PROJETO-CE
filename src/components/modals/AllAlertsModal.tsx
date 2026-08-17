import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
} from 'lucide-react';

interface AllAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_ALERTS: Array<{
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  unit: string;
  time: string;
  status: 'pendente' | 'em_atendimento' | 'resolvido';
  desc: string;
}> = [];

export function AllAlertsModal({ isOpen, onClose }: AllAlertsModalProps) {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filter, setFilter] = useState<'todos' | 'critical' | 'warning' | 'info'>('todos');

  if (!isOpen) return null;

  const handleResolve = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolvido' } : a))
    );
  };

  const filtered = alerts.filter((a) => filter === 'todos' || a.level === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E7E5E4] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E7E5E4] bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC2626]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1917] font-serif">
                Central de Gestão de Riscos & Alertas
              </h3>
              <p className="text-xs text-[#78716C]">
                Monitoramento Ativo 24/7 &bull; Café Três Corações
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#1C1917] rounded-lg hover:bg-[#F5F3EF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-[#E7E5E4] bg-[#FAF8F5] flex items-center space-x-2 text-xs">
          <span className="text-[#78716C] font-semibold mr-2">Filtrar:</span>
          {(['todos', 'critical', 'warning', 'info'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-[#c9a265] text-[#1C1917] font-bold shadow-xs'
                  : 'bg-white text-[#78716C] hover:text-[#1C1917] border border-[#E7E5E4]'
              }`}
            >
              {f === 'todos'
                ? 'Todos'
                : f === 'critical'
                ? 'Críticos'
                : f === 'warning'
                ? 'Atenção'
                : 'Informativos'}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 bg-[#F9F9F8]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5F3EF] flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-[#16A34A]" />
              </div>
              <h4 className="text-sm font-bold text-[#1C1917]">Nenhum alerta {filter !== 'todos' ? 'deste tipo ' : ''}neste momento</h4>
              <p className="text-xs text-[#78716C] mt-1 max-w-xs">
                A operação está ocorrendo dentro da normalidade. Continue monitorando os indicadores.
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#c9a265] transition-all shadow-xs"
              >
                <div className="flex items-start space-x-3 min-w-0">
                  {item.level === 'critical' ? (
                    <AlertCircle className="w-5 h-5 text-[#DC2626] mt-0.5 flex-shrink-0" />
                  ) : item.level === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-[#8c6a38] mt-0.5 flex-shrink-0" />
                  ) : (
                    <Info className="w-5 h-5 text-[#2563EB] mt-0.5 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-[#78716C] font-semibold">{item.id}</span>
                      <h4 className="text-xs font-bold text-[#1C1917] truncate">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-[#57534E] mt-0.5">{item.desc}</p>
                    <p className="text-[10px] text-[#78716C] mt-1 font-medium">
                      {item.unit} &bull; {item.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                  {item.status === 'resolvido' ? (
                    <span className="text-[10px] bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] px-2.5 py-1 rounded-full font-bold flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Resolvido</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleResolve(item.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-[#c9a265] to-[#dfbe85] text-[#1C1917] rounded-lg font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                    >
                      Atender & Normalizar
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E7E5E4] bg-[#FAF8F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-[#c9a265] to-[#dfbe85] text-[#1C1917] rounded-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity text-xs cursor-pointer shadow-xs"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
