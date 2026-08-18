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
  Truck,
  Coffee,
} from 'lucide-react';
import { PlantaoUser, PlantaoFolderItem } from '../../types/plantao3d';

import iconFolder3d from '../../assets/images/icon_folder_3d_1787015156529.jpg';
import iconBadge3d from '../../assets/images/icon_badge_3d_1787015174678.jpg';
import iconCoffee3d from '../../assets/images/icon_coffee_3d_1787015165985.jpg';
import iconTruck3d from '../../assets/images/icon_truck_3d_1787015195876.jpg';

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
      className="group relative rounded-3xl p-5 bg-gradient-to-b from-[#182030] via-[#121824] to-[#0c1017] border border-[#2b3c58] hover:border-[#c9a265] shadow-2xl hover:shadow-[0_16px_40px_rgba(201,162,101,0.25)] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer select-none flex flex-col justify-between overflow-hidden"
    >
      {/* 3D Luxury Folder Tab Top Badge */}
      <div className="absolute top-0 right-6 px-3.5 py-1 rounded-b-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#8c672b] text-[#120e06] text-[10px] font-mono font-extrabold uppercase tracking-wider shadow-lg flex items-center space-x-1.5 border-b border-[#dfbe85]">
        <Folder className="w-3 h-3 fill-current" />
        <span>PASTA {user.turno.replace('Turno ', '')}</span>
      </div>

      {/* Subtle Golden Radial Glow */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[radial-gradient(circle,rgba(201,162,101,0.12),transparent_70%)] pointer-events-none" />

      {/* Top Header with 3D Folder Icon, Avatar & User Info */}
      <div className="space-y-4 pt-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            {/* 3D Rendered Leather Document Folder Icon with 3corações Seal */}
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#c9a265]/70 group-hover:border-[#dfbe85] shadow-xl shadow-black/60 flex-shrink-0 bg-[#080c14] transform group-hover:scale-105 transition-transform duration-300">
              <img
                src={iconFolder3d}
                alt="Pasta Executiva 3D"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-black/80 to-transparent" />
              {/* Floating initial badge */}
              <div className="absolute top-1 left-1 px-1 rounded text-[9px] font-bold bg-black/60 text-[#dfbe85] border border-[#c9a265]/40 font-mono">
                {user.avatarInitials}
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white font-serif tracking-tight group-hover:text-[#dfbe85] transition-colors">
                  {user.nome}
                </h3>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${user.badgeColor} shadow-sm`}>
                  {user.funcao}
                </span>
                <span className="text-[11px] text-slate-300 font-medium flex items-center space-x-1">
                  {user.periodo === 'Diurno' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400 inline" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-indigo-400 inline" />
                  )}
                  <span>{user.periodo}</span>
                </span>
              </div>
            </div>
          </div>

          {/* User Status Badge */}
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-bold uppercase tracking-wider shadow-sm ${
                user.status === 'Em Plantão'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : user.status === 'Transição'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-700/40 text-slate-300 border border-slate-600'
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>

        {/* Turno & Permission Indicator Bar with 3D Shield Badge */}
        <div className="p-2.5 rounded-xl bg-[#090e18]/90 border border-[#223046] flex items-center justify-between text-xs shadow-inner">
          <div className="flex items-center space-x-2 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-[#dfbe85]" />
            <span className="font-semibold">{user.turno}</span>
          </div>

          {isOwner ? (
            <span className="flex items-center space-x-1.5 text-[10.5px] text-emerald-300 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/40 shadow-sm">
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sua Pasta (Edição Ativa)</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5 text-[10.5px] text-slate-300 font-medium bg-[#131b29] px-2.5 py-0.5 rounded-lg border border-[#2b3a50]">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Mural Coletivo</span>
            </span>
          )}
        </div>

        {/* Folder Stats Mini-Grid with 3D Details */}
        <div className="grid grid-cols-4 gap-2 pt-1 text-center">
          <div className="p-2 rounded-xl bg-[#0b1019] border border-[#1f2c40] group-hover:border-[#c9a265]/40 transition-colors">
            <div className="text-[10px] uppercase font-bold text-slate-400">Resumos</div>
            <div className="text-sm font-bold text-white mt-0.5 font-mono">{summariesCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#0b1019] border border-[#1f2c40] group-hover:border-amber-500/40 transition-colors">
            <div className="text-[10px] uppercase font-bold text-amber-400">Ocorrênc.</div>
            <div className="text-sm font-bold text-amber-300 mt-0.5 font-mono">{occurrencesCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#0b1019] border border-[#1f2c40] group-hover:border-blue-500/40 transition-colors">
            <div className="text-[10px] uppercase font-bold text-blue-400">Pontos</div>
            <div className="text-sm font-bold text-blue-300 mt-0.5 font-mono">{pointsCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-[#0b1019] border border-[#1f2c40] group-hover:border-emerald-500/40 transition-colors">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Checks</div>
            <div className="text-sm font-bold text-emerald-300 mt-0.5 font-mono">{checklistsCount}</div>
          </div>
        </div>

        {/* Latest Activity Preview */}
        <div className="p-3 rounded-2xl bg-[#0c121d] border border-[#202d42] space-y-1">
          <div className="flex items-center justify-between text-[10.5px]">
            <span className="font-bold text-[#dfbe85] uppercase tracking-wider flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-[#c9a265]" />
              <span>Último Lançamento no Turno</span>
            </span>
            <span className="text-slate-400 font-mono">{latestItem ? `${latestItem.data} às ${latestItem.hora}` : 'Vazio'}</span>
          </div>
          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
            {latestItem ? latestItem.titulo : 'Nenhum registro lançado ainda nesta pasta.'}
          </p>
        </div>
      </div>

      {/* Footer Card Controls */}
      <div className="pt-4 mt-3 border-t border-[#202d42] flex items-center justify-between">
        {/* User Management Actions */}
        <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onEditUser(user)}
            className="p-1.5 rounded-xl bg-[#141c2a] hover:bg-[#212e44] text-slate-300 hover:text-white border border-[#263750] transition-all cursor-pointer"
            title="Editar Usuário / Pasta"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteUser(user.id)}
            className="p-1.5 rounded-xl bg-[#141c2a] hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-[#263750] hover:border-rose-700/50 transition-all cursor-pointer"
            title="Excluir Pasta & Usuário"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Open Folder CTA Button with Gold Sheen */}
        <button
          onClick={() => onOpenFolder(user)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-[#c9a265]/20 transition-all cursor-pointer active:scale-95"
        >
          <span>Abrir Pasta 3D</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
