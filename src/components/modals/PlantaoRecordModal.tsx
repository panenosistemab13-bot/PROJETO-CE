import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ClipboardList,
  Building2,
  AlertTriangle,
  FileText,
  CheckCircle2,
  ArrowRightLeft,
  User,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { 
  PlantaoItem, 
  PlantaoStatus, 
  PlantaoOperacao,
  STATUS_CONFIG,
  OPERACAO_OPTIONS,
} from '../../data/plantaoData';
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
  const [operacao, setOperacao] = useState<PlantaoOperacao>('transferencia');
  const [eventualidade, setEventualidade] = useState('');
  const [descricaoOcorrencia, setDescricaoOcorrencia] = useState('');

  // Atualização
  const [temSubstituicao, setTemSubstituicao] = useState(false);
  const [placaSubstituta, setPlacaSubstituta] = useState('');
  const [condutorSubstituto, setCondutorSubstituto] = useState('');
  const [descricaoRetorno, setDescricaoRetorno] = useState('');

  // Status
  const [status, setStatus] = useState<PlantaoStatus>('acompanhar');

  // Zoom scale state (default 85% for compact, perfectly centered fit without any clipping)
  const [modalZoom, setModalZoom] = useState<number>(0.85);

  useEffect(() => {
    if (editingRecord) {
      setObservacao(editingRecord.observacao || '');
      setUnidadeTransportadora(editingRecord.unidadeTransportadora || '');
      setPlaca(editingRecord.placa || '');
      setOperacao(editingRecord.operacao || 'transferencia');
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
      setOperacao('transferencia');
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

  const handleVehiclePlatePicked = (pickedPlate: string, carrier?: string) => {
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
      operacao,
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

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden">
      {/* Modal Container with Dynamic Zoom and Perfect Global Centering */}
      <div 
        style={{
          transform: `scale(${modalZoom})`,
          transformOrigin: 'center center',
        }}
        className="bg-[#0f141d] border-2 border-[#c9a265] rounded-3xl w-full max-w-3xl lg:max-w-4xl shadow-[0_30px_90px_rgba(0,0,0,0.98)] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] transition-transform duration-200 my-auto relative"
      >
        {/* 1. Modal Header (Fixed at Top) */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1f2838] bg-gradient-to-r from-[#141b27] via-[#101622] to-[#0f141d] flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#241e15] border border-[#c9a265]/50 flex items-center justify-center text-[#dfbe85] shadow-md shadow-[#c9a265]/10">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white font-serif tracking-wide">
                {editingRecord ? 'Editar Registro de Plantão' : 'Novo Registro de Plantão'}
              </h3>
              <p className="text-[11px] text-slate-400">
                Lançamento no Livro de Passagem de Turno CCO &bull; Grupo 3corações
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Zoom Controls */}
            <div className="flex items-center space-x-1 bg-[#161f2e] border border-[#243147] rounded-lg p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setModalZoom(prev => Math.max(0.65, Number((prev - 0.05).toFixed(2))))}
                className="p-1 text-slate-400 hover:text-[#dfbe85] transition-colors rounded cursor-pointer"
                title="Diminuir Zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-[#dfbe85] px-1 font-bold">
                {Math.round(modalZoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setModalZoom(prev => Math.min(1.15, Number((prev + 0.05).toFixed(2))))}
                className="p-1 text-slate-400 hover:text-[#dfbe85] transition-colors rounded cursor-pointer"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setModalZoom(0.85)}
                className="p-1 text-slate-400 hover:text-white transition-colors rounded cursor-pointer"
                title="Resetar Zoom Padrão (85%)"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1a2333] transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Modal Body Form (Scrollable Area) */}
        <form onSubmit={handleSubmit} id="plantao-modal-form" className="p-4 sm:p-5 overflow-y-auto custom-scroll flex-1 space-y-4 bg-[#0c1017]">
          {/* Top Row: Status Selector */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#131924] border border-[#1f293b]">
            <label className="text-[11px] font-bold text-[#dfbe85] uppercase tracking-wider block mb-2">
              Status da Ocorrência
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 sm:gap-2">
              {(Object.keys(STATUS_CONFIG) as PlantaoStatus[]).map((st) => {
                const conf = STATUS_CONFIG[st];
                const isSelected = status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`px-2.5 py-1.5 sm:py-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
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
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-[#c9a265]" />
              <span>Coluna 1: Observação Geral</span>
            </label>
            <textarea
              rows={2}
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Digite observações complementares, avisos para o próximo operador ou notas rápidas..."
              className="w-full px-3 py-2 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner leading-relaxed"
            />
          </div>

          {/* Section 2: Ocorrência */}
          <div className="p-3 sm:p-4 rounded-xl bg-[#131924] border border-[#1f293b] space-y-3">
            <div className="flex items-center space-x-2 pb-1.5 border-b border-[#222d42]">
              <AlertTriangle className="w-4 h-4 text-[#c9a265]" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Coluna 2: Detalhes da Ocorrência
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Placa do Veículo (Searchable from Veículos page) */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
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
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  Unidade / Transportadora
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
                  <input
                    type="text"
                    value={unidadeTransportadora}
                    onChange={(e) => setUnidadeTransportadora(e.target.value)}
                    placeholder="Ex: Ledifran, 3C Eusébio, Argus..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Operação (Menu Suspenso) */}
              <div>
                <label className="text-[10.5px] font-bold text-[#dfbe85] block mb-1">
                  Operação *
                </label>
                <div className="relative">
                  <select
                    value={operacao}
                    onChange={(e) => setOperacao(e.target.value as PlantaoOperacao)}
                    className="w-full appearance-none pl-3 pr-8 py-1.5 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white focus:outline-none transition-all shadow-inner cursor-pointer font-medium"
                  >
                    {OPERACAO_OPTIONS.map((op) => (
                      <option key={op.value} value={op.value} className="bg-[#121824] text-white py-1">
                        {op.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#c9a265] absolute right-2.5 top-2 pointer-events-none" />
                </div>
              </div>

              {/* Eventualidade */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  Eventualidade
                </label>
                <input
                  type="text"
                  value={eventualidade}
                  onChange={(e) => setEventualidade(e.target.value)}
                  placeholder="Ex: Problema mecânico | troca de cavalo..."
                  className="w-full px-3 py-1.5 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Quick Sugestões de Eventualidade */}
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Sugestões rápidas:</span>
              <div className="flex flex-wrap gap-1">
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
              <label className="text-[10.5px] font-bold text-slate-300 block">
                Descrição Completa da Ocorrência *
              </label>
              <textarea
                rows={3}
                value={descricaoOcorrencia}
                onChange={(e) => setDescricaoOcorrencia(e.target.value)}
                placeholder="Descreva detalhadamente o evento, contato com motorista (WhatsApp/Telefone), relatos, local da parada, medidas tomadas..."
                className="w-full px-3 py-2 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Section 3: Atualização / Retorno */}
          <div className="p-3 sm:p-4 rounded-xl bg-[#131924] border border-[#1f293b] space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#222d42]">
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
                <span className="text-[10.5px] font-semibold text-[#dfbe85]">
                  Houve substituição de veículo / condutor?
                </span>
              </label>
            </div>

            {/* Substitution details (if checked) */}
            {temSubstituicao && (
              <div className="p-2.5 rounded-xl bg-[#182233] border border-[#2d3d57] grid grid-cols-1 sm:grid-cols-2 gap-2.5 animate-in fade-in duration-150">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">
                    Placa Substituta (Busca no catálogo)
                  </label>
                  <VehiclePlateSelect
                    value={placaSubstituta}
                    onChange={handleSubstitutaPlatePicked}
                    placeholder="Ex: TYZ7I60..."
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">
                    Condutor Substituto
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
                    <input
                      type="text"
                      value={condutorSubstituto}
                      onChange={(e) => setCondutorSubstituto(e.target.value)}
                      placeholder="Ex: Cleidinaldo do Nascimento Pereira..."
                      className="w-full pl-8 pr-3 py-1.5 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Descrição do Retorno */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-slate-300 block">
                Parecer / Despacho / Retorno da Central
              </label>
              <textarea
                rows={2}
                value={descricaoRetorno}
                onChange={(e) => setDescricaoRetorno(e.target.value)}
                placeholder="Informe status do checklist, testes Autotrac/Omnilink, contato noturno, previsão de liberação ou tratativas com a transportadora..."
                className="w-full px-3 py-2 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner leading-relaxed"
              />
            </div>
          </div>
        </form>

        {/* 3. Modal Footer Action Bar (Fixed at Bottom - NEVER Cut Off) */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#1f2838] bg-[#0f141d] flex-shrink-0">
          <div className="text-[11px] text-slate-400 hidden sm:block">
            * Campos obrigatórios para lançamento no histórico do CCO
          </div>

          <div className="flex items-center space-x-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-[#1a2333] transition-colors cursor-pointer border border-transparent hover:border-[#243147]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="plantao-modal-form"
              className="px-5 py-2 bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs rounded-xl shadow-lg shadow-[#c9a265]/20 flex items-center space-x-2 transition-all cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>{editingRecord ? 'Salvar Alterações' : 'Cadastrar no Plantão'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
