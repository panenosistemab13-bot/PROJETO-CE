import React, { useState, useEffect } from 'react';
import { User, getAuthUsers, saveAuthUsers, getCurrentUser } from '../lib/authStore';
import { Settings, ShieldAlert, Plus, Edit2, Trash2, Save, X, KeyRound, User as UserIcon, CheckCircle2 } from 'lucide-react';

export function Configuracoes() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user?.role === 'Mestre') {
      setUsers(getAuthUsers());
    }
  }, []);

  if (currentUser?.role !== 'Mestre') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Acesso Negado</h2>
        <p className="text-slate-400 text-sm">Apenas o Usuário Mestre pode acessar esta página.</p>
      </div>
    );
  }

  const handleCreateNew = () => {
    setEditingUser({
      fixedName: '',
      login: '',
      password: '',
      role: 'Usuário Padrão',
    });
    setIsEditing(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (id === 'master') return; // Cannot delete master
    const confirm = window.confirm('Tem certeza que deseja excluir este usuário?');
    if (confirm) {
      const newUsers = users.filter(u => u.id !== id);
      setUsers(newUsers);
      saveAuthUsers(newUsers);
      setSuccessMsg('Usuário excluído.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleSave = () => {
    if (!editingUser?.fixedName || !editingUser?.login || !editingUser?.password) return;

    let newUsers = [...users];
    if (editingUser.id) {
      // Edit existing
      newUsers = newUsers.map(u => u.id === editingUser.id ? { ...u, ...editingUser } as User : u);
    } else {
      // Create new
      const newUser: User = {
        ...editingUser,
        id: `user_${Date.now()}`
      } as User;
      newUsers.push(newUser);
    }

    setUsers(newUsers);
    saveAuthUsers(newUsers);
    setIsEditing(false);
    setEditingUser(null);
    setSuccessMsg('Configurações salvas.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center space-x-3">
            <Settings className="w-6 h-6 text-[#c9a265]" />
            <span>Configurações do Sistema</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">Gerenciamento de contas e permissões (Acesso Mestre)</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-xl bg-[#c9a265] text-[#140e06] font-bold text-xs flex items-center space-x-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Usuário</span>
        </button>
      </div>

      {successMsg && (
        <div className="mb-6 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs flex items-center space-x-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {isEditing ? (
        <div className="bg-[#0c1017]/85 border border-[#c9a265]/30 rounded-2xl p-6 shadow-xl mb-8">
          <h3 className="text-lg font-bold text-white mb-6">
            {editingUser?.id ? 'Editar Usuário' : 'Criar Novo Usuário'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Nome Fixo (Exibição)</label>
              <input
                type="text"
                value={editingUser?.fixedName || ''}
                onChange={(e) => setEditingUser({ ...editingUser, fixedName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#141b26] border border-[#242d3d] focus:border-[#c9a265] text-sm text-white outline-none"
                placeholder="Ex: Jefferson"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Login</label>
              <input
                type="text"
                value={editingUser?.login || ''}
                onChange={(e) => setEditingUser({ ...editingUser, login: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#141b26] border border-[#242d3d] focus:border-[#c9a265] text-sm text-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Senha</label>
              <input
                type="text" // using text so master can see what they set
                value={editingUser?.password || ''}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#141b26] border border-[#242d3d] focus:border-[#c9a265] text-sm text-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Cargo / Função</label>
              <input
                type="text"
                value={editingUser?.role || ''}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#141b26] border border-[#242d3d] focus:border-[#c9a265] text-sm text-white outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-[#1f2737]">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-slate-300 font-semibold text-xs hover:bg-[#1f2737]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#c9a265] text-[#140e06] font-bold text-xs flex items-center space-x-2 hover:opacity-90"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Usuário</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#0c1017]/60 border border-[#1f2737] rounded-2xl overflow-hidden shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#121824] border-b border-[#1f2737] text-xs uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4 font-semibold">Nome (Fixo)</th>
                <th className="px-6 py-4 font-semibold">Login</th>
                <th className="px-6 py-4 font-semibold">Senha</th>
                <th className="px-6 py-4 font-semibold">Função</th>
                <th className="px-6 py-4 font-semibold text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-[#1f2737] hover:bg-[#151b26]/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-white font-medium flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#241e15] border border-[#c9a265]/30 flex items-center justify-center overflow-hidden">
                      {user.profilePic ? (
                        <img src={user.profilePic} alt="pic" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-[#c9a265]" />
                      )}
                    </div>
                    <span>{user.fixedName}</span>
                    {user.role === 'Mestre' && (
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#c9a265]/20 text-[#dfbe85] uppercase border border-[#c9a265]/40">Mestre</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300 font-mono">{user.login}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                    {user.role === 'Mestre' ? '••••••••' : user.password}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">{user.role}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="p-2 rounded-lg bg-[#1f2737] text-slate-300 hover:text-white hover:bg-[#c9a265]/20 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.id !== 'master' && (
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded-lg bg-[#1f2737] text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
