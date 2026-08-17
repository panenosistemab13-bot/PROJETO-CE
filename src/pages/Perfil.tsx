import React, { useState, useRef, useEffect } from 'react';
import { User, getAuthUsers, saveAuthUsers, updateCurrentUserSession, getCurrentUser } from '../lib/authStore';
import { Camera, Save, KeyRound, User as UserIcon, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export function Perfil() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState<string | undefined>();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setLogin(user.login);
      setPassword(user.password);
      setProfilePic(user.profilePic);
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!currentUser) return;
    if (!login.trim() || !password.trim()) {
      setErrorMsg('Login e senha são obrigatórios.');
      setSuccessMsg('');
      return;
    }

    const users = getAuthUsers();
    
    // Check if new login is already taken by another user
    if (login !== currentUser.login && users.some(u => u.login === login)) {
      setErrorMsg('Este login já está em uso.');
      setSuccessMsg('');
      return;
    }

    const updatedUser = { ...currentUser, login, password, profilePic };
    
    const newUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    
    saveAuthUsers(newUsers);
    updateCurrentUserSession(updatedUser);
    setCurrentUser(updatedUser);
    
    setSuccessMsg('Perfil atualizado com sucesso.');
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 3000);
    
    // Dispatch a custom event to notify Header of profile pic change
    window.dispatchEvent(new Event('auth-user-updated'));
  };

  if (!currentUser) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[#0c1017]/85 border border-[#c9a265]/40 p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a265] to-transparent" />
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Meu Perfil</h2>
          <p className="text-xs text-slate-400">Gerencie suas credenciais de acesso.</p>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-8 relative">
          <div 
            className="w-24 h-24 rounded-full border-2 border-[#c9a265] bg-[#121824] flex items-center justify-center overflow-hidden mb-3 relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {profilePic ? (
              <img src={profilePic} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-8 h-8 text-[#c9a265]/50" />
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-200">{currentUser.fixedName}</p>
            <p className="text-xs text-[#c9a265] uppercase tracking-wider">{currentUser.role}</p>
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-center space-x-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Novo Login</label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-400">
                <UserIcon className="w-4 h-4 text-[#c9a265]" />
              </div>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#141b26]/90 border border-[#242d3d] focus:border-[#c9a265] text-sm text-slate-100 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Nova Senha</label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-slate-400">
                <KeyRound className="w-4 h-4 text-[#c9a265]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#141b26]/90 border border-[#242d3d] focus:border-[#c9a265] text-sm text-slate-100 outline-none"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-[#c9a265] transition-colors"
                title={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] text-[#140e06] font-bold text-sm flex items-center justify-center space-x-2 hover:opacity-95 transition-opacity"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>
    </div>
  );
}
