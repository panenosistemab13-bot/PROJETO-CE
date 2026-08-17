import React from 'react';
import { X, Users, Radio, BatteryCharging } from 'lucide-react';

interface TeamLeadersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LEADERS = [
  {
    name: 'Lucas Ferreira',
    role: 'Supervisor de Ronda Tática (Equipe A)',
    unit: 'Fábrica Eusébio',
    radio: 'Canal 03 - HT-104',
    battery: '94%',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Gabrielle Freire',
    role: 'Líder Operacional CCO (Equipe B)',
    unit: 'Matriz Fortaleza',
    radio: 'Canal 01 - CCO Central',
    battery: '100%',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Airton Lima',
    role: 'Coordenador de Portaria & Acesso',
    unit: 'Hub Messejana',
    radio: 'Canal 02 - HT-202',
    battery: '82%',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  },
  {
    name: 'Carlos Eduardo',
    role: 'Supervisor Turno Noturno B',
    unit: 'CD Praia de Iracema',
    radio: 'Canal 04 - HT-301',
    battery: '78%',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  },
];

export function TeamLeadersModal({ isOpen, onClose }: TeamLeadersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E7E5E4] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E7E5E4] bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#FDF8EE] border border-[#c9a265] flex items-center justify-center text-[#8c6a38]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1917] font-serif">
                Líderes & Equipes de Segurança em Campo
              </h3>
              <p className="text-xs text-[#78716C]">
                Comunicação Direta &bull; Café Três Corações
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
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto bg-[#F9F9F8]">
          {LEADERS.map((ldr) => (
            <div
              key={ldr.name}
              className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#c9a265] transition-all shadow-xs"
            >
              <div className="flex items-center space-x-3.5 min-w-0 w-full sm:w-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#c9a265] flex-shrink-0">
                  <img
                    src={ldr.avatar}
                    alt={ldr.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#16A34A] border-2 border-white rounded-full"></span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#1C1917] truncate">{ldr.name}</h4>
                  <p className="text-xs text-[#8c6a38] font-semibold truncate">{ldr.role}</p>
                  <p className="text-[11px] text-[#78716C]">{ldr.unit}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs text-[#78716C] w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <span className="text-[#1C1917] font-mono font-bold block">{ldr.radio}</span>
                  <span className="text-[10px] text-[#16A34A] font-semibold flex items-center space-x-1 justify-end">
                    <BatteryCharging className="w-3 h-3" />
                    <span>Bateria {ldr.battery}</span>
                  </span>
                </div>
                <button
                  onClick={() => alert(`Iniciando chamada via rádio com ${ldr.name}`)}
                  className="px-3 py-1.5 bg-gradient-to-r from-[#c9a265] to-[#dfbe85] text-[#1C1917] rounded-lg font-bold text-xs flex items-center space-x-1.5 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Chamar Rádio</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E7E5E4] bg-[#FAF8F5] flex justify-between items-center text-xs">
          <span className="text-[#78716C]">4 de 4 líderes com canal de áudio criptografado ativo</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-[#c9a265] to-[#dfbe85] text-[#1C1917] rounded-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
