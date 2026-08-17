import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  FileText,
  MapPin,
  Calendar,
  Clock,
  Send,
  Camera,
  Shield,
} from 'lucide-react';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (data: any) => void;
}

export function NewIncidentModal({ isOpen, onClose, onSuccess }: NewIncidentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    unit: 'Matriz Fortaleza',
    type: 'Segurança Patrimonial',
    severity: 'media',
    description: '',
    officer: 'Cristiane Fialho',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess?.(formData);
      onClose();
      alert('Incidente registrado com sucesso no CCO Central!');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E7E5E4] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E7E5E4] bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#FDF8EE] border border-[#c9a265] flex items-center justify-center text-[#8c6a38]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1917] font-serif">
                Novo Registro de Ocorrência
              </h3>
              <p className="text-xs text-[#78716C]">
                Central de Comando Operacional &bull; Café Três Corações
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
              Título da Ocorrência *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Rompimento de feixe perimetral leste"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#F9F9F8] border border-[#E7E5E4] rounded-xl px-4 py-2.5 text-sm text-[#1C1917] focus:border-[#c9a265] focus:outline-none placeholder:text-[#A8A29E]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
                Unidade Operacional
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-[#F9F9F8] border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-xs text-[#1C1917] focus:border-[#c9a265] focus:outline-none"
              >
                <option value="Matriz Fortaleza">Sede Matriz - Aldeota</option>
                <option value="CD Praia de Iracema">CD Praia de Iracema</option>
                <option value="Fábrica Eusébio">Fábrica & Torrefação Eusébio</option>
                <option value="Porto Mucuripe">Terminal Portuário Mucuripe</option>
                <option value="Hub Messejana">Hub Messejana</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
                Severidade / Criticidade
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full bg-[#F9F9F8] border border-[#E7E5E4] rounded-xl px-3 py-2.5 text-xs text-[#1C1917] focus:border-[#c9a265] focus:outline-none"
              >
                <option value="baixa">Baixa (Informativo)</option>
                <option value="media">Média (Atenção)</option>
                <option value="alta">Alta (Prioritário)</option>
                <option value="critica">Crítica (Intervenção Imediata)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
              Descrição Detalhada dos Fatos *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Descreva as circunstâncias, testemunhas, medidas preventivas adotadas e status atual..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#F9F9F8] border border-[#E7E5E4] rounded-xl px-4 py-2.5 text-xs text-[#1C1917] focus:border-[#c9a265] focus:outline-none placeholder:text-[#A8A29E] resize-none"
            />
          </div>

          <div className="pt-2 border-t border-[#E7E5E4] flex items-center justify-between text-xs text-[#78716C]">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#8c6a38]" />
              <span>Registrado por: <b className="text-[#1C1917]">{formData.officer}</b></span>
            </div>
            <button
              type="button"
              onClick={() => alert('Anexo de foto / evidência selecionado.')}
              className="flex items-center space-x-1 text-[#8c6a38] font-bold hover:underline cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Anexar Evidência</span>
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#E7E5E4]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E7E5E4] text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F3EF] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c9a265] to-[#dfbe85] text-[#1C1917] text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center space-x-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Registrando...' : 'Emitir Ocorrência'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
