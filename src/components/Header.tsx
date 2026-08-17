import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Shield,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  AlertTriangle,
  Sun,
  Moon,
  Sunset,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { getCurrentUser, User as AuthUser } from '../lib/authStore';

interface HeaderProps {
  onOpenAlerts: () => void;
  onOpenSafetyStatus: () => void;
  onLogout?: () => void;
  onOpenPerfil?: () => void;
  onOpenConfig?: () => void;
}

export function Header({ onOpenAlerts, onOpenSafetyStatus, onLogout, onOpenPerfil, onOpenConfig }: HeaderProps) {
  const [time, setTime] = useState('06:32');
  const [greeting, setGreeting] = useState('');
  const [subGreeting, setSubGreeting] = useState('');
  const [GreetingIcon, setGreetingIcon] = useState(() => Sun);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const fetchUser = () => {
    setCurrentUser(getCurrentUser());
  };

  useEffect(() => {
    fetchUser();
    window.addEventListener('auth-user-updated', fetchUser);
    return () => {
      window.removeEventListener('auth-user-updated', fetchUser);
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erro ao tentar ativar tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Erro ao sair da tela cheia: ${err.message}`);
      });
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      
      let newGreeting = '';
      let newSubGreeting = '';
      let Icon = Sun;
      
      const userName = currentUser?.fixedName ? currentUser.fixedName.split(' ')[0] : 'Usuário';

      if (hours >= 0 && hours < 12) {
        newGreeting = `Bom dia, ${userName}`;
        newSubGreeting = 'Tenha um ótimo dia de trabalho!';
        Icon = Sun;
      } else if (hours >= 12 && hours < 18) {
        newGreeting = `Boa tarde, ${userName}`;
        newSubGreeting = 'Tenha um ótimo dia de trabalho!';
        Icon = Sunset;
      } else {
        newGreeting = `Boa noite, ${userName}`;
        newSubGreeting = 'Tenha um ótimo dia de trabalho!';
        Icon = Moon;
      }

      setGreeting(newGreeting);
      setSubGreeting(newSubGreeting);
      setGreetingIcon(() => Icon);

      const displayHours = String(hours).padStart(2, '0');
      const displayMinutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${displayHours}:${displayMinutes}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [currentUser]);

  const notificationList: Array<{
    id: number;
    title: string;
    unit: string;
    time: string;
    level: 'critical' | 'warning' | 'info';
  }> = [];

  return (
    <header className="h-16 2xl:h-18 border-b border-[#1f2737] flex items-center justify-between px-6 2xl:px-8 bg-[#0c1017] z-30 flex-shrink-0 select-none">
      {/* Left Area: Greeting & Metas */}
      <div className="flex items-center space-x-8 2xl:space-x-12">
        {/* User Greeting */}
        <div className="flex items-center space-x-3">
          <GreetingIcon className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#c9a265] flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-[13px] 2xl:text-[14px] font-bold text-[#f1f5f9]">{greeting}</span>
            <span className="text-[11px] 2xl:text-[12px] text-[#94a3b8]">{subGreeting}</span>
          </div>
        </div>

        {/* Metas: Date, Clock */}
        <div className="flex items-center space-x-6 2xl:space-x-8 text-xs 2xl:text-sm text-[#94a3b8]">
          <div className="hidden sm:flex items-center space-x-2 text-[#94a3b8]">
            <Calendar className="w-3.5 h-3.5 text-[#c9a265] flex-shrink-0" />
            <span className="font-medium text-[12px] 2xl:text-[13px] text-[#cbd5e1]">16 de Agosto, 2026</span>
          </div>

          <div className="flex items-center space-x-2 text-[#94a3b8]">
            <Clock className="w-3.5 h-3.5 text-[#c9a265] flex-shrink-0" />
            <span className="font-semibold text-[12px] 2xl:text-[13px] text-[#f1f5f9] tracking-wider">{time}</span>
          </div>

          {/* Top Fullscreen toggle button */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#151b26] hover:bg-black border border-[#c9a265]/40 hover:border-[#c9a265] text-[#dfbe85] hover:text-white transition-all duration-300 shadow-lg cursor-pointer active:scale-95 text-[10px] font-black uppercase tracking-widest ml-1"
            title="Alternar Tela Cheia"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-[#c9a265]" />
                <span>SAIR</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-[#c9a265]" />
                <span>TELA CHEIA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Controls: Notifications, Profile */}
      <div className="flex items-center space-x-3.5 2xl:space-x-4">
        {/* Bell Icon with Red Dot */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-xl bg-[#151b26] border border-[#1f2737] hover:border-[#c9a265]/50 flex items-center justify-center text-[#94a3b8] hover:text-[#f1f5f9] transition-colors relative cursor-pointer"
            title="Notificações"
          >
            <Bell className="w-4 h-4" />
            {notificationList.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-[#0c1017]">
                {notificationList.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-[#151b26] border border-[#c9a265]/50 rounded-xl p-3.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1f2737]">
                <span className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wider">
                  Alertas em Aberto
                </span>
                <span className="text-[10px] bg-[#10241e] text-[#34d399] border border-[#10b981]/40 px-1.5 py-0.5 rounded font-bold">
                  0 Ativos
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll">
                {notificationList.length > 0 ? (
                  notificationList.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg bg-[#0c1017] border border-[#1f2737] hover:border-[#c9a265]/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setShowNotifications(false);
                        onOpenAlerts();
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-0.5">
                        <AlertTriangle className={`w-3.5 h-3.5 ${item.level === 'critical' ? 'text-[#ef4444]' : 'text-[#c9a265]'}`} />
                        <span className="text-xs font-semibold text-[#f1f5f9] truncate">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#94a3b8] pl-5">{item.unit} &bull; {item.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs text-[#94a3b8]">Nenhuma notificação no momento.</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setShowNotifications(false);
                  onOpenAlerts();
                }}
                className="w-full mt-2 py-1.5 text-center text-xs text-[#140e06] font-bold bg-gradient-to-r from-[#dfbe85] to-[#c9a265] rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
              >
                Ver Central de Alertas
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2.5 cursor-pointer py-1 px-2 rounded-xl hover:bg-[#151b26] transition-colors"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#c9a265] flex-shrink-0 bg-[#1e2533] shadow-md flex items-center justify-center">
              {currentUser?.profilePic ? (
                <img
                  src={currentUser.profilePic}
                  alt={currentUser.fixedName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-[#c9a265]" />
              )}
            </div>
            <div className="hidden lg:block text-left">
              <div className="flex items-center space-x-1">
                <p className="text-xs 2xl:text-sm font-semibold text-[#f1f5f9] leading-tight">
                  {currentUser?.fixedName || 'Carregando...'}
                </p>
                <ChevronDown className="w-3 h-3 text-[#94a3b8]" />
              </div>
              <p className="text-[10px] 2xl:text-[11px] text-[#94a3b8]">{currentUser?.role || ''}</p>
            </div>
          </div>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 w-48 bg-[#151b26] border border-[#c9a265]/50 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#1f2737]">
                <p className="text-xs font-bold text-[#f1f5f9]">{currentUser?.fixedName}</p>
                <p className="text-[10px] text-[#c9a265]">{currentUser?.role}</p>
              </div>
              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenPerfil?.();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-[#cbd5e1] hover:text-white hover:bg-[#1f2737] rounded-lg transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#c9a265]" />
                  <span>Perfil</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenConfig?.();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-[#cbd5e1] hover:text-white hover:bg-[#1f2737] rounded-lg transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-[#c9a265]" />
                  <span>Configurações</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout?.();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Encerrar Sessão</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}


