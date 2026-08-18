import React, { useState, useMemo } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  Printer,
  LayoutGrid,
  ListFilter,
  Truck,
  User,
  Clock,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  RotateCw,
  Sparkles,
  ArrowRight,
  Shield,
  Edit2,
  Trash2,
  MessageSquarePlus,
} from 'lucide-react';
import {
  PlantaoItem,
  PlantaoStatus,
  PlantaoOperacao,
  STATUS_CONFIG,
  OPERACAO_CONFIG,
  INITIAL_PLANTAO_ITEMS,
} from '../data/plantaoData';
import { PlantaoRecordModal } from '../components/modals/PlantaoRecordModal';
import { AddPlantaoUpdateModal } from '../components/modals/AddPlantaoUpdateModal';

export function Ocorrencias() {
  const [records, setRecords] = useState<PlantaoItem[]>(() => {
    const saved = localStorage.getItem('plantao_records_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading saved plantao records:', e);
      }
    }
    return INITIAL_PLANTAO_ITEMS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<PlantaoStatus | 'all'>('all');
  const [selectedOperacao, setSelectedOperacao] = useState<PlantaoOperacao | 'all'>('all');
  const [selectedTurno, setSelectedTurno] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PlantaoItem | null>(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState<PlantaoItem | null>(null);

  // Sync to local storage
  const saveRecords = (newRecords: PlantaoItem[]) => {
    setRecords(newRecords);
    localStorage.setItem('plantao_records_v2', JSON.stringify(newRecords));
  };

  // Handlers
  const handleSaveRecord = (savedRecord: PlantaoItem) => {
    if (editingRecord) {
      saveRecords(records.map((r) => (r.id === savedRecord.id ? savedRecord : r)));
    } else {
      saveRecords([savedRecord, ...records]);
    }
    setIsRecordModalOpen(false);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de ocorrência?')) {
      saveRecords(records.filter((r) => r.id !== id));
    }
  };

  const handleSaveUpdate = (
    recordId: string,
    updateData: {
      novoTexto: string;
      novoStatus: PlantaoStatus;
      temSubstituicao: boolean;
      placaSubstituta?: string;
      condutorSubstituto?: string;
    }
  ) => {
    saveRecords(
      records.map((r) => {
        if (r.id === recordId) {
          const nowStr = `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
          const existingHistorico = r.atualizacao?.historico || [];
          return {
            ...r,
            status: updateData.novoStatus,
            atualizacao: {
              temSubstituicao: updateData.temSubstituicao,
              placaSubstituta: updateData.placaSubstituta,
              condutorSubstituto: updateData.condutorSubstituto,
              descricaoRetorno: updateData.novoTexto || r.atualizacao?.descricaoRetorno || '',
              historico: [
                ...existingHistorico,
                {
                  dataHora: nowStr,
                  operador: 'Operador CCO',
                  texto: updateData.novoTexto,
                },
              ],
            },
          };
        }
        return r;
      })
    );
    setIsUpdateModalOpen(false);
    setRecordToUpdate(null);
  };

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchSearch =
        item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.operador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.observacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unidadeTransportadora.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.eventualidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descricaoOcorrencia.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchOperacao = selectedOperacao === 'all' || item.operacao === selectedOperacao;
      const matchTurno = selectedTurno === 'all' || item.turno === selectedTurno;

      return matchSearch && matchStatus && matchOperacao && matchTurno;
    });
  }, [records, searchTerm, selectedStatus, selectedOperacao, selectedTurno]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 pb-12 animate-fade-in text-slate-200">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-[#17130e] via-[#10151f] to-[#0c1017] border border-[#c9a265]/35 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,101,0.15),transparent_70%)] pointer-events-none" />

        <div className="flex items-center space-x-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9a265] to-[#8f6826] flex items-center justify-center shadow-lg shadow-[#c9a265]/25 flex-shrink-0">
            <ClipboardList className="w-6 h-6 text-[#140e06] stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl 2xl:text-2xl font-bold text-white tracking-tight font-serif">
                Ocorrências
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#c9a265]/20 border border-[#c9a265]/40 text-[#dfbe85] text-[10.5px] font-bold font-mono uppercase tracking-wider">
                CCO 24H
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              Monitoramento de Ocorrências em Trânsito, Operações e Transição de Turno &bull; Grupo 3corações
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center flex-wrap gap-2.5 z-10">
          <div className="flex items-center rounded-xl bg-[#121824] border border-[#232f45] p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#c9a265] text-[#140e06] font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Lista / Tabela</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#c9a265] text-[#140e06] font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-[#151c28] border border-[#26354d] hover:border-[#c9a265] text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#dfbe85]" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>

          <button
            onClick={() => {
              setEditingRecord(null);
              setIsRecordModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs flex items-center space-x-2 shadow-lg shadow-[#c9a265]/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Novo Registro de Plantão</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#0f141d] border border-[#1e2738] shadow-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por placa, eventualidade, operador..."
              className="w-full pl-9 pr-4 py-2 bg-[#090d14] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Operação Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedOperacao}
              onChange={(e) => setSelectedOperacao(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#090d14] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-semibold text-slate-200 focus:outline-none transition-all"
            >
              <option value="all">Todas as Operações</option>
              <option value="transferencia">Transferência</option>
              <option value="dedicado">Dedicado</option>
              <option value="distribuição risco">Distribuição Risco</option>
              <option value="distribuição geral">Distribuição Geral</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#090d14] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-semibold text-slate-200 focus:outline-none transition-all"
            >
              <option value="all">Todos os Status ({records.length})</option>
              <option value="acompanhar">Acompanhar</option>
              <option value="resolvido">Resolvido</option>
              <option value="para conhecimento">Para Conhecimento</option>
              <option value="atenção">Atenção</option>
              <option value="registrado no grid">Registrado no Grid</option>
            </select>
          </div>

          {/* Turno Filter */}
          <div className="sm:col-span-2">
            <select
              value={selectedTurno}
              onChange={(e) => setSelectedTurno(e.target.value)}
              className="w-full px-3 py-2 bg-[#090d14] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-semibold text-slate-200 focus:outline-none transition-all"
            >
              <option value="all">Todos os Turnos</option>
              <option value="Turno A (06:00 - 18:00)">Turno A</option>
              <option value="Turno B (18:00 - 06:00)">Turno B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List / Table View */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl border border-[#232f45] bg-[#0c1017] shadow-xl overflow-hidden">
          <div className="overflow-x-auto custom-scroll">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#121927] border-b border-[#232f45] text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  <th className="py-3.5 px-4">Data / Hora / Turno</th>
                  <th className="py-3.5 px-4">Operador CCO</th>
                  <th className="py-3.5 px-4">Operação</th>
                  <th className="py-3.5 px-4">Transportadora & Placa</th>
                  <th className="py-3.5 px-4">Eventualidade / Ocorrência</th>
                  <th className="py-3.5 px-4">Atualização & Retorno</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b2535]">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      Nenhuma ocorrência encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((item) => {
                    const statusCfg = STATUS_CONFIG[item.status] || {
                      label: item.status,
                      badgeBg: 'bg-slate-800',
                      badgeText: 'text-slate-200',
                      badgeBorder: 'border-slate-700',
                      dotColor: 'bg-slate-400',
                    };
                    const opCfg = item.operacao ? OPERACAO_CONFIG[item.operacao] : null;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-[#121927]/60 transition-colors group"
                      >
                        {/* Data / Hora / Turno */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <div className="flex items-center space-x-1.5 text-white font-mono font-bold text-xs">
                            <Clock className="w-3 h-3 text-[#dfbe85]" />
                            <span>{item.dataRegistro}</span>
                            <span className="text-[#dfbe85]">{item.horaRegistro}</span>
                          </div>
                          <div className="text-[10.5px] text-slate-400 mt-0.5">
                            {item.turno}
                          </div>
                        </td>

                        {/* Operador CCO */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <div className="flex items-center space-x-1.5 text-slate-200 font-medium">
                            <User className="w-3.5 h-3.5 text-[#c9a265]" />
                            <span className="font-semibold">{item.operador}</span>
                          </div>
                        </td>

                        {/* Operação */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          {opCfg ? (
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold uppercase tracking-wider border ${opCfg.badgeBg} ${opCfg.badgeText} ${opCfg.badgeBorder}`}
                            >
                              {opCfg.label}
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">-</span>
                          )}
                        </td>

                        {/* Transportadora & Placa */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <div className="flex items-center space-x-1.5 font-mono font-bold text-white text-xs">
                            <Truck className="w-3.5 h-3.5 text-[#c9a265]" />
                            <span>{item.placa}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 font-medium">
                            {item.unidadeTransportadora}
                          </div>
                        </td>

                        {/* Eventualidade & Descrição */}
                        <td className="py-3.5 px-4 align-top max-w-xs">
                          <div className="font-bold text-white text-xs">
                            {item.eventualidade}
                          </div>
                          <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                            {item.descricaoOcorrencia}
                          </p>
                        </td>

                        {/* Atualização & Retorno */}
                        <td className="py-3.5 px-4 align-top max-w-xs">
                          {item.atualizacao?.temSubstituicao && (
                            <div className="text-[10px] text-amber-300 font-bold mb-1 flex items-center space-x-1">
                              <span>Placa Sub: {item.atualizacao.placaSubstituta}</span>
                            </div>
                          )}
                          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                            {item.atualizacao?.descricaoRetorno || 'Sem retorno registrado.'}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider border ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.badgeBorder}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
                            <span>{statusCfg.label}</span>
                          </span>
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => {
                                setRecordToUpdate(item);
                                setIsUpdateModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-[#141b28] hover:bg-[#202c42] text-slate-300 hover:text-white border border-[#232f45] transition-all cursor-pointer"
                              title="Adicionar Atualização / Retorno"
                            >
                              <MessageSquarePlus className="w-3.5 h-3.5 text-[#dfbe85]" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingRecord(item);
                                setIsRecordModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-[#141b28] hover:bg-[#202c42] text-slate-300 hover:text-white border border-[#232f45] transition-all cursor-pointer"
                              title="Editar Ocorrência"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(item.id)}
                              className="p-1.5 rounded-lg bg-[#141b28] hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 border border-[#232f45] transition-all cursor-pointer"
                              title="Excluir Ocorrência"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((item) => {
            const statusCfg = STATUS_CONFIG[item.status] || {
              label: item.status,
              badgeBg: 'bg-slate-800',
              badgeText: 'text-slate-200',
              badgeBorder: 'border-slate-700',
              dotColor: 'bg-slate-400',
            };
            const opCfg = item.operacao ? OPERACAO_CONFIG[item.operacao] : null;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-gradient-to-b from-[#151b27] via-[#101520] to-[#0c1017] border border-[#232f45] hover:border-[#c9a265] transition-all shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top line: Data/Hora & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#dfbe85] flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.dataRegistro} {item.horaRegistro}</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.badgeBorder}`}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Operação & Placa */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-mono font-bold text-white text-sm">
                      <Truck className="w-4 h-4 text-[#c9a265]" />
                      <span>{item.placa}</span>
                    </div>
                    {opCfg && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${opCfg.badgeBg} ${opCfg.badgeText} ${opCfg.badgeBorder}`}
                      >
                        {opCfg.label}
                      </span>
                    )}
                  </div>

                  {/* Transportadora & Operador */}
                  <div className="text-xs text-slate-300 flex items-center justify-between">
                    <span>{item.unidadeTransportadora}</span>
                    <span className="text-slate-400 font-medium">Por: {item.operador}</span>
                  </div>

                  {/* Eventualidade & Descrição */}
                  <div className="p-3 rounded-xl bg-[#090d14] border border-[#1e2738] space-y-1">
                    <div className="font-bold text-white text-xs">{item.eventualidade}</div>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {item.descricaoOcorrencia}
                    </p>
                  </div>

                  {/* Retorno */}
                  {item.atualizacao?.descricaoRetorno && (
                    <div className="p-3 rounded-xl bg-[#0c121d] border border-[#223046] space-y-1">
                      <div className="text-[10px] font-bold uppercase text-[#dfbe85] tracking-wider">
                        Atualização / Retorno:
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {item.atualizacao.descricaoRetorno}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-[#1d273a] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setRecordToUpdate(item);
                      setIsUpdateModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#141b28] hover:bg-[#202c42] text-xs font-semibold text-[#dfbe85] flex items-center space-x-1.5 border border-[#232f45] transition-all cursor-pointer"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>+ Retorno</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => {
                        setEditingRecord(item);
                        setIsRecordModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-[#141b28] hover:bg-[#202c42] text-slate-300 hover:text-white border border-[#232f45] transition-all cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRecord(item.id)}
                      className="p-1.5 rounded-lg bg-[#141b28] hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 border border-[#232f45] transition-all cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <PlantaoRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        editingRecord={editingRecord}
      />

      <AddPlantaoUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setRecordToUpdate(null);
        }}
        record={recordToUpdate}
        onSaveUpdate={handleSaveUpdate}
      />
    </div>
  );
}
