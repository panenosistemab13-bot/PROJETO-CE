import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  FileText,
  AlertTriangle,
  Award,
  CheckSquare,
  Clock,
  Calendar,
  Truck,
  User,
  MapPin,
  Tag,
  Plus,
  Trash2,
  Save,
  Sparkles,
} from 'lucide-react';
import { PlantaoFolderItem, ItemTipo, ItemPrioridade, PlantaoUser } from '../../types/plantao3d';

interface AddFolderItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PlantaoFolderItem) => void;
  user: PlantaoUser;
  editingItem?: PlantaoFolderItem | null;
}

export function AddFolderItemModal({
  isOpen,
  onClose,
  onSave,
  user,
  editingItem,
}: AddFolderItemModalProps) {
  const [tipo, setTipo] = useState<ItemTipo>('resumo_turno');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [prioridade, setPrioridade] = useState<ItemPrioridade>('normal');
  const [statusAcompanhamento, setStatusAcompanhamento] = useState<'concluido' | 'acompanhar' | 'pendente_proximo_turno' | 'informativo'>('concluido');
  const [veiculoPlaca, setVeiculoPlaca] = useState('');
  const [motorista, setMotorista] = useState('');
  const [local, setLocal] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [checklists, setChecklists] = useState<{ id: string; texto: string; concluido: boolean }[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  useEffect(() => {
    if (editingItem) {
      setTipo(editingItem.tipo);
      setTitulo(editingItem.titulo);
      setDescricao(editingItem.descricao);
      setData(editingItem.data);
      setHora(editingItem.hora);
      setPrioridade(editingItem.prioridade);
      setStatusAcompanhamento(editingItem.statusAcompanhamento);
      setVeiculoPlaca(editingItem.veiculoPlaca || '');
      setMotorista(editingItem.motorista || '');
      setLocal(editingItem.local || '');
      setTags(editingItem.tags || []);
      setChecklists(editingItem.checklistItems || []);
    } else {
      const now = new Date();
      setTipo('resumo_turno');
      setTitulo('');
      setDescricao('');
      setData(now.toLocaleDateString('pt-BR'));
      setHora(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
      setPrioridade('normal');
      setStatusAcompanhamento('concluido');
      setVeiculoPlaca('');
      setMotorista('');
      setLocal('');
      setTags([user.turno, user.funcao]);
      setChecklists([]);
    }
  }, [editingItem, isOpen, user]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddChecklist = () => {
    if (newChecklistText.trim()) {
      setChecklists([
        ...checklists,
        { id: `chk-${Date.now()}`, texto: newChecklistText.trim(), concluido: false },
      ]);
      setNewChecklistText('');
    }
  };

  const handleToggleChecklist = (id: string) => {
    setChecklists(
      checklists.map((c) => (c.id === id ? { ...c, concluido: !c.concluido } : c))
    );
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklists(checklists.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descricao.trim()) {
      alert('Por favor, preencha o título e a descrição do registro.');
      return;
    }

    const savedItem: PlantaoFolderItem = {
      id: editingItem ? editingItem.id : `item-${Date.now()}`,
      userId: user.id,
      userName: user.nome,
      tipo,
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      data: data.trim() || new Date().toLocaleDateString('pt-BR'),
      hora: hora.trim() || new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      prioridade,
      statusAcompanhamento,
      veiculoPlaca: veiculoPlaca.toUpperCase().trim() || undefined,
      motorista: motorista.trim() || undefined,
      local: local.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      checklistItems: checklists.length > 0 ? checklists : undefined,
      createdAt: editingItem ? editingItem.createdAt : Date.now(),
    };

    onSave(savedItem);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#161c28] via-[#101520] to-[#0c1017] border border-[#2b3c58] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#222f44] flex items-center justify-between bg-[#131a26]/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a265] to-[#8f6826] flex items-center justify-center shadow-lg shadow-[#c9a265]/20">
              <FileText className="w-5 h-5 text-[#140e06]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                {editingItem ? 'Editar Lançamento na Pasta' : `Novo Lançamento &bull; Pasta de ${user.nome}`}
              </h3>
              <p className="text-xs text-slate-400">
                {user.funcao} &bull; {user.turno} &bull; {user.periodo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1b2434] hover:bg-[#253248] text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto custom-scroll flex-1">
          {/* Tipo de Registro Selector Buttons */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Tipo do Registro *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'resumo_turno', label: 'Resumo de Turno', icon: FileText, color: 'hover:border-[#c9a265]' },
                { id: 'ocorrencia', label: 'Ocorrência', icon: AlertTriangle, color: 'hover:border-amber-500' },
                { id: 'pontuacao', label: 'Pontuação / Alerta', icon: Award, color: 'hover:border-blue-500' },
                { id: 'checklist', label: 'Checklist / Ação', icon: CheckSquare, color: 'hover:border-emerald-500' },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTipo(t.id as ItemTipo)}
                    className={`p-2.5 rounded-xl border flex items-center space-x-2 text-xs font-semibold transition-all cursor-pointer ${
                      tipo === t.id
                        ? 'border-[#c9a265] bg-[#c9a265]/20 text-[#dfbe85] shadow-md shadow-[#c9a265]/20 font-bold'
                        : `border-[#232f45] bg-[#0c1017] text-slate-300 ${t.color}`
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Título / Assunto Principal *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Acompanhamento de comboio, liberação de doca, checklist de veículos..."
              className="w-full px-3.5 py-2.5 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Descrição Detalhada */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              O que aconteceu no seu turno? (Detalhes completos) *
            </label>
            <textarea
              required
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva minuciosamente todos os eventos, alinhamentos, pendências para a próxima equipe e detalhes de telemetria..."
              className="w-full p-3 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner custom-scroll"
            />
          </div>

          {/* Data, Hora & Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Data do Registro
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-[#dfbe85] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  placeholder="DD/MM/AAAA"
                  className="w-full pl-8 pr-3 py-2 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-mono font-bold text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Horário
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-[#dfbe85] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  placeholder="HH:MM"
                  className="w-full pl-8 pr-3 py-2 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-mono font-bold text-[#dfbe85] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Prioridade
              </label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as ItemPrioridade)}
                className="w-full px-3 py-2 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-semibold text-slate-200 focus:outline-none transition-all"
              >
                <option value="normal">Normal (Operação Regular)</option>
                <option value="importante">Importante (Atenção CCO)</option>
                <option value="critica">Crítica (Ação Imediata)</option>
              </select>
            </div>
          </div>

          {/* Status de Acompanhamento */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Status do Lançamento
            </label>
            <select
              value={statusAcompanhamento}
              onChange={(e) => setStatusAcompanhamento(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-semibold text-slate-200 focus:outline-none transition-all"
            >
              <option value="concluido">Concluído (Sem pendências)</option>
              <option value="acompanhar">Em Acompanhamento</option>
              <option value="pendente_proximo_turno">Pendente para o Próximo Turno</option>
              <option value="informativo">Informativo Geral</option>
            </select>
          </div>

          {/* Dados Opcionais: Veículo, Motorista e Local */}
          <div className="p-3.5 rounded-2xl bg-[#090d14] border border-[#1e2738] space-y-2.5">
            <div className="text-[11px] font-bold text-[#dfbe85] uppercase tracking-wider">
              Vínculo Operacional (Opcional)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-[10.5px] font-medium text-slate-400 block mb-1">
                  Placa do Veículo
                </label>
                <input
                  type="text"
                  value={veiculoPlaca}
                  onChange={(e) => setVeiculoPlaca(e.target.value.toUpperCase())}
                  placeholder="Ex: ABC-1234"
                  className="w-full px-3 py-1.5 bg-[#0c111a] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-mono font-bold text-white uppercase focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-medium text-slate-400 block mb-1">
                  Motorista / Condutor
                </label>
                <input
                  type="text"
                  value={motorista}
                  onChange={(e) => setMotorista(e.target.value)}
                  placeholder="Nome do motorista..."
                  className="w-full px-3 py-1.5 bg-[#0c111a] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-medium text-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-medium text-slate-400 block mb-1">
                  Local / Rodovia
                </label>
                <input
                  type="text"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  placeholder="Ex: Pátio Eusébio, BR-116..."
                  className="w-full px-3 py-1.5 bg-[#0c111a] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-medium text-white focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Checklist Interativo */}
          <div className="p-3.5 rounded-2xl bg-[#090d14] border border-[#1e2738] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#dfbe85] uppercase tracking-wider">
                Checklist / Pontos de Verificação do Turno
              </span>
              <span className="text-[10px] text-slate-400">{checklists.length} itens</span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklist();
                  }
                }}
                placeholder="Adicionar item de verificação..."
                className="flex-1 px-3 py-1.5 bg-[#0c111a] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddChecklist}
                className="px-3 py-1.5 rounded-xl bg-[#1d273a] hover:bg-[#c9a265] text-slate-200 hover:text-[#140e06] font-bold text-xs transition-all cursor-pointer flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {checklists.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {checklists.map((chk) => (
                  <div
                    key={chk.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#0e1420] border border-[#1c2637]"
                  >
                    <label className="flex items-center space-x-2 text-xs text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={chk.concluido}
                        onChange={() => handleToggleChecklist(chk.id)}
                        className="rounded border-[#2b3c58] text-[#c9a265] focus:ring-0 cursor-pointer"
                      />
                      <span className={chk.concluido ? 'line-through text-slate-500' : ''}>
                        {chk.texto}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklist(chk.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Tags / Marcadores
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Adicionar tag (ex: Festival do Café, Telemetria)..."
                className="flex-1 px-3 py-1.5 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-[#1d273a] hover:bg-[#c9a265] text-slate-200 hover:text-[#140e06] font-bold text-xs transition-all cursor-pointer"
              >
                + Tag
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-1.5 pt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-[#162030] border border-[#283850] text-[#dfbe85] text-[11px] font-semibold"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#222f44] flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#141b28] hover:bg-[#1f2a3e] text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs flex items-center space-x-2 shadow-lg shadow-[#c9a265]/20 transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Lançamento na Pasta</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
