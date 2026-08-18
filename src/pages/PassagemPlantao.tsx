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
} from 'lucide-react';

import { PlantaoUser, PlantaoFolderItem, FuncaoType, TurnoType, PeriodoType } from '../types/plantao3d';
import { INITIAL_PLANTAO_USERS, INITIAL_PLANTAO_ITEMS } from '../data/initialPlantaoUsers';
import { FestivalCafe360Viewer } from '../components/plantao3d/FestivalCafe360Viewer';
import { UserFolderCard } from '../components/plantao3d/UserFolderCard';
import { FolderDetailModal } from '../components/plantao3d/FolderDetailModal';
import { UserManagementModal } from '../components/plantao3d/UserManagementModal';
import { AddFolderItemModal } from '../components/plantao3d/AddFolderItemModal';

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

  // View Mode: 'mural3d' | '360full' | 'grid'
  const [viewMode, setViewMode] = useState<'mural3d' | 'grid' | '360panorama'>('mural3d');

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

  return (
    <div className="space-y-6 pb-14 animate-fade-in text-slate-200">
      {/* Top Hero Banner: Passagem de Plantão & Festival 3corações */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#17130e] via-[#111724] to-[#0c1017] border border-[#c9a265]/40 shadow-2xl overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-full bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,101,0.2),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Left Title & 3corações Coffee Festival Badge */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9a265] to-[#8c672b] flex items-center justify-center shadow-lg shadow-[#c9a265]/30 flex-shrink-0">
                <Coffee className="w-6 h-6 text-[#120e06] stroke-[2.3]" />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="text-2xl 2xl:text-3xl font-bold text-white tracking-tight font-serif">
                    Passagem de Plantão
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c9a265]/20 border border-[#c9a265]/50 text-[#dfbe85] text-[10.5px] font-bold font-mono uppercase tracking-wider">
                    Mural 3D & 360°
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
                  Pastas Individuais dos Colaboradores &bull; Ambiente Virtual do Festival do Café 3corações em 360°
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Bar & Operator Identity Selector */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Active User Switcher Pill */}
            <div className="flex items-center space-x-2.5 p-2 rounded-2xl bg-[#0a0f18]/90 border border-[#2b3c58] shadow-lg">
              <div className="flex items-center space-x-2 px-2 py-1 rounded-xl bg-[#141b27] border border-[#232f45]">
                <User className="w-4 h-4 text-[#c9a265]" />
                <span className="text-[11px] font-bold text-slate-300">Você está como:</span>
              </div>
              <select
                value={currentActiveUserId}
                onChange={(e) => setCurrentActiveUserId(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#dfbe85] focus:outline-none cursor-pointer pr-3"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#0c1017] text-white">
                    {u.nome} ({u.funcao} - {u.turno})
                  </option>
                ))}
              </select>
            </div>

            {/* Add User / Pasta Button */}
            <button
              onClick={() => {
                setEditingUser(null);
                setIsUserModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 text-[#140e06] font-bold text-xs flex items-center space-x-2 shadow-lg shadow-[#c9a265]/25 transition-all cursor-pointer active:scale-95"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>+ Adicionar Usuário / Pasta</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3D 360° Interactive Festival do Café Viewer Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#dfbe85] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#c9a265]" />
            <span>Ambiente Virtual 360° &bull; Festival do Café 3corações</span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <Move3D className="w-3.5 h-3.5 text-[#dfbe85]" />
            <span>Interativo: arraste para girar em 360 graus</span>
          </div>
        </div>

        {/* 360 Interactive Component with Three.js */}
        <FestivalCafe360Viewer
          onSelectHotspot={(hotspot) => {
            if (hotspot === 'mural') {
              const el = document.getElementById('mural-pastas-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </div>

      {/* Section Header: Mural 3D de Pastas */}
      <div id="mural-pastas-section" className="pt-2 space-y-4">
        {/* Controls, View Switcher & Search Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0f141f] border border-[#1e283b] shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white font-serif flex items-center space-x-2">
                <Folder className="w-5 h-5 text-[#c9a265] fill-[#c9a265]/20" />
                <span>Mural 3D &bull; Pastas dos Colaboradores</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pastas individuais vinculadas. Todos os colaboradores podem visualizar o mural completo.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-[#141b28] border border-[#232f45] p-1 self-start md:self-auto">
              <button
                onClick={() => setViewMode('mural3d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
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
                className="w-full pl-9 pr-4 py-2 bg-[#090d14] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
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
            Exibindo <span className="font-bold text-white">{filteredUsers.length}</span> pastas de colaboradores
          </div>
          <div className="text-[11px] text-[#dfbe85] flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-[#c9a265]" />
            <span>Permissões individuais ativas &bull; Visualização coletiva</span>
          </div>
        </div>

        {/* 3D Mural or Grid Display */}
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
              className="text-[#c9a265] text-xs font-bold hover:underline"
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
