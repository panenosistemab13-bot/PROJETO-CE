import React, { useState, useMemo, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  Building2,
  User,
  ArrowRightLeft,
  ChevronDown,
  Pencil,
  Trash2,
  PlusCircle,
  Copy,
  Download,
  Share2,
  Sparkles,
  Layers,
  RotateCcw,
  Check,
  Calendar,
  FileText,
  Eye,
  EyeOff,
  Compass,
  Maximize2,
  Shield,
  Radio,
} from 'lucide-react';
import {
  PlantaoItem,
  PlantaoStatus,
  STATUS_CONFIG,
  INITIAL_PLANTAO_ITEMS,
} from '../data/plantaoData';
import { PlantaoRecordModal } from '../components/modals/PlantaoRecordModal';
import { AddPlantaoUpdateModal } from '../components/modals/AddPlantaoUpdateModal';
import { ThreePanorama } from '../components/ThreePanorama';
import { LateralGoldScrollbar } from '../components/LateralGoldScrollbar';
import bgPlantao360 from '../assets/images/cco_plantao_360_1786994085712.jpg';

const LOCAL_STORAGE_KEY = 'cco_passagem_plantao_data_v1';

export function PassagemPlantao() {
  const [items, setItems] = useState<PlantaoItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading plantao items:', e);
    }
    return INITIAL_PLANTAO_ITEMS;
  });

  // 360-degree wallpaper immersive toggle
  const [hideContent, setHideContent] = useState(false);

  // Save to local storage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving plantao items:', e);
    }
  }, [items]);

  // Filtering states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  
  // Modals state
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PlantaoItem | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [targetUpdateRecord, setTargetUpdateRecord] = useState<PlantaoItem | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Status statistics
  const statusStats = useMemo(() => {
    const stats: Record<string, number> = {
      total: items.length,
      acompanhar: 0,
      resolvido: 0,
      'para conhecimento': 0,
      atenção: 0,
      'registrado no grid': 0,
    };

    items.forEach((item) => {
      if (stats[item.status] !== undefined) {
        stats[item.status]++;
      }
    });

    return stats;
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesStatus =
        selectedStatusTab === 'all' || item.status === selectedStatusTab;

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchesStatus;

      const matchesSearch =
        item.placa.toLowerCase().includes(term) ||
        item.unidadeTransportadora.toLowerCase().includes(term) ||
        item.eventualidade.toLowerCase().includes(term) ||
        item.descricaoOcorrencia.toLowerCase().includes(term) ||
        item.observacao.toLowerCase().includes(term) ||
        (item.atualizacao?.descricaoRetorno || '').toLowerCase().includes(term) ||
        (item.atualizacao?.placaSubstituta || '').toLowerCase().includes(term) ||
        (item.atualizacao?.condutorSubstituto || '').toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [items, selectedStatusTab, searchTerm]);

  // Handler: Change Status directly in the row dropdown
  const handleStatusChange = (itemId: string, newStatus: PlantaoStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
    );
  };

  // Handler: Save (Create or Edit) Record
  const handleSaveRecord = (record: PlantaoItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === record.id);
      if (exists) {
        return prev.map((i) => (i.id === record.id ? record : i));
      }
      return [record, ...prev];
    });
  };

  // Handler: Delete Record
  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este registro da passagem de plantão?')) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  // Handler: Add Update to a record
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
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== recordId) return item;

        const currentHistorico = item.atualizacao?.historico || [];
        const newEntry = {
          dataHora: `${dateStr} ${timeStr}`,
          operador: 'Operador CCO',
          texto: updateData.novoTexto,
        };

        const existingDescricao = item.atualizacao?.descricaoRetorno || '';
        const combinedDescricao = existingDescricao
          ? `${existingDescricao}\n\n[${dateStr} ${timeStr} - CCO]: ${updateData.novoTexto}`
          : updateData.novoTexto;

        return {
          ...item,
          status: updateData.novoStatus,
          atualizacao: {
            ...item.atualizacao,
            temSubstituicao: updateData.temSubstituicao,
            placaSubstituta: updateData.temSubstituicao
              ? updateData.placaSubstituta
              : item.atualizacao?.placaSubstituta,
            condutorSubstituto: updateData.temSubstituicao
              ? updateData.condutorSubstituto
              : item.atualizacao?.condutorSubstituto,
            descricaoRetorno: combinedDescricao,
            historico: [...currentHistorico, newEntry],
          },
        };
      })
    );
  };

  // Reset to initial demo data
  const handleResetData = () => {
    if (window.confirm('Deseja restaurar os dados padrão de homologação da passagem de plantão?')) {
      setItems(INITIAL_PLANTAO_ITEMS);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PLANTAO_ITEMS));
    }
  };

  // Copy structured Shift Handover report to clipboard
  const handleCopyReport = () => {
    const lines = [
      '========================================',
      '📋 PASSAGEM DE PLANTÃO CCO - CAFÉ 3 CORAÇÕES',
      `Data: ${new Date().toLocaleDateString('pt-BR')} | Hora: ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      '========================================\n',
    ];

    items.forEach((item, idx) => {
      lines.push(`[REGISTRO #${idx + 1}]`);
      lines.push(`Status: [${item.status.toUpperCase()}]`);
      lines.push(`Placa: ${item.placa} | Unidade/Transportadora: ${item.unidadeTransportadora}`);
      lines.push(`Eventualidade: ${item.eventualidade}`);
      lines.push(`Observação: ${item.observacao || 'N/A'}`);
      lines.push('--- Ocorrência ---');
      lines.push(item.descricaoOcorrencia);
      lines.push('--- Atualização / Retorno ---');
      if (item.atualizacao?.temSubstituicao) {
        lines.push(`Substituição: Placa ${item.atualizacao.placaSubstituta} | Condutor: ${item.atualizacao.condutorSubstituto}`);
      }
      lines.push(item.atualizacao?.descricaoRetorno || 'Nenhuma atualização');
      lines.push('\n----------------------------------------\n');
    });

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="max-w-[2560px] mx-auto flex flex-col gap-5 relative z-10 select-none pb-16">
      {/* Lateral Golden Scrollbar matching the Veiculos and Colaboradores pages */}
      <LateralGoldScrollbar />

      {/* 3D 360-Degree Panoramic Interactive Background (Centro de Controle de Operações - Grupo 3corações) */}
      <ThreePanorama imageUrl={bgPlantao360} interactive={hideContent} />

      {/* Backdrop vignette without blurring the 3D panorama */}
      <div
        className={`fixed inset-0 z-[-1] pointer-events-none bg-gradient-to-t from-[#070a0f]/60 via-transparent to-[#070a0f]/40 transition-all duration-700 ${
          hideContent ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(201,162,101,0.03),transparent_90%)]" />

      {/* External 3D Hooks for Three.js / Spline Integrations */}
      <div id="3d-plantao-container" className="fixed right-0 top-0 bottom-0 w-1/4 pointer-events-none z-0" />
      <div id="3d-radar-container" className="fixed left-0 bottom-0 w-1/6 pointer-events-none z-0" />

      {/* Floating 360 Exploration Bar when in immersive mode */}
      {hideContent && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#0c1017]/95 border border-[#c9a265]/70 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-9 h-9 rounded-xl bg-[#c9a265]/20 border border-[#c9a265]/40 flex items-center justify-center text-[#dfbe85]">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div className="text-left pr-3">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 font-serif">
              <span>CCO 24h &bull; Centro de Operações 360° Full HD</span>
            </div>
            <p className="text-[11px] text-[#dfbe85]">
              Arraste com o mouse para explorar o ambiente 3D em 360 graus
            </p>
          </div>
          <button
            onClick={() => setHideContent(false)}
            className="px-4 py-2 bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs rounded-xl shadow-lg shadow-[#c9a265]/25 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Voltar ao Painel</span>
          </button>
        </div>
      )}

      {/* 1. TOP HEADER & SHIFT BANNER */}
      <div
        className={`bg-[#0c1017]/90 border border-[#1e2738]/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden transition-all duration-500 ${
          hideContent ? 'opacity-0 scale-95 pointer-events-none -translate-y-4' : ''
        }`}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-32 bg-[#c9a265]/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#292218] via-[#1a150e] to-[#0c1017] border border-[#c9a265]/50 flex items-center justify-center text-[#dfbe85] shadow-lg shadow-[#c9a265]/10 flex-shrink-0">
              <ClipboardList className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl 2xl:text-2xl font-bold text-white tracking-tight font-serif">
                  Passagem de Plantão
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#c9a265]/20 border border-[#c9a265]/40 text-[#dfbe85] text-[10.5px] font-bold font-mono uppercase tracking-wider">
                  CCO 24H
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Quadro Integrado de Transição de Turno, Ocorrências em Trânsito & Atualizações &bull; Grupo 3corações
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 360 View Toggle Button */}
            <button
              onClick={() => setHideContent(!hideContent)}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-black/70 hover:bg-black/95 border border-[#c9a265]/60 hover:border-[#c9a265] text-[#dfbe85] hover:text-white transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer active:scale-95 text-xs font-bold uppercase tracking-wider"
              title="Alternar para visualização 360° em tela cheia"
            >
              {hideContent ? (
                <>
                  <Eye className="w-4 h-4 text-[#c9a265] animate-pulse" />
                  <span>Mostrar Painel</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4 text-[#c9a265]" />
                  <span>Ver Apenas 360°</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 rounded-xl bg-[#151c2a]/90 hover:bg-[#1e283c] border border-[#243147] text-slate-200 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer shadow-md"
              title="Copiar relatório formatado para WhatsApp ou e-mail"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#c9a265]" />
                  <span>Copiar Resumo</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetData}
              className="p-2 rounded-xl bg-[#151c2a]/90 hover:bg-[#1e283c] border border-[#243147] text-slate-400 hover:text-slate-200 text-xs transition-all cursor-pointer shadow-md"
              title="Restaurar dados de demonstração"
            >
              <RotateCcw className="w-4 h-4" />
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

        {/* 2. STATS & STATUS PILLS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5 pt-4 border-t border-[#1b2333]">
          {/* Total */}
          <button
            onClick={() => setSelectedStatusTab('all')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md ${
              selectedStatusTab === 'all'
                ? 'bg-[#1b2536]/90 border-[#c9a265] shadow-sm'
                : 'bg-[#111722]/80 border-[#1c2433] hover:bg-[#151c2a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Total Registros
              </span>
              <Layers className="w-3.5 h-3.5 text-[#c9a265]" />
            </div>
            <div className="text-lg font-bold text-white font-mono mt-1">
              {String(statusStats.total).padStart(2, '0')}
            </div>
          </button>

          {/* Acompanhar */}
          <button
            onClick={() => setSelectedStatusTab('acompanhar')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md ${
              selectedStatusTab === 'acompanhar'
                ? 'bg-blue-500/25 border-blue-400 shadow-sm'
                : 'bg-[#111722]/80 border-[#1c2433] hover:bg-[#151c2a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">
                Acompanhar
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <div className="text-lg font-bold text-blue-300 font-mono mt-1">
              {String(statusStats.acompanhar).padStart(2, '0')}
            </div>
          </button>

          {/* Atenção */}
          <button
            onClick={() => setSelectedStatusTab('atenção')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md ${
              selectedStatusTab === 'atenção'
                ? 'bg-amber-500/25 border-amber-400 shadow-sm'
                : 'bg-[#111722]/80 border-[#1c2433] hover:bg-[#151c2a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
                Atenção
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div className="text-lg font-bold text-amber-300 font-mono mt-1">
              {String(statusStats['atenção']).padStart(2, '0')}
            </div>
          </button>

          {/* Registrado no Grid */}
          <button
            onClick={() => setSelectedStatusTab('registrado no grid')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md ${
              selectedStatusTab === 'registrado no grid'
                ? 'bg-purple-500/25 border-purple-400 shadow-sm'
                : 'bg-[#111722]/80 border-[#1c2433] hover:bg-[#151c2a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">
                No Grid
              </span>
              <span className="w-2 h-2 rounded-full bg-purple-400" />
            </div>
            <div className="text-lg font-bold text-purple-200 font-mono mt-1">
              {String(statusStats['registrado no grid']).padStart(2, '0')}
            </div>
          </button>

          {/* Para Conhecimento */}
          <button
            onClick={() => setSelectedStatusTab('para conhecimento')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md ${
              selectedStatusTab === 'para conhecimento'
                ? 'bg-slate-500/25 border-slate-300 shadow-sm'
                : 'bg-[#111722]/80 border-[#1c2433] hover:bg-[#151c2a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Conhecimento
              </span>
              <span className="w-2 h-2 rounded-full bg-slate-400" />
            </div>
            <div className="text-lg font-bold text-slate-300 font-mono mt-1">
              {String(statusStats['para conhecimento']).padStart(2, '0')}
            </div>
          </button>

          {/* Resolvido */}
          <button
            onClick={() => setSelectedStatusTab('resolvido')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md ${
              selectedStatusTab === 'resolvido'
                ? 'bg-emerald-500/25 border-emerald-400 shadow-sm'
                : 'bg-[#111722]/80 border-[#1c2433] hover:bg-[#151c2a]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                Resolvido
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-300 font-mono mt-1">
              {String(statusStats.resolvido).padStart(2, '0')}
            </div>
          </button>
        </div>
      </div>

      {/* 3. SEARCH & QUICK FILTER TOOLBAR */}
      <div
        className={`flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0c1017]/90 border border-[#1e2738]/90 rounded-xl p-3 shadow-xl backdrop-blur-xl transition-all duration-500 ${
          hideContent ? 'opacity-0 scale-95 pointer-events-none -translate-y-4' : ''
        }`}
      >
        {/* Search input */}
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#c9a265] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por placa, transportadora, condutor, eventualidade ou texto da ocorrência..."
            className="w-full pl-9 pr-4 py-2 bg-[#121824]/90 border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* Filter Count tag */}
        <div className="flex items-center space-x-2 text-xs text-slate-400 flex-shrink-0">
          <span>Exibindo:</span>
          <strong className="text-[#dfbe85] font-mono">{filteredItems.length}</strong>
          <span>de {items.length} registros</span>
        </div>
      </div>

      {/* 4. MAIN PASSAGEM DE PLANTÃO TABLE (MATCHING THE ATTACHED IMAGE) */}
      <div
        className={`bg-[#0c1017]/90 border border-[#243147]/90 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden transition-all duration-500 ${
          hideContent ? 'opacity-0 scale-95 pointer-events-none -translate-y-4' : ''
        }`}
      >
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            {/* Table Header matching the Blue-Steel tone from user's attached image */}
            <thead>
              <tr className="bg-[#2d435f]/95 backdrop-blur-md text-slate-100 border-b border-[#1c2c42] select-none text-center">
                {/* 1. Observação */}
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider w-[20%] border-r border-[#3e5677] text-white">
                  Observação
                </th>

                {/* 2. Ocorrência */}
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider w-[35%] border-r border-[#3e5677] text-white">
                  Ocorrência
                </th>

                {/* 3. Atualização/Retorno */}
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider w-[30%] border-r border-[#3e5677] text-white">
                  Atualização/Retorno
                </th>

                {/* 4. Status */}
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider w-[15%] text-white">
                  Status
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-[#1e2738]/80 bg-[#0c1017]/80 backdrop-blur-md">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <ClipboardList className="w-10 h-10 text-slate-600" />
                      <p className="text-sm font-semibold text-slate-300">
                        Nenhum registro de plantão encontrado para este filtro.
                      </p>
                      <p className="text-xs text-slate-500">
                        Clique em "+ Novo Registro de Plantão" para adicionar uma nova ocorrência.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => {
                  const statusConf = STATUS_CONFIG[item.status] || STATUS_CONFIG['acompanhar'];

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#141c2b]/90 transition-colors group align-top ${
                        index % 2 === 0 ? 'bg-[#0c1017]/80' : 'bg-[#0f141e]/80'
                      }`}
                    >
                      {/* COLUNA 1: OBSERVAÇÃO */}
                      <td className="p-4 text-xs text-slate-300 border-r border-[#1a2333]/80 relative">
                        <div className="space-y-2">
                          {item.observacao ? (
                            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-sans">
                              {item.observacao}
                            </p>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">
                              Sem observações adicionais
                            </span>
                          )}

                          {/* Metadata badge (Data & Turno) */}
                          <div className="pt-2 flex flex-col space-y-1 text-[10px] text-slate-400 border-t border-[#1b2434]/80">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#c9a265]" />
                              {item.dataRegistro} às {item.horaRegistro}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <User className="w-3 h-3 text-slate-400" />
                              {item.operador}
                            </span>
                          </div>

                          {/* Row Action buttons */}
                          <div className="pt-2 flex items-center space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingRecord(item);
                                setIsRecordModalOpen(true);
                              }}
                              className="p-1 rounded-lg bg-[#182030] hover:bg-[#222d42] text-slate-400 hover:text-[#dfbe85] transition-colors cursor-pointer"
                              title="Editar este registro"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(item.id)}
                              className="p-1 rounded-lg bg-[#182030] hover:bg-red-950/50 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Remover registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* COLUNA 2: OCORRÊNCIA (FORMATO EXATO DA IMAGEM) */}
                      <td className="p-4 text-xs border-r border-[#1a2333]/80">
                        <div className="space-y-2 text-center sm:text-left">
                          {/* Header block with Unidade, Placa, Eventualidade */}
                          <div className="text-center space-y-1 font-sans">
                            <div className="text-xs text-slate-200">
                              <strong className="text-white font-bold">Unidade/Transportadora:</strong>{' '}
                              <span className="text-[#dfbe85] font-semibold">{item.unidadeTransportadora}</span>
                            </div>

                            <div className="text-xs text-slate-200">
                              <strong className="text-white font-bold">Placa:</strong>{' '}
                              <span className="px-2 py-0.5 rounded bg-[#182233] border border-[#2c3d59] font-mono font-bold text-[#dfbe85] tracking-wider text-xs inline-block">
                                {item.placa}
                              </span>
                            </div>

                            <div className="text-xs text-slate-200">
                              <strong className="text-white font-bold">Eventualidade:</strong>{' '}
                              <span className="text-slate-300 font-medium">{item.eventualidade}</span>
                            </div>
                          </div>

                          {/* Dashed Separator Line */}
                          <div className="border-t border-dashed border-slate-700/70 my-2.5" />

                          {/* Occurrence Detailed Text */}
                          <div className="text-center font-bold text-slate-300 text-xs tracking-wide">
                            -------------------<br/>
                            Ocorrência:
                          </div>

                          <p className="text-xs text-slate-200 leading-relaxed text-justify whitespace-pre-line pt-1">
                            {item.descricaoOcorrencia}
                          </p>
                        </div>
                      </td>

                      {/* COLUNA 3: ATUALIZAÇÃO / RETORNO (FORMATO EXATO DA IMAGEM) */}
                      <td className="p-4 text-xs border-r border-[#1a2333]/80">
                        <div className="space-y-2">
                          <div className="text-center font-bold text-slate-300 text-xs tracking-wide">
                            Atualização:
                          </div>

                          {/* If substitution data exists */}
                          {item.atualizacao?.temSubstituicao && (
                            <div className="text-center space-y-1 pt-1 font-sans">
                              <p className="text-xs text-slate-300 italic">
                                Segue dados da substituição:
                              </p>
                              
                              {item.atualizacao.placaSubstituta && (
                                <div className="text-xs text-slate-200">
                                  <strong className="text-white font-bold">Placa:</strong>{' '}
                                  <span className="px-2 py-0.5 rounded bg-[#182233] border border-[#2c3d59] font-mono font-bold text-[#dfbe85] tracking-wider text-xs inline-block">
                                    {item.atualizacao.placaSubstituta}
                                  </span>
                                </div>
                              )}

                              {item.atualizacao.condutorSubstituto && (
                                <div className="text-xs text-slate-200">
                                  <strong className="text-white font-bold">Condutor:</strong>{' '}
                                  <span className="text-slate-200 font-semibold">
                                    {item.atualizacao.condutorSubstituto}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Detailed Update Narrative */}
                          {item.atualizacao?.descricaoRetorno && (
                            <p className="text-xs text-slate-200 leading-relaxed text-justify whitespace-pre-line pt-1">
                              {item.atualizacao.descricaoRetorno}
                            </p>
                          )}

                          {/* Quick button to add follow-up update */}
                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => {
                                setTargetUpdateRecord(item);
                                setIsUpdateModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#151d2c] hover:bg-[#1d273a] border border-[#24334a] text-[10.5px] font-semibold text-[#dfbe85] hover:text-white flex items-center space-x-1.5 transition-all cursor-pointer"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-[#c9a265]" />
                              <span>+ Adicionar Parecer</span>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* COLUNA 4: STATUS (MENU SUSPENSO INTERATIVO) */}
                      <td className="p-4 text-xs align-middle">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          {/* Interactive Dropdown for Status */}
                          <div className="relative w-full max-w-[170px]">
                            <select
                              value={item.status}
                              onChange={(e) =>
                                handleStatusChange(item.id, e.target.value as PlantaoStatus)
                              }
                              className={`w-full appearance-none pl-3 pr-8 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#c9a265]/50 ${statusConf.badgeBg} ${statusConf.badgeText} ${statusConf.badgeBorder} shadow-sm`}
                            >
                              <option value="acompanhar" className="bg-[#0f141d] text-blue-400">
                                acompanhar
                              </option>
                              <option value="resolvido" className="bg-[#0f141d] text-emerald-400">
                                resolvido
                              </option>
                              <option value="para conhecimento" className="bg-[#0f141d] text-slate-300">
                                para conhecimento
                              </option>
                              <option value="atenção" className="bg-[#0f141d] text-amber-400">
                                atenção
                              </option>
                              <option value="registrado no grid" className="bg-[#0f141d] text-purple-300">
                                registrado no grid
                              </option>
                            </select>

                            {/* Arrow icon */}
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <ChevronDown className="w-3.5 h-3.5" />
                            </div>
                          </div>

                          {/* Status Description pill */}
                          <span className="text-[10px] text-slate-400 text-center leading-tight">
                            {statusConf.description}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Bar */}
        <div className="p-3.5 bg-[#0e131d]/90 border-t border-[#1e2738]/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Transmissão em tempo real &bull; Livro de Ocorrências CCO 24h &bull; Grupo 3corações</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span>
              Total de registros ativos:{' '}
              <strong className="text-white font-mono">{items.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 5. RECORD MODAL (CREATE / EDIT) */}
      <PlantaoRecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        editingRecord={editingRecord}
      />

      {/* 6. ADD UPDATE / RETORNO MODAL */}
      <AddPlantaoUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setTargetUpdateRecord(null);
        }}
        record={targetUpdateRecord}
        onSaveUpdate={handleSaveUpdate}
      />
    </div>
  );
}
