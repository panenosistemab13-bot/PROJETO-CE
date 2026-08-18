import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  FolderOpen,
  User,
  Clock,
  Sun,
  Moon,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  FileText,
  Award,
  CheckSquare,
  Sparkles,
  Printer,
  Copy,
  Check,
  Search,
  Tag,
  Truck,
  MapPin,
} from 'lucide-react';
import { PlantaoUser, PlantaoFolderItem, ItemTipo } from '../../types/plantao3d';

interface FolderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: PlantaoUser;
  items: PlantaoFolderItem[];
  currentActiveUserId: string;
  onAddItem: (user: PlantaoUser) => void;
  onEditItem: (item: PlantaoFolderItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleChecklist: (itemId: string, checkId: string) => void;
}

export function FolderDetailModal({
  isOpen,
  onClose,
  user,
  items,
  currentActiveUserId,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onToggleChecklist,
}: FolderDetailModalProps) {
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isOwner = currentActiveUserId === user.id;
  const userItems = items.filter((item) => item.userId === user.id);

  const filteredItems = userItems.filter((item) => {
    const matchTipo = filterTipo === 'all' || item.tipo === filterTipo;
    const matchSearch =
      item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.veiculoPlaca && item.veiculoPlaca.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.motorista && item.motorista.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchTipo && matchSearch;
  });

  const handleCopyReport = () => {
    const text = `=== PASSAGEM DE PLANTÃO - PASTA: ${user.nome.toUpperCase()} ===\nFunção: ${user.funcao} | ${user.turno} (${user.periodo})\nData: ${new Date().toLocaleDateString('pt-BR')}\n\n` +
      userItems.map((item, idx) => (
        `[${idx + 1}] ${item.titulo} (${item.data} às ${item.hora})\nTipo: ${item.tipo.toUpperCase()} | Prioridade: ${item.prioridade.toUpperCase()}\nDescrição: ${item.descricao}\n` +
        (item.veiculoPlaca ? `Veículo: ${item.veiculoPlaca} | Motorista: ${item.motorista || 'N/A'}\n` : '') +
        (item.checklistItems ? `Checklist: ${item.checklistItems.map(c => `[${c.concluido ? 'X' : ' '}] ${c.texto}`).join(', ')}\n` : '') +
        `----------------------------------------\n`
      )).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-gradient-to-b from-[#151b27] via-[#0f1420] to-[#0a0d14] border border-[#c9a265]/50 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-5 border-b border-[#222f44] bg-[#121927]/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${user.avatarColor} p-0.5 shadow-xl flex items-center justify-center flex-shrink-0 text-white font-serif font-bold text-xl`}
            >
              <div className="w-full h-full rounded-[14px] bg-[#0c1017]/40 flex items-center justify-center backdrop-blur-sm border border-white/20">
                {user.avatarInitials}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-lg sm:text-xl font-bold text-white font-serif tracking-tight">
                  Pasta de {user.nome}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider border ${user.badgeColor}`}>
                  {user.funcao}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-300 mt-1">
                <span className="font-semibold text-[#dfbe85] flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{user.turno}</span>
                </span>
                <span>&bull;</span>
                <span className="flex items-center space-x-1 text-slate-300">
                  {user.periodo === 'Diurno' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{user.periodo}</span>
                </span>
                <span>&bull;</span>
                <span className="text-slate-400">{userItems.length} registros no turno</span>
              </div>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={handleCopyReport}
              className="px-3 py-1.5 rounded-xl bg-[#172030] hover:bg-[#233148] text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-[#283950] transition-all cursor-pointer"
              title="Copiar Relatório do Turno"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#dfbe85]" />}
              <span>{copied ? 'Copiado!' : 'Copiar Resumo'}</span>
            </button>

            {isOwner && (
              <button
                onClick={() => onAddItem(user)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-[#c9a265]/20 transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Lançar no Turno</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1b2434] hover:bg-[#253248] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ownership Banner Alert */}
        <div className={`px-5 py-2.5 text-xs flex items-center justify-between border-b ${
          isOwner
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-950/30 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center space-x-2">
            {isOwner ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
            <span className="font-medium">
              {isOwner
                ? 'Você é o proprietário desta pasta: você pode adicionar, editar ou apagar seus registros.'
                : `Mural Coletivo: Você está visualizando a pasta de ${user.nome} em modo somente leitura.`}
            </span>
          </div>
          <span className="text-[11px] font-mono opacity-80">CCO 3corações</span>
        </div>

        {/* Search and Filters inside Folder */}
        <div className="p-4 bg-[#0d121b] border-b border-[#1b2535] flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar registros nesta pasta..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#080b10] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto custom-scroll pb-1 sm:pb-0">
            {[
              { id: 'all', label: `Todos (${userItems.length})` },
              { id: 'resumo_turno', label: 'Resumos' },
              { id: 'ocorrencia', label: 'Ocorrências' },
              { id: 'pontuacao', label: 'Pontuações' },
              { id: 'checklist', label: 'Checklists' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterTipo(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  filterTipo === f.id
                    ? 'bg-[#c9a265] text-[#140e06] font-bold shadow'
                    : 'bg-[#151c27] text-slate-300 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items List in the Folder */}
        <div className="p-5 overflow-y-auto custom-scroll flex-1 space-y-3.5 bg-[#090d14]">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0e131c] border border-[#1e2838] space-y-2">
              <FolderOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">
                Nenhum registro encontrado nesta pasta.
              </p>
              {isOwner && (
                <button
                  onClick={() => onAddItem(user)}
                  className="mt-2 px-4 py-2 rounded-xl bg-[#c9a265] text-[#140e06] text-xs font-bold transition-all"
                >
                  + Adicionar Primeiro Registro
                </button>
              )}
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-gradient-to-r from-[#121824] to-[#0e131d] border border-[#232f45] hover:border-[#c9a265]/60 transition-all space-y-2.5 shadow-md"
              >
                {/* Item Top Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider ${
                        item.tipo === 'resumo_turno'
                          ? 'bg-[#c9a265]/20 text-[#dfbe85] border border-[#c9a265]/40'
                          : item.tipo === 'ocorrencia'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : item.tipo === 'pontuacao'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {item.tipo.replace('_', ' ')}
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        item.prioridade === 'critica'
                          ? 'bg-red-950/60 text-red-300 border border-red-500/40'
                          : item.prioridade === 'importante'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800/60 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.prioridade}
                    </span>

                    <span className="text-[11px] font-mono text-slate-400">
                      {item.data} às {item.hora}
                    </span>
                  </div>

                  {/* Edit / Delete actions if Owner */}
                  {isOwner && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEditItem(item)}
                        className="p-1 rounded-lg bg-[#182232] hover:bg-[#25354e] text-slate-300 hover:text-white transition-all cursor-pointer"
                        title="Editar Lançamento"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 rounded-lg bg-[#182232] hover:bg-rose-950 text-slate-300 hover:text-rose-300 transition-all cursor-pointer"
                        title="Excluir Lançamento"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Title and Description */}
                <div>
                  <h4 className="text-sm font-bold text-white tracking-wide font-serif">
                    {item.titulo}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed whitespace-pre-line">
                    {item.descricao}
                  </p>
                </div>

                {/* Vehicle and Location Badge */}
                {(item.veiculoPlaca || item.motorista || item.local) && (
                  <div className="flex items-center flex-wrap gap-2 pt-1 text-[11px] text-slate-300">
                    {item.veiculoPlaca && (
                      <span className="px-2 py-0.5 rounded-lg bg-[#080c12] border border-[#212c3f] font-mono font-bold text-white flex items-center space-x-1">
                        <Truck className="w-3 h-3 text-[#c9a265]" />
                        <span>{item.veiculoPlaca}</span>
                      </span>
                    )}
                    {item.motorista && (
                      <span className="px-2 py-0.5 rounded-lg bg-[#080c12] border border-[#212c3f] flex items-center space-x-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{item.motorista}</span>
                      </span>
                    )}
                    {item.local && (
                      <span className="px-2 py-0.5 rounded-lg bg-[#080c12] border border-[#212c3f] flex items-center space-x-1 text-[#dfbe85]">
                        <MapPin className="w-3 h-3 text-[#c9a265]" />
                        <span>{item.local}</span>
                      </span>
                    )}
                  </div>
                )}

                {/* Checklists items if any */}
                {item.checklistItems && item.checklistItems.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-[#080c12] border border-[#1d2738] space-y-1">
                    <div className="text-[10px] font-bold uppercase text-[#dfbe85] tracking-wider mb-1">
                      Checklist do Turno:
                    </div>
                    {item.checklistItems.map((chk) => (
                      <label
                        key={chk.id}
                        className={`flex items-center space-x-2 text-xs cursor-pointer ${
                          isOwner ? '' : 'pointer-events-none'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={chk.concluido}
                          disabled={!isOwner}
                          onChange={() => onToggleChecklist(item.id, chk.id)}
                          className="rounded border-[#2b3c58] text-[#c9a265] focus:ring-0 cursor-pointer"
                        />
                        <span className={chk.concluido ? 'line-through text-slate-500' : 'text-slate-200'}>
                          {chk.texto}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex items-center flex-wrap gap-1.5 pt-1">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-[#182335] text-[#dfbe85] text-[10px] font-semibold"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222f44] bg-[#101622] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sincronizado em tempo real com o CCO 3corações</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#1a2332] hover:bg-[#253248] text-white font-semibold transition-all cursor-pointer"
          >
            Fechar Pasta
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
