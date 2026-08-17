import React, { useState, useEffect } from 'react';
import {
  X,
  ClipboardList,
  Truck,
  Building2,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ArrowRightLeft,
  User,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PlantaoItem, PlantaoStatus, STATUS_CONFIG } from '../../data/plantaoData';
import { VehiclePlateSelect } from '../VehiclePlateSelect';

interface PlantaoRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: PlantaoItem) => void;
  editingRecord?: PlantaoItem | null;
}

const COMMON_EVENTUALIDADES = [
  'Problema mecânico | troca de cavalo',
  'Alarme de violação de sensor / baú',
  'Desvio de rota em trecho rodoviário',
  'Cadastro de SM e Espelhamento Grid',
  'Informativo operacional / Troca de chaves de armazém',
  'Atraso na entrega / parada prolongada',
  'Troca de motorista / alteração de escala',
  'Sinistro rodoviário / avaria de carga',
];

export function PlantaoRecordModal({
  isOpen,
  onClose,
  onSave,
  editingRecord,
}: PlantaoRecordModalProps) {
  const [observacao, setObservacao] = useState('');
  const [unidadeTransportadora, setUnidadeTransportadora] = useState('');
  const [placa, setPlaca] = useState('');
  const [eventualidade, setEventualidade] = useState('');
  const [descricaoOcorrencia, setDescricaoOcorrencia] = useState('');

  // Atualização
  const [temSubstituicao, setTemSubstituicao] = useState(false);
  const [placaSubstituta, setPlacaSubstituta] = useState('');
  const [condutorSubstituto, setCondutorSubstituto] = useState('');
  const [descricaoRetorno, setDescricaoRetorno] = useState('');

  // Status
  const [status, setStatus] = useState<PlantaoStatus>('acompanhar');

  useEffect(() => {
    if (editingRecord) {
      setObservacao(editingRecord.observacao || '');
      setUnidadeTransportadora(editingRecord.unidadeTransportadora || '');
      setPlaca(editingRecord.placa || '');
      setEventualidade(editingRecord.eventualidade || '');
      setDescricaoOcorrencia(editingRecord.descricaoOcorrencia || '');

      setTemSubstituicao(!!editingRecord.atualizacao?.temSubstituicao);
      setPlacaSubstituta(editingRecord.atualizacao?.placaSubstituta || '');
      setCondutorSubstituto(editingRecord.atualizacao?.condutorSubstituto || '');
      setDescricaoRetorno(editingRecord.atualizacao?.descricaoRetorno || '');

      setStatus(editingRecord.status || 'acompanhar');
    } else {
      // Reset defaults
      setObservacao('');
      setUnidadeTransportadora('');
      setPlaca('');
      setEventualidade('');
      setDescricaoOcorrencia('');
      setTemSubstituicao(false);
      setPlacaSubstituta('');
      setCondutorSubstituto('');
      setDescricaoRetorno('');
      setStatus('acompanhar');
    }
  }, [editingRecord, isOpen]);

  if (!isOpen) return null;

  const handleVehiclePlatePicked = (pickedPlate: string, carrier?: string, fleet?: string) => {
    setPlaca(pickedPlate);
    if (carrier && !unidadeTransportadora) {
      setUnidadeTransportadora(carrier);
    }
  };

  const handleSubstitutaPlatePicked = (pickedPlate: string) => {
    setPlacaSubstituta(pickedPlate);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricaoOcorrencia.trim() && !eventualidade.trim() && !placa.trim()) {
      alert('Por favor, preencha as informações básicas da ocorrência.');
      return;
    }

    const now = new Date();
    const dateStr = editingRecord?.dataRegistro || now.toLocaleDateString('pt-BR');
    const timeStr = editingRecord?.horaRegistro || now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const updatedRecord: PlantaoItem = {
      id: editingRecord ? editingRecord.id : `plantao-${Date.now()}`,
      dataRegistro: dateStr,
      horaRegistro: timeStr,
      turno: editingRecord?.turno || 'Turno A (06:00 - 18:00)',
      operador: editingRecord?.operador || 'Operador CCO',
      observacao: observacao.trim(),
      unidadeTransportadora: unidadeTransportadora.trim() || 'Logística 3C',
      placa: placa.toUpperCase().trim(),
      eventualidade: eventualidade.trim() || 'Ocorrência Operacional',
      descricaoOcorrencia: descricaoOcorrencia.trim(),
      atualizacao: {
        temSubstituicao,
        placaSubstituta: temSubstituicao ? placaSubstituta.toUpperCase().trim() : undefined,
        condutorSubstituto: temSubstituicao ? condutorSubstituto.trim() : undefined,
        descricaoRetorno: descricaoRetorno.trim(),
        historico: editingRecord?.atualizacao?.historico || [],
      },
      status,
    };

    onSave(updatedRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#0f141d] border border-[#c9a265]/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2838] bg-gradient-to-r from-[#141b27] to-[#0f141d]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#241e15] border border-[#c9a265]/40 flex items-center justify-center text-[#dfbe85]">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                {editingRecord ? 'Editar Registro de Plantão' : 'Novo Registro de Plantão'}
              </h3>
              <p className="text-xs text-slate-400">
                Lançamento no Livro de Passagem de Turno CCO &bull; Café Três Corações
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

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scroll flex-1 space-y-6 bg-[#0c1017]">
          {/* Top Row: Status Selector */}
          <div className="p-4 rounded-xl bg-[#131924] border border-[#1f293b]">
            <label className="text-xs font-bold text-[#dfbe85] uppercase tracking-wider block mb-2.5">
              Status da Ocorrência
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {(Object.keys(STATUS_CONFIG) as PlantaoStatus[]).map((st) => {
                const conf = STATUS_CONFIG[st];
                const isSelected = status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      isSelected
                        ? `${conf.badgeBg} ${conf.badgeText} border-[#c9a265] shadow-md shadow-[#c9a265]/10 scale-[1.02]`
                        : 'bg-[#182030] text-slate-400 border-[#222d42] hover:bg-[#1f2a40] hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${conf.dotColor}`} />
                    <span className="capitalize">{st}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 1: Observação */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-[#c9a265]" />
              <span>Coluna 1: Observação Geral</span>
            </label>
            <textarea
              rows={2}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Digite observações complementares, avisos para o próximo operador ou notas rápidas..."
              className="w-full px-3.5 py-2.5 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner leading-relaxed"
            />
          </div>

          {/* Section 2: Ocorrência */}
          <div className="p-4 rounded-xl bg-[#131924] border border-[#1f293b] space-y-4">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#222d42]">
              <AlertTriangle className="w-4 h-4 text-[#c9a265]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Coluna 2: Detalhes da Ocorrência
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Placa do Veículo (Searchable from Veículos page) */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Placa do Veículo (Busca na Base) *
                </label>
                <VehiclePlateSelect
                  value={placa}
                  onChange={handleVehiclePlatePicked}
                  placeholder="Ex: RUC3E30, TYZ7I60..."
                />
              </div>

              {/* Unidade / Transportadora */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Unidade / Transportadora
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={unidadeTransportadora}
                    onChange={(e) => setUnidadeTransportadora(e.target.value)}
                    placeholder="Ex: Ledifran, 3C Eusébio, Argus..."
                    className="w-full pl-9 pr-3 py-2 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Eventualidade */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Eventualidade
                </label>
                <input
                  type="text"
                  value={eventualidade}
                  onChange={(e) => setEventualidade(e.target.value)}
                  placeholder="Ex: Problema mecânico | troca de cavalo..."
                  className="w-full px-3 py-2 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Quick Sugestões de Eventualidade */}
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Sugestões rápidas:</span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_EVENTUALIDADES.map((ev) => (
                  <button
                    key={ev}
                    type="button"
                    onClick={() => setEventualidade(ev)}
                    className="px-2 py-0.5 rounded-lg bg-[#182030] hover:bg-[#202c42] border border-[#243147] text-[10px] text-slate-300 hover:text-[#dfbe85] transition-colors cursor-pointer"
                  >
                    {ev}
                  </button>
                ))}
              </div>
            </div>

            {/* Descrição Detalhada da Ocorrência */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">
                Descrição Completa da Ocorrência *
              </label>
              <textarea
                rows={4}
                value={descricaoOcorrencia}
                onChange={(e) => setDescricaoOcorrencia(e.target.value)}
                placeholder="Descreva detalhadamente o evento, contato com motorista (WhatsApp/Telefone), relatos, local da parada, medidas tomadas..."
                className="w-full px-3.5 py-2.5 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Section 3: Atualização / Retorno */}
          <div className="p-4 rounded-xl bg-[#131924] border border-[#1f293b] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#222d42]">
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="w-4 h-4 text-[#c9a265]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Coluna 3: Atualização / Retorno
                </h4>
              </div>

              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={temSubstituicao}
                  onChange={(e) => setTemSubstituicao(e.target.checked)}
                  className="rounded border-[#2a374f] text-[#c9a265] focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px] font-semibold text-[#dfbe85]">
                  Houve substituição de veículo / condutor?
                </span>
              </label>
            </div>

            {/* Substitution details (if checked) */}
            {temSubstituicao && (
              <div className="p-3 rounded-xl bg-[#182233] border border-[#2d3d57] grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                    Placa Substituta (Busca no catálogo)
                  </label>
                  <VehiclePlateSelect
                    value={placaSubstituta}
                    onChange={handleSubstitutaPlatePicked}
                    placeholder="Ex: TYZ7I60..."
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                    Condutor Substituto
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={condutorSubstituto}
                      onChange={(e) => setCondutorSubstituto(e.target.value)}
                      placeholder="Ex: Cleidinaldo do Nascimento Pereira..."
                      className="w-full pl-9 pr-3 py-2 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Descrição do Retorno */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">
                Parecer / Despacho / Retorno da Central
              </label>
              <textarea
                rows={3}
                value={descricaoRetorno}
                onChange={(e) => setDescricaoRetorno(e.target.value)}
                placeholder="Informe status do checklist, testes Autotrac/Omnilink, contato noturno, previsão de liberação ou tratativas com a transportadora..."
                className="w-full px-3.5 py-2.5 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner leading-relaxed"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-[#1a2333] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs rounded-xl shadow-lg shadow-[#c9a265]/20 flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingRecord ? 'Salvar Alterações' : 'Cadastrar no Plantão'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
