import React from 'react';
import {
  Folder,
  FolderOpen,
  User,
  Clock,
  Sun,
  Moon,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Unlock,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { PlantaoUser, PlantaoFolderItem } from '../../types/plantao3d';

interface UserFolderCardProps {
  user: PlantaoUser;
  items: PlantaoFolderItem[];
  currentActiveUserId: string;
  onOpenFolder: (user: PlantaoUser) => void;
  onEditUser: (user: PlantaoUser) => void;
  onDeleteUser: (userId: string) => void;
  viewStyle?: '3d' | 'classic';
}

export function UserFolderCard({
  user,
  items,
  currentActiveUserId,
  onOpenFolder,
  onEditUser,
  onDeleteUser,
  viewStyle = '3d',
}: UserFolderCardProps) {
  const isOwner = currentActiveUserId === user.id;
  const userItems = items.filter((item) => item.userId === user.id);

  const occurrencesCount = userItems.filter((i) => i.tipo === 'ocorrencia').length;
  const checklistsCount = userItems.filter((i) => i.tipo === 'checklist').length;
  const summariesCount = userItems.filter((i) => i.tipo === 'resumo_turno').length;
  const pointsCount = userItems.filter((i) => i.tipo === 'pontuacao').length;

  const latestItem = userItems[0];

  return (
    <div
      onClick={() => onOpenFolder(user)}
      className="group relative rounded-3xl p-5 bg-gradient-to-b from-[#161c28] via-[#111622] to-[#0c1017] border border-[#26354d] hover:border-[#c9a265] shadow-xl hover:shadow-[0_12px_32px_rgba(201,162,101,0.18)] transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer select-none flex flex-col justify-between overflow-hidden"
    >
      {/* 3D Luxury Folder Tab Accent on top-right */}
      <div className="absolute top-0 right-7 px-4 py-1 rounded-b-xl bg-gradient-to-r from-[#c9a265] to-[#8c672b] text-[#120e06] text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-md flex items-center space-x-1.5">
        <Folder className="w-3 h-3 fill-current" />
        <span>PASTA {user.turno.replace('Turno ', '')}</span>
      </div>

      {/* Background Subtle Glowing Radial */}
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[radial-gradient(circle,rgba(201,162,101,0.1),transparent_70%)] pointer-events-none" />

      {/* Top Header with Avatar & User Info */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* 3D Round Avatar with initials & glowing border */}
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${user.avatarColor} p-0.5 shadow-lg flex items-center justify-center flex-shrink-0 text-white font-serif font-bold text-base tracking-wider`}
            >
              <div className="w-full h-full rounded-[14px] bg-[#0c1017]/40 flex items-center justify-center backdrop-blur-sm border border-white/20">
                {user.avatarInitials}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-base font-bold text-white font-serif tracking-tight group-hover:text-[#dfbe85] transition-colors">
                  {user.nome}
                </h3>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${user.badgeColor}`}>
                  {user.funcao}
                </span>
                <span className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
                  {user.periodo === 'Diurno' ? (
                    <Sun className="w-3 h-3 text-amber-400 inline" />
                  ) : (
                    <Moon className="w-3 h-3 text-indigo-400 inline" />
                  )}
                  <span>{user.periodo}</span>
                </span>
              </div>
            </div>
          </div>

          {/* User Status Badge */}
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider ${
                user.status === 'Em Plantão'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : user.status === 'Transição'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-700/40 text-slate-300 border border-slate-600'
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        {/* Turno & Permission Indicator Bar */}
        <div className="p-2.5 rounded-xl bg-[#090d14]/80 border border-[#1e2838] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-[#dfbe85]" />
            <span className="font-semibold">{user.turno}</span>
          </div>

          {isOwner ? (
            <span className="flex items-center space-x-1 text-[10.5px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
              <Unlock className="w-3 h-3" />
              <span>Sua Pasta (Edição Liberada)</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-[10.5px] text-slate-400 font-medium bg-[#121927] px-2 py-0.5 rounded-md border border-[#232f45]">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Visualização</span>
            </span>
          )}
        </div>

        {/* Folder Stats Mini-Grid */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
          <div className="p-2 rounded-xl bg-[#0c1017] border border-[#1c2637]">
            <div className="text-[10px] uppercase font-bold text-slate-400">Resumos</div>
            <div className="text-sm font-bold text-white mt-0.5">{summariesCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#0c1017] border border-[#1c2637]">
            <div className="text-[10px] uppercase font-bold text-amber-400">Ocorrênc.</div>
            <div className="text-sm font-bold text-amber-300 mt-0.5">{occurrencesCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#0c1017] border border-[#1c2637]">
            <div className="text-[10px] uppercase font-bold text-blue-400">Pontos</div>
            <div className="text-sm font-bold text-blue-300 mt-0.5">{pointsCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#0c1017] border border-[#1c2637]">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Checks</div>
            <div className="text-sm font-bold text-emerald-300 mt-0.5">{checklistsCount}</div>
          </div>
        </div>

        {/* Latest Activity Preview */}
        <div className="p-3 rounded-2xl bg-[#0e1420] border border-[#1e293c] space-y-1">
          <div className="flex items-center justify-between text-[10.5px]">
            <span className="font-bold text-[#dfbe85] uppercase tracking-wider flex items-center space-x-1">
              <FileText className="w-3 h-3 text-[#c9a265]" />
              <span>Último Lançamento</span>
            </span>
            <span className="text-slate-400">{latestItem ? `${latestItem.data} às ${latestItem.hora}` : 'Sem registros'}</span>
          </div>
          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
            {latestItem ? latestItem.titulo : 'Nenhum registro adicionado ainda nesta pasta.'}
          </p>
        </div>
      </div>

      {/* Footer Card Controls */}
      <div className="pt-4 mt-3 border-t border-[#1d273a] flex items-center justify-between">
        {/* User Management Actions */}
        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEditUser(user)}
            className="p-1.5 rounded-lg bg-[#141b28] hover:bg-[#202c42] text-slate-300 hover:text-white border border-[#232f45] transition-all cursor-pointer"
            title="Editar Usuário / Pasta"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteUser(user.id)}
            className="p-1.5 rounded-lg bg-[#141b28] hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 border border-[#232f45] hover:border-rose-700/50 transition-all cursor-pointer"
            title="Excluir Pasta & Usuário"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Open Folder CTA Button */}
        <button
          onClick={() => onOpenFolder(user)}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-[#c9a265]/10 transition-all cursor-pointer"
        >
          <span>Abrir Pasta</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
