import React from 'react';
import {
  X,
  Shield,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  Radio,
  Play,
  FileCheck,
} from 'lucide-react';

interface PatrolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PATROL_ROUTES = [
  {
    id: 'RND-01',
    name: 'Perímetro Externo & Muro Leste',
    unit: 'Fábrica Eusébio',
    officer: 'Marcos Silva',
    progress: 85,
    checkpoints: '17 / 20 Pontos RFID',
    status: 'Em andamento',
    eta: 'Conclusão em 10 min',
  },
  {
    id: 'RND-02',
    name: 'Torrefação & Silos de Grão Verde',
    unit: 'Fábrica Eusébio',
    officer: 'Thiago Mendes',
    progress: 100,
    checkpoints: '12 / 12 Pontos RFID',
    status: 'Concluído',
    eta: 'Finalizado às 13:30',
  },
  {
    id: 'RND-03',
    name: 'Estacionamento & Docas Logísticas',
    unit: 'CD Praia de Iracema',
    officer: 'Carlos Eduardo',
    progress: 50,
    checkpoints: '8 / 16 Pontos RFID',
    status: 'Em andamento',
    eta: 'Conclusão em 25 min',
  },
];

export function PatrolsModal({ isOpen, onClose }: PatrolsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E7E5E4] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E7E5E4] bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1917] font-serif">
                Rondas Ativas & Checklists RFID
              </h3>
              <p className="text-xs text-[#78716C]">
                Patrulhamento Perimetral &bull; Café Três Corações
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

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto bg-[#F9F9F8]">
          {PATROL_ROUTES.map((route) => (
            <div
              key={route.id}
              className="bg-white border border-[#E7E5E4] rounded-xl p-4 hover:border-[#c9a265] transition-all shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#8c6a38] bg-[#FDF8EE] px-2 py-0.5 rounded border border-[#c9a265]">
                    {route.id}
                  </span>
                  <h4 className="text-sm font-bold text-[#1C1917] mt-1">{route.name}</h4>
                  <p className="text-xs text-[#78716C]">{route.unit}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                    route.status === 'Concluído'
                      ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]'
                      : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                  }`}
                >
                  {route.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="my-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#78716C]">{route.checkpoints}</span>
                  <span className="text-[#1C1917] font-bold">{route.progress}%</span>
                </div>
                <div className="w-full bg-[#E7E5E4] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#c9a265] to-[#16A34A] h-full rounded-full transition-all duration-500"
                    style={{ width: `${route.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#78716C] pt-2 border-t border-[#E7E5E4]">
                <span>Vigilante: <b className="text-[#1C1917]">{route.officer}</b></span>
                <span>{route.eta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E7E5E4] bg-[#FAF8F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-[#c9a265] to-[#dfbe85] text-[#1C1917] rounded-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity text-xs cursor-pointer shadow-xs"
          >
            Fechar Rondas
          </button>
        </div>
      </div>
    </div>
  );
}
