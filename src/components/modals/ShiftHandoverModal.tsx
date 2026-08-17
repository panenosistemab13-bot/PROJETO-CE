import React, { useState } from 'react';
import {
  X,
  ArrowLeftRight,
  User,
  Shield,
  CheckCircle2,
  Clock,
  FileCheck,
} from 'lucide-react';

interface ShiftHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShiftHandoverModal({ isOpen, onClose }: ShiftHandoverModalProps) {
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Controle de chaves e lacres de armazém conferidos', checked: true },
    { id: 2, text: 'Baterias dos rádios HT em 100% de carga', checked: true },
    { id: 3, text: 'Nenhum alarme falso ou sensor inoperante pendente', checked: true },
    { id: 4, text: 'Equipe de ronda diurna alocada e com rotas ativas', checked: true },
    { id: 5, text: 'Livro digital de ocorrências assinado eletronicamente', checked: true },
  ]);

  if (!isOpen) return null;

  const toggleItem = (id: number) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleConfirm = () => {
    alert('Passagem de plantão validada com sucesso via autenticação segura!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E7E5E4] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E7E5E4] bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1917] font-serif">
                Passagem de Plantão CCO
              </h3>
              <p className="text-xs text-[#78716C]">
                Troca de Turno Operacional &bull; Café Três Corações
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
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-[#F9F9F8]">
          {/* Officers Involved */}
          <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-[#E7E5E4] shadow-xs">
            <div>
              <span className="text-[10px] text-[#78716C] font-semibold uppercase tracking-wider block">
                Operador Entregante
              </span>
              <p className="text-xs font-bold text-[#1C1917] mt-1">Cristiane Fialho</p>
              <p className="text-[10px] text-[#8c6a38] font-medium">Turno Diurno A (06:00 - 14:00)</p>
            </div>
            <div className="border-l border-[#E7E5E4] pl-3">
              <span className="text-[10px] text-[#78716C] font-semibold uppercase tracking-wider block">
                Operador Assumindo
              </span>
              <p className="text-xs font-bold text-[#1C1917] mt-1">Lucas Ferreira</p>
              <p className="text-[10px] text-[#2563EB] font-medium">Turno Tarde B (14:00 - 22:00)</p>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h4 className="text-xs font-bold text-[#78716C] uppercase tracking-wider mb-2">
              Checklist de Transferência Operacional
            </h4>
            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center space-x-3 p-2.5 rounded-lg bg-white border border-[#E7E5E4] hover:border-[#c9a265] cursor-pointer transition-all shadow-2xs"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="rounded border-[#E7E5E4] text-[#c9a265] focus:ring-0 cursor-pointer"
                  />
                  <span
                    className={`text-xs ${
                      item.checked ? 'text-[#1C1917] font-medium' : 'text-[#A8A29E] line-through'
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E7E5E4] bg-[#FAF8F5] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] rounded-lg hover:bg-[#F5F3EF] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-colors flex items-center space-x-2 shadow-xs cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>Assinar & Transferir Plantão</span>
          </button>
        </div>
      </div>
    </div>
  );
}
