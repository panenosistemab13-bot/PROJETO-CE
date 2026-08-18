import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  UserPlus,
  Search,
  Filter,
  Move3D,
  RotateCw,
  Sparkles,
  LayoutGrid,
  Layers,
  Sun,
  Moon,
  Clock,
  Shield,
  Coffee,
  Heart,
  ChevronDown,
  User,
  Plus,
  Eye,
  SlidersHorizontal,
  Flame,
  Award,
  Image as ImageIcon,
  Check,
  Truck,
  Sparkle,
} from 'lucide-react';

import { PlantaoUser, PlantaoFolderItem, FuncaoType, TurnoType, PeriodoType } from '../types/plantao3d';
import { INITIAL_PLANTAO_USERS, INITIAL_PLANTAO_ITEMS } from '../data/initialPlantaoUsers';
import {
  FestivalCafe360Viewer,
  WALLPAPERS_360_THEMES,
  Wallpaper360Theme,
} from '../components/plantao3d/FestivalCafe360Viewer';
import { UserFolderCard } from '../components/plantao3d/UserFolderCard';
import { FolderDetailModal } from '../components/plantao3d/FolderDetailModal';
import { UserManagementModal } from '../components/plantao3d/UserManagementModal';
import { AddFolderItemModal } from '../components/plantao3d/AddFolderItemModal';

import iconFolder3d from '../assets/images/icon_folder_3d_1787015156529.jpg';
import iconCoffee3d from '../assets/images/icon_coffee_3d_1787015165985.jpg';
import iconBadge3d from '../assets/images/icon_badge_3d_1787015174678.jpg';
import iconTruck3d from '../assets/images/icon_truck_3d_1787015195876.jpg';

export function PassagemPlantao() {
  // 1. Persistent Users & Folder Items state
  const [users, setUsers] = useState<PlantaoUser[]>(() => {
    const saved = localStorage.getItem('plantao_users_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved plantao users', e);
      }
    }
    return INITIAL_PLANTAO_USERS;
  });

  const [items, setItems] = useState<PlantaoFolderItem[]>(() => {
    const saved = localStorage.getItem('plantao_items_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved plantao items', e);
      }
    }
    return INITIAL_PLANTAO_ITEMS;
  });

  // 2. Active Logged-in Operator selector (defaults to Cristiane Fialho)
  const [currentActiveUserId, setCurrentActiveUserId] = useState<string>(() => {
    const saved = localStorage.getItem('plantao_active_user_id');
    return saved || 'user-cristiane-fialho';
  });

  // 3. Active 360 Theme / Wallpaper in 4K
  const [activeWallpaperTheme, setActiveWallpaperTheme] = useState<Wallpaper360Theme>(() => {
    const savedId = localStorage.getItem('plantao_wallpaper_360_id');
    if (savedId) {
      const found = WALLPAPERS_360_THEMES.find((t) => t.id === savedId);
      if (found) return found;
    }
    return WALLPAPERS_360_THEMES[0];
  });



  // View Mode: 'mural3d' | 'grid'
  const [viewMode, setViewMode] = useState<'mural3d' | 'grid'>('mural3d');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTurno, setFilterTurno] = useState<string>('all');
  const [filterPeriodo, setFilterPeriodo] = useState<string>('all');
  const [filterFuncao, setFilterFuncao] = useState<string>('all');

  // Modals state
  const [selectedFolderUser, setSelectedFolderUser] = useState<PlantaoUser | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PlantaoUser | null>(null);

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [userForNewItem, setUserForNewItem] = useState<PlantaoUser | null>(null);
  const [editingItem, setEditingItem] = useState<PlantaoFolderItem | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('plantao_users_v2', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('plantao_items_v2', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('plantao_active_user_id', currentActiveUserId);
  }, [currentActiveUserId]);

  useEffect(() => {
    localStorage.setItem('plantao_wallpaper_360_id', activeWallpaperTheme.id);
  }, [activeWallpaperTheme]);



  const activeUser = useMemo(() => {
    return users.find((u) => u.id === currentActiveUserId) || users[0];
  }, [users, currentActiveUserId]);

  // Handlers for User Management
  const handleSaveUser = (savedUser: PlantaoUser) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === savedUser.id ? savedUser : u)));
    } else {
      setUsers([...users, savedUser]);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return;

    if (
      window.confirm(
        `Tem certeza que deseja remover a pasta e o usuário "${userToDelete.nome}" da Passagem de Plantão?`
      )
    ) {
      setUsers(users.filter((u) => u.id !== userId));
      setItems(items.filter((i) => i.userId !== userId));

      if (currentActiveUserId === userId && users.length > 1) {
        const remaining = users.filter((u) => u.id !== userId);
        setCurrentActiveUserId(remaining[0].id);
      }
      if (selectedFolderUser?.id === userId) {
        setIsFolderModalOpen(false);
        setSelectedFolderUser(null);
      }
    }
  };

  // Handlers for Folder Items
  const handleSaveItem = (savedItem: PlantaoFolderItem) => {
    if (editingItem) {
      setItems(items.map((i) => (i.id === savedItem.id ? savedItem : i)));
    } else {
      setItems([savedItem, ...items]);
    }
    setIsAddItemModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Tem certeza que deseja apagar este lançamento do seu turno?')) {
      setItems(items.filter((i) => i.id !== itemId));
    }
  };

  const handleToggleChecklist = (itemId: string, checkId: string) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId && item.checklistItems) {
          return {
            ...item,
            checklistItems: item.checklistItems.map((c) =>
              c.id === checkId ? { ...c, concluido: !c.concluido } : c
            ),
          };
        }
        return item;
      })
    );
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.turno.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTurno = filterTurno === 'all' || u.turno === filterTurno;
      const matchPeriodo = filterPeriodo === 'all' || u.periodo === filterPeriodo;
      const matchFuncao = filterFuncao === 'all' || u.funcao === filterFuncao;

      return matchSearch && matchTurno && matchPeriodo && matchFuncao;
    });
  }, [users, searchTerm, filterTurno, filterPeriodo, filterFuncao]);

  // Overall Stats
  const totalSummaries = items.filter((i) => i.tipo === 'resumo_turno').length;
  const totalOccurrences = items.filter((i) => i.tipo === 'ocorrencia').length;
  const totalChecklists = items.filter((i) => i.tipo === 'checklist').length;
  const totalPoints = items.filter((i) => i.tipo === 'pontuacao').length;

  return (
    <div className="relative space-y-6 pb-16 animate-fade-in text-slate-200">


      {/* Top Hero Banner with 3D Icons & 4K Theme Indicator */}
      <div className="relative z-10 rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#19130d] via-[#121825] to-[#0c1018] border-2 border-[#c9a265]/50 shadow-[0_15px_45px_rgba(0,0,0,0.7)] overflow-hidden">
        {/* Ambient Gold Radial Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-full bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,101,0.22),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Left Title & 3D Rendered Icons */}
          <div className="flex items-center space-x-4">
            {/* 3D Coffee Cup Icon */}
            <div className="relative w-16 h-16 rounded-3xl overflow-hidden border-2 border-[#c9a265] shadow-xl shadow-[#c9a265]/30 flex-shrink-0 bg-[#0c1017] group">
              <img
                src={iconCoffee3d}
                alt="Xícara de Café 3D"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div>
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="text-2xl 2xl:text-3xl font-bold text-white tracking-tight font-serif">
                  Passagem de Plantão
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-gradient-to-r from-[#dfbe85]/20 to-[#c9a265]/20 border border-[#c9a265]/60 text-[#dfbe85] text-[11px] font-extrabold font-mono uppercase tracking-wider shadow">
                  Ícones 3D &bull; Papéis de Parede 4K 360°
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                Pastas Individuais dos Colaboradores &bull; Ambiente Virtual 360° em Ultra Definição 4K
              </p>
            </div>
          </div>

          {/* Right Action Bar & Operator Identity Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Active User Switcher Pill with 3D Badge */}
            <div className="flex items-center space-x-2.5 p-2 rounded-2xl bg-[#0a0f18]/95 border-2 border-[#2b3c58] shadow-xl">
              <div className="relative w-7 h-7 rounded-xl overflow-hidden border border-[#c9a265] flex-shrink-0">
                <img
                  src={iconBadge3d}
                  alt="Emblema 3D"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Operador Ativo:
                </span>
                <select
                  value={currentActiveUserId}
                  onChange={(e) => setCurrentActiveUserId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-[#dfbe85] focus:outline-none cursor-pointer pr-3 font-serif"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id} className="bg-[#0c1017] text-white">
                      {u.nome} ({u.funcao} - {u.turno})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Add User / Pasta Button */}
            <button
              onClick={() => {
                setEditingUser(null);
                setIsUserModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs flex items-center space-x-2 shadow-xl shadow-[#c9a265]/25 transition-all cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Adicionar Usuário / Pasta</span>
            </button>
          </div>
        </div>

        {/* 3D KPI Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 mt-5 border-t border-[#253347]">
          <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-[#0a0f18]/70 border border-[#202d42]">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#c9a265]/50 flex-shrink-0">
              <img
                src={iconFolder3d}
                alt="Pasta 3D"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white font-mono">{users.length} Pastas</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Mural Coletivo</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-[#0a0f18]/70 border border-[#202d42]">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/50 flex-shrink-0">
              <img
                src={iconCoffee3d}
                alt="Resumos 3D"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-amber-300 font-mono">{totalSummaries} Resumos</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Passagens Registradas</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-[#0a0f18]/70 border border-[#202d42]">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-red-500/50 flex-shrink-0">
              <img
                src={iconTruck3d}
                alt="Caminhão 3D"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-red-300 font-mono">{totalOccurrences} Ocorrências</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Em Monitoramento</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-2.5 rounded-2xl bg-[#0a0f18]/70 border border-[#202d42]">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/50 flex-shrink-0">
              <img
                src={iconBadge3d}
                alt="Emblema 3D"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-300 font-mono">{totalChecklists} Checklists</div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Rotinas Concluídas</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D 360° Interactive Ultra HD 4K Viewer Canvas */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#dfbe85] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#c9a265]" />
            <span>Ambiente Virtual 360° em 4K &bull; {activeWallpaperTheme.name}</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Move3D className="w-3.5 h-3.5 text-[#dfbe85]" />
            <span>Interativo 3D: arraste com o mouse para girar 360 graus</span>
          </div>
        </div>

        {/* 360 Interactive WebGL Three.js Component with 4K Texture Support */}
        <FestivalCafe360Viewer
          activeTheme={activeWallpaperTheme}
          onSelectHotspot={(hotspot) => {
            if (hotspot === 'mural') {
              const el = document.getElementById('mural-pastas-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </div>


      {/* Section Header: Mural 3D de Pastas */}
      <div id="mural-pastas-section" className="relative z-10 pt-2 space-y-4">
        {/* Controls, View Switcher & Search Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#0f141f]/95 border-2 border-[#1e283b] shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center space-x-3">
              {/* 3D Folder Icon for Section */}
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#c9a265] shadow flex-shrink-0">
                <img
                  src={iconFolder3d}
                  alt="Pasta 3D"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-serif flex items-center space-x-2">
                  <span>Mural 3D &bull; Pastas dos Colaboradores</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pastas individuais vinculadas. Visualização coletiva com permissões exclusivas do proprietário.
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-[#141b28] border border-[#232f45] p-1 self-start md:self-auto shadow-inner">
              <button
                onClick={() => setViewMode('mural3d')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  viewMode === 'mural3d'
                    ? 'bg-[#c9a265] text-[#140e06] font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Move3D className="w-3.5 h-3.5" />
                <span>Mural 3D</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#c9a265] text-[#140e06] font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grade Executiva</span>
              </button>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
            {/* Search Input */}
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por colaborador ou função..."
                className="w-full pl-9 pr-4 py-2 bg-[#090d14] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
              />
            </div>

            {/* Turno Filter */}
            <div className="sm:col-span-3">
              <select
                value={filterTurno}
                onChange={(e) => setFilterTurno(e.target.value)}
                className="w-full px-3 py-2 bg-[#090d14] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-slate-200 focus:outline-none transition-all"
              >
                <option value="all">Todos os Turnos (A, B, A e B)</option>
                <option value="Turno A">Turno A</option>
                <option value="Turno B">Turno B</option>
                <option value="Turno A e B">Turno A e B</option>
              </select>
            </div>

            {/* Período Filter */}
            <div className="sm:col-span-3">
              <select
                value={filterPeriodo}
                onChange={(e) => setFilterPeriodo(e.target.value)}
                className="w-full px-3 py-2 bg-[#090d14] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-slate-200 focus:outline-none transition-all"
              >
                <option value="all">Todos os Períodos</option>
                <option value="Diurno">Diurno (06:00 às 18:00)</option>
                <option value="Noturno">Noturno (18:00 às 06:00)</option>
              </select>
            </div>

            {/* Função Filter */}
            <div className="sm:col-span-2">
              <select
                value={filterFuncao}
                onChange={(e) => setFilterFuncao(e.target.value)}
                className="w-full px-3 py-2 bg-[#090d14] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-slate-200 focus:outline-none transition-all"
              >
                <option value="all">Todas Funções</option>
                <option value="Líder">Líder</option>
                <option value="Interino">Interino</option>
                <option value="Operador">Operador</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Users Count Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div>
            Exibindo <span className="font-bold text-white">{filteredUsers.length}</span> pastas 3D de colaboradores
          </div>
          <div className="text-[11px] text-[#dfbe85] flex items-center space-x-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-[#c9a265]" />
            <span>Permissões individuais ativas &bull; Visualização coletiva</span>
          </div>
        </div>

        {/* 3D Mural Display */}
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#0e131d] border border-[#1e283b] space-y-2">
            <Folder className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              Nenhuma pasta encontrada para os filtros selecionados.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterTurno('all');
                setFilterPeriodo('all');
                setFilterFuncao('all');
              }}
              className="text-[#c9a265] text-xs font-bold hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ${
              viewMode === 'mural3d' ? 'perspective-1000' : ''
            }`}
          >
            {filteredUsers.map((user) => (
              <UserFolderCard
                key={user.id}
                user={user}
                items={items}
                currentActiveUserId={currentActiveUserId}
                onOpenFolder={(u) => {
                  setSelectedFolderUser(u);
                  setIsFolderModalOpen(true);
                }}
                onEditUser={(u) => {
                  setEditingUser(u);
                  setIsUserModalOpen(true);
                }}
                onDeleteUser={handleDeleteUser}
                viewStyle={viewMode === 'mural3d' ? '3d' : 'classic'}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Folder Detail Modal */}
      {selectedFolderUser && (
        <FolderDetailModal
          isOpen={isFolderModalOpen}
          onClose={() => {
            setIsFolderModalOpen(false);
            setSelectedFolderUser(null);
          }}
          user={selectedFolderUser}
          items={items}
          currentActiveUserId={currentActiveUserId}
          onAddItem={(u) => {
            setUserForNewItem(u);
            setEditingItem(null);
            setIsAddItemModalOpen(true);
          }}
          onEditItem={(item) => {
            setUserForNewItem(selectedFolderUser);
            setEditingItem(item);
            setIsAddItemModalOpen(true);
          }}
          onDeleteItem={handleDeleteItem}
          onToggleChecklist={handleToggleChecklist}
        />
      )}

      {/* 2. User Management Modal (Add/Edit) */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editingUser={editingUser}
      />

      {/* 3. Add/Edit Folder Item Modal */}
      {userForNewItem && (
        <AddFolderItemModal
          isOpen={isAddItemModalOpen}
          onClose={() => {
            setIsAddItemModalOpen(false);
            setUserForNewItem(null);
            setEditingItem(null);
          }}
          onSave={handleSaveItem}
          user={userForNewItem}
          editingItem={editingItem}
        />
      )}
    </div>
  );
}
