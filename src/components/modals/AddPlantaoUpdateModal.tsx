import React, { useState } from 'react';
import { X, ArrowRightLeft, User, CheckCircle2, Truck, PlusCircle } from 'lucide-react';
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

  React.useEffect(() => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#0f141d] border border-[#c9a265]/40 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2838] bg-[#141b27]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#241e15] border border-[#c9a265]/40 flex items-center justify-center text-[#dfbe85]">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">
                Adicionar Atualização / Retorno
              </h3>
              <p className="text-xs text-slate-400">
                Placa: <strong className="text-[#dfbe85]">{record.placa}</strong> &bull; {record.unidadeTransportadora}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a2333] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-[#0c1017]">
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
          <div className="p-3 rounded-xl bg-[#131924] border border-[#1f293b] space-y-2.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
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
                    className="w-full px-3 py-2 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
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
              rows={4}
              value={novoTexto}
              onChange={(e) => setNovoTexto(e.target.value)}
              placeholder="Descreva a nova tratativa, resultado de testes, contato telefônico ou providências adotadas..."
              className="w-full px-3.5 py-2.5 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner leading-relaxed"
              required
              autoFocus
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-[#1a2333] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs rounded-xl shadow-lg shadow-[#c9a265]/20 flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Salvar Atualização</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
