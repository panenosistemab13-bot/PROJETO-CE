import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  User,
  Shield,
  Clock,
  Sun,
  Moon,
  Sparkles,
  Save,
  CheckCircle2,
  FolderPlus,
  Mail,
} from 'lucide-react';
import { PlantaoUser, FuncaoType, TurnoType, PeriodoType } from '../../types/plantao3d';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: PlantaoUser) => void;
  editingUser?: PlantaoUser | null;
}

const AVATAR_COLORS = [
  { name: 'Ouro 3corações', gradient: 'from-[#c9a265] to-[#8c672b]', badge: 'border-[#c9a265] text-[#dfbe85] bg-[#c9a265]/20' },
  { name: 'Bronze Âmbar', gradient: 'from-[#d97706] to-[#92400e]', badge: 'border-amber-500/50 text-amber-300 bg-amber-500/20' },
  { name: 'Azul Safira', gradient: 'from-[#3b82f6] to-[#1d4ed8]', badge: 'border-blue-500/50 text-blue-300 bg-blue-500/20' },
  { name: 'Violeta Real', gradient: 'from-[#8b5cf6] to-[#5b21b6]', badge: 'border-purple-500/50 text-purple-300 bg-purple-500/20' },
  { name: 'Esmeralda', gradient: 'from-[#10b981] to-[#047857]', badge: 'border-emerald-500/50 text-emerald-300 bg-emerald-500/20' },
  { name: 'Rubi Intenso', gradient: 'from-[#ef4444] to-[#991b1b]', badge: 'border-red-500/50 text-red-300 bg-red-500/20' },
];

export function UserManagementModal({
  isOpen,
  onClose,
  onSave,
  editingUser,
}: UserManagementModalProps) {
  const [nome, setNome] = useState('');
  const [funcao, setFuncao] = useState<FuncaoType>('Líder');
  const [turno, setTurno] = useState<TurnoType>('Turno A e B');
  const [periodo, setPeriodo] = useState<PeriodoType>('Diurno');
  const [status, setStatus] = useState<'Em Plantão' | 'Ativo' | 'Folga' | 'Transição'>('Em Plantão');
  const [email, setEmail] = useState('');
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  useEffect(() => {
    if (editingUser) {
      setNome(editingUser.nome);
      setFuncao(editingUser.funcao);
      setTurno(editingUser.turno);
      setPeriodo(editingUser.periodo);
      setStatus(editingUser.status);
      setEmail(editingUser.email || '');

      const idx = AVATAR_COLORS.findIndex((c) => c.gradient === editingUser.avatarColor);
      setSelectedColorIdx(idx >= 0 ? idx : 0);
    } else {
      setNome('');
      setFuncao('Líder');
      setTurno('Turno A e B');
      setPeriodo('Diurno');
      setStatus('Em Plantão');
      setEmail('');
      setSelectedColorIdx(0);
    }
  }, [editingUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert('Por favor, informe o nome do colaborador.');
      return;
    }

    const nameParts = nome.trim().split(' ');
    const initials = nameParts.length >= 2
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : nome.slice(0, 2).toUpperCase();

    const selectedColor = AVATAR_COLORS[selectedColorIdx];

    const savedUser: PlantaoUser = {
      id: editingUser ? editingUser.id : `user-${Date.now()}`,
      nome: nome.trim(),
      funcao,
      turno,
      periodo,
      status,
      email: email.trim() || `${nome.toLowerCase().replace(/\s+/g, '.')}@3coracoes.com.br`,
      avatarColor: selectedColor.gradient,
      avatarInitials: initials,
      badgeColor: selectedColor.badge,
      totalRegistros: editingUser?.totalRegistros || 0,
      ultimoRegistro: editingUser?.ultimoRegistro || 'Nenhum registro',
    };

    onSave(savedUser);
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#161c28] via-[#101520] to-[#0c1017] border border-[#2b3c58] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#222f44] flex items-center justify-between bg-[#131a26]/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c9a265] to-[#8f6826] flex items-center justify-center shadow-lg shadow-[#c9a265]/20">
              <FolderPlus className="w-5 h-5 text-[#140e06]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                {editingUser ? 'Editar Usuário & Pasta' : 'Adicionar Novo Usuário & Pasta'}
              </h3>
              <p className="text-xs text-slate-400">
                Passagem de Plantão &bull; Grupo 3corações
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
          {/* Nome */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Nome do Colaborador *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#c9a265] absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Cristiane Fialho, Airton Carvalho..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Função & Turno */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Função CCO *
              </label>
              <select
                value={funcao}
                onChange={(e) => setFuncao(e.target.value as FuncaoType)}
                className="w-full px-3 py-2.5 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-semibold text-slate-200 focus:outline-none transition-all"
              >
                <option value="Líder">Líder</option>
                <option value="Interino">Interino</option>
                <option value="Operador">Operador</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Coordenador">Coordenador</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Turno de Atuação *
              </label>
              <select
                value={turno}
                onChange={(e) => setTurno(e.target.value as TurnoType)}
                className="w-full px-3 py-2.5 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-semibold text-slate-200 focus:outline-none transition-all"
              >
                <option value="Turno A">Turno A</option>
                <option value="Turno B">Turno B</option>
                <option value="Turno A e B">Turno A e B</option>
                <option value="Turno C">Turno C</option>
              </select>
            </div>
          </div>

          {/* Período & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Período do Turno *
              </label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as PeriodoType)}
                className="w-full px-3 py-2.5 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-semibold text-slate-200 focus:outline-none transition-all"
              >
                <option value="Diurno">Diurno (06:00 às 18:00)</option>
                <option value="Noturno">Noturno (18:00 às 06:00)</option>
                <option value="Integral">Integral / Revezamento</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Status Atual *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-semibold text-slate-200 focus:outline-none transition-all"
              >
                <option value="Em Plantão">Em Plantão (Ativo agora)</option>
                <option value="Ativo">Ativo</option>
                <option value="Transição">Transição de Turno</option>
                <option value="Folga">Folga / Descanso</option>
              </select>
            </div>
          </div>

          {/* Email Corporativo */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              E-mail Corporativo
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome.sobrenome@3coracoes.com.br"
                className="w-full pl-9 pr-4 py-2.5 bg-[#0a0e16] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Tema Visual da Pasta / Avatar */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              Tema Visual da Pasta & Avatar
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {AVATAR_COLORS.map((color, idx) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColorIdx(idx)}
                  className={`p-2 rounded-xl border flex flex-col items-center space-y-1 transition-all cursor-pointer ${
                    selectedColorIdx === idx
                      ? 'border-[#c9a265] bg-[#c9a265]/15 scale-105 shadow-md shadow-[#c9a265]/20'
                      : 'border-[#232f45] bg-[#0c1017] hover:border-slate-500'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${color.gradient} shadow`} />
                  <span className="text-[9.5px] font-semibold text-slate-300 text-center truncate w-full">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
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
              <span>Salvar Pasta & Usuário</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
