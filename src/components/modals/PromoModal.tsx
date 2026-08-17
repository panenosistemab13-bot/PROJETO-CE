import React from 'react';
import { X, Shield, Award } from 'lucide-react';
import sunsetHeroCup from '../../assets/images/hero_fortaleza_cup_1786935044690.jpg';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PromoModal({ isOpen, onClose }: PromoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#151b26] border border-[#1f2737] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Image with Fortaleza Sunset Beach & Coffee Cup */}
        <div className="relative h-48 w-full">
          <img
            src={sunsetHeroCup}
            alt="Praia de Fortaleza - Café Três Corações"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151b26] via-[#151b26]/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-[#0c1017]/80 text-[#94a3b8] hover:text-white rounded-full transition-colors cursor-pointer shadow-md border border-[#1f2737]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6">
            <span className="text-[10px] text-[#c9a265] font-bold uppercase tracking-widest bg-[#0c1017]/90 px-2.5 py-1 rounded border border-[#c9a265]/50 shadow-xs">
              Desde 1959 &bull; Fortaleza - CE
            </span>
            <h3 className="font-serif text-2xl text-white font-medium mt-1">
              Tradição que protege. Excelência que marca.
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-[#cbd5e1] leading-relaxed bg-[#151b26]">
          <p>
            O Grupo <strong className="text-[#c9a265]">Café Três Corações</strong> é líder nacional no segmento de café e bebidas quentes. Com mais de seis décadas de paixão, inovação e sustentabilidade, operamos com rigorosos padrões de segurança patrimonial, integridade logística e excelência fabril.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-[#0c1017] p-3.5 rounded-xl border border-[#1f2737] shadow-sm">
              <Shield className="w-5 h-5 text-[#c9a265] mb-1.5" />
              <h4 className="font-bold text-white text-xs">Proteção 24/7</h4>
              <p className="text-[11px] text-[#94a3b8] mt-0.5 font-normal">
                Monitoramento perimetral de ponta a ponta nas unidades fabris, CDs e orla portuária.
              </p>
            </div>

            <div className="bg-[#0c1017] p-3.5 rounded-xl border border-[#1f2737] shadow-sm">
              <Award className="w-5 h-5 text-[#c9a265] mb-1.5" />
              <h4 className="font-bold text-white text-xs">Certificação Global</h4>
              <p className="text-[11px] text-[#94a3b8] mt-0.5 font-normal">
                Rastreabilidade de lotes, compliance e gestão de riscos em tempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2737] bg-[#0c1017] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#c9a265] hover:bg-[#dfbe85] text-[#0c1017] rounded-lg font-bold uppercase tracking-wider transition-colors text-xs cursor-pointer shadow-md"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}


