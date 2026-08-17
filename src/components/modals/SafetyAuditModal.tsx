import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Radio,
  Server,
  Database,
  Key,
} from 'lucide-react';

interface SafetyAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SafetyAuditModal({ isOpen, onClose }: SafetyAuditModalProps) {
  if (!isOpen) return null;

  const subsystems = [
    {
      name: 'Controle de Acesso Biométrico & Catracas',
      status: '100% Operacional',
      latency: '18ms',
      icon: Key,
    },
    {
      name: 'Rede CFTV IP & Gravação Redundante NVR',
      status: '98.5% Operacional (1 Câmera em teste)',
      latency: '24ms',
      icon: Server,
    },
    {
      name: 'Sensores de Perímetro Infravermelho & Cerca Virtual',
      status: '100% Operacional',
      latency: '12ms',
      icon: Lock,
    },
    {
      name: 'Comunicação Rádio Trunking Digital CCO',
      status: '100% Operacional',
      latency: '8ms',
      icon: Radio,
    },
    {
      name: 'Nuvem Segura & Backup Criptografado',
      status: '100% Sincronizado',
      latency: '45ms',
      icon: Database,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E7E5E4] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E7E5E4] bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1917] font-serif">
                Integridade Operacional do Sistema
              </h3>
              <p className="text-xs text-[#78716C]">
                Auditoria em Tempo Real &bull; Café Três Corações
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
          <div className="bg-[#F0FDF4] p-4 rounded-xl border border-[#BBF7D0] flex items-center justify-between mb-4 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-[#16A34A] animate-pulse"></div>
              <div>
                <h4 className="text-sm font-bold text-[#15803D] uppercase tracking-wider">
                  Status Geral: Sistema 100% Seguro
                </h4>
                <p className="text-xs text-[#166534]">
                  Todos os protocolos de contingência e redundância ativos.
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#15803D] bg-white px-2.5 py-1 rounded border border-[#BBF7D0]">TLS 1.3 / AES-256</span>
          </div>

          {subsystems.map((sys) => {
            const Icon = sys.icon;
            return (
              <div
                key={sys.name}
                className="bg-white border border-[#E7E5E4] rounded-xl p-3.5 flex items-center justify-between hover:border-[#c9a265] transition-all shadow-xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E7E5E4] flex items-center justify-center text-[#8c6a38]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1C1917]">{sys.name}</p>
                    <p className="text-[11px] text-[#16A34A] flex items-center space-x-1 mt-0.5 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{sys.status}</span>
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#78716C] bg-[#F5F3EF] px-2 py-1 rounded border border-[#E7E5E4] font-medium">
                  {sys.latency}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E7E5E4] bg-[#FAF8F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-[#c9a265] to-[#dfbe85] text-[#1C1917] rounded-lg font-bold uppercase tracking-wider hover:opacity-90 transition-opacity text-xs cursor-pointer shadow-xs"
          >
            Fechar Auditoria
          </button>
        </div>
      </div>
    </div>
  );
}
