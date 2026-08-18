import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, PlusCircle } from 'lucide-react';
import { PlantaoItem, PlantaoStatus, STATUS_CONFIG } from '../../data/plantaoData';
import { VehiclePlateSelect } from '../VehiclePlateSelect';

interface AddPlantaoUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PlantaoItem | null;
  onSaveUpdate: (recordId: string, updateData: {
    novoTexto: string;
    novoStatus: PlantaoStatus;
    temSubstituicao: boolean;
    placaSubstituta?: string;
    condutorSubstituto?: string;
  }) => void;
}

export function AddPlantaoUpdateModal({
  isOpen,
  onClose,
  record,
  onSaveUpdate,
}: AddPlantaoUpdateModalProps) {
  const [novoTexto, setNovoTexto] = useState('');
  const [novoStatus, setNovoStatus] = useState<PlantaoStatus>('acompanhar');
  const [temSubstituicao, setTemSubstituicao] = useState(false);
  const [placaSubstituta, setPlacaSubstituta] = useState('');
  const [condutorSubstituto, setCondutorSubstituto] = useState('');

  useEffect(() => {
    if (record) {
      setNovoStatus(record.status);
      setTemSubstituicao(!!record.atualizacao?.temSubstituicao);
      setPlacaSubstituta(record.atualizacao?.placaSubstituta || '');
      setCondutorSubstituto(record.atualizacao?.condutorSubstituto || '');
      setNovoTexto('');
    }
  }, [record, isOpen]);

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoTexto.trim()) {
      alert('Por favor, digite o parecer ou atualização.');
      return;
    }

    onSaveUpdate(record.id, {
      novoTexto: novoTexto.trim(),
      novoStatus,
      temSubstituicao,
      placaSubstituta: temSubstituicao ? placaSubstituta.toUpperCase().trim() : undefined,
      condutorSubstituto: temSubstituicao ? condutorSubstituto.trim() : undefined,
    });
    onClose();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden">
      <div className="bg-[#0f141d] border-2 border-[#c9a265] rounded-3xl w-full max-w-xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] my-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1f2838] bg-gradient-to-r from-[#141b27] via-[#101622] to-[#0f141d] flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#241e15] border border-[#c9a265]/50 flex items-center justify-center text-[#dfbe85]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">
                Adicionar Atualização / Retorno
              </h3>
              <p className="text-[11px] text-slate-400">
                Placa: <strong className="text-[#dfbe85]">{record.placa}</strong> &bull; {record.unidadeTransportadora}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a2333] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} id="update-modal-form" className="p-4 sm:p-5 space-y-3.5 bg-[#0c1017] overflow-y-auto custom-scroll flex-1">
          {/* Status updater */}
          <div>
            <label className="text-[11px] font-bold text-[#dfbe85] uppercase tracking-wider block mb-1.5">
              Atualizar Status
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(Object.keys(STATUS_CONFIG) as PlantaoStatus[]).map((st) => {
                const conf = STATUS_CONFIG[st];
                const isSelected = novoStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setNovoStatus(st)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? `${conf.badgeBg} ${conf.badgeText} border-[#c9a265] shadow-xs`
                        : 'bg-[#182030] text-slate-400 border-[#222d42] hover:bg-[#1f2a40]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${conf.dotColor}`} />
                    <span className="capitalize">{st}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Substitution toggle */}
          <div className="p-3 rounded-xl bg-[#131924] border border-[#1f293b] space-y-2">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={temSubstituicao}
                onChange={(e) => setTemSubstituicao(e.target.checked)}
                className="rounded border-[#2a374f] text-[#c9a265] focus:ring-0 cursor-pointer"
              />
              <span className="text-[11px] font-semibold text-[#dfbe85]">
                Atualizar dados de substituição (Placa / Condutor)
              </span>
            </label>

            {temSubstituicao && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 animate-in fade-in duration-150">
                <div>
                  <label className="text-[10px] text-slate-300 font-bold block mb-1">
                    Placa Substituta
                  </label>
                  <VehiclePlateSelect
                    value={placaSubstituta}
                    onChange={(p) => setPlacaSubstituta(p)}
                    placeholder="Ex: TYZ7I60..."
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-300 font-bold block mb-1">
                    Condutor Substituto
                  </label>
                  <input
                    type="text"
                    value={condutorSubstituto}
                    onChange={(e) => setCondutorSubstituto(e.target.value)}
                    placeholder="Nome do condutor..."
                    className="w-full px-3 py-1.5 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* New text */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300 block">
              Novo Parecer / Atualização Operacional *
            </label>
            <textarea
              rows={3}
              value={novoTexto}
              onChange={(e) => setNovoTexto(e.target.value)}
              placeholder="Descreva a nova tratativa, resultado de testes, contato telefônico ou providências adotadas..."
              className="w-full px-3 py-2 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner leading-relaxed"
              required
              autoFocus
            />
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="flex items-center justify-end space-x-2 px-5 py-3 border-t border-[#1f2838] bg-[#0f141d] flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-[#1a2333] transition-colors cursor-pointer border border-transparent hover:border-[#243147]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="update-modal-form"
            className="px-5 py-2 bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs rounded-xl shadow-lg shadow-[#c9a265]/20 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Salvar Atualização</span>
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
