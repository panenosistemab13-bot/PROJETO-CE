import React from 'react';
import {
  Home,
  Truck,
  Users,
  ArrowRight,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import medallionImg from '../assets/images/medallion_dark_3c_1786935069743.jpg';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPromo: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, onOpenPromo, isCollapsed, setIsCollapsed }: SidebarProps) {
  const navItems = [
    { id: 'menu_inicial', label: 'Menu Inicial', icon: Home },
    { id: 'veiculos', label: 'Veículos', icon: Truck },
    { id: 'colaboradores', label: 'Colaboradores', icon: Users },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-[72px]' : 'w-[245px] 2xl:w-[265px]'} bg-[#0c1017] border-r border-[#1e2533] flex flex-col h-full flex-shrink-0 select-none z-20 overflow-visible relative shadow-2xl transition-all duration-300 ease-in-out`}>
      
      {/* Absolute floating toggle handle on the right edge */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#151b26] border border-[#c9a265] flex items-center justify-center text-[#dfbe85] hover:text-white hover:bg-[#c9a265]/20 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all z-50 cursor-pointer active:scale-90"
        title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4 text-[#c9a265]" /> : <ChevronLeft className="w-4 h-4 text-[#c9a265]" />}
      </button>

      {/* Top Logo */}
      <div className={`pt-5 pb-3 flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-5 space-x-2.5'}`}>
        <div className="w-9 h-9 rounded-full border border-[#c9a265] flex items-center justify-center flex-shrink-0 bg-gradient-to-b from-[#241e15] to-[#120f0a] shadow-md">
          <Heart className="w-5 h-5 text-[#c9a265] fill-[#c9a265]/20 stroke-[1.8]" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="text-[10px] tracking-[0.2em] text-[#c9a265] uppercase font-bold leading-none">
              CAFÉ
            </span>
            <span className="font-serif text-sm 2xl:text-base text-[#e2e8f0] font-semibold tracking-tight">
              três corações
            </span>
          </div>
        )}
      </div>

      {/* 3D Gold Concentric Medallion Banner */}
      <div className={`py-2 flex flex-col items-center ${isCollapsed ? 'px-2' : 'px-5'}`}>
        <div className={`${isCollapsed ? 'w-10 h-10' : 'w-32 h-32 2xl:w-36 2xl:h-36'} rounded-full p-0.5 relative group cursor-pointer transition-all duration-300 hover:scale-105 shadow-2xl`}>
          {/* Outer glow rings */}
          <div className="absolute inset-0 rounded-full bg-[#c9a265]/25 blur-md pointer-events-none"></div>

          {/* Medallion Image */}
          <div className="w-full h-full rounded-full overflow-hidden border border-[#c9a265]/60 shadow-[0_4px_20px_rgba(0,0,0,0.8)] relative bg-[#10141d]">
            <img
              src={medallionImg}
              alt="Medalhão 3C Três Corações"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 custom-scroll">
        {!isCollapsed ? (
          <p className="text-[10px] text-[#c9a265]/80 font-bold tracking-[0.2em] uppercase mb-2 px-3 animate-fade-in">
            PAINEL DE CONTROLE
          </p>
        ) : (
          <div className="h-4" />
        )}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center transition-all group cursor-pointer ${
                  isCollapsed 
                    ? 'justify-center p-3 rounded-xl' 
                    : 'px-3.5 py-2.5 rounded-xl text-xs font-medium'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] text-[#140e06] font-bold shadow-md shadow-[#c9a265]/20'
                    : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#151b26]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isCollapsed ? '' : 'mr-3'
                  } ${
                    isActive ? 'text-[#140e06]' : 'text-[#64748b] group-hover:text-[#c9a265]'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate text-left text-[11.5px] 2xl:text-[12.5px] animate-fade-in">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promo Card with Coffee Cup & "SAIBA MAIS" */}
      {!isCollapsed && (
        <div className="p-4 border-t border-[#1e2533] bg-[#0c1017] animate-fade-in">
          <div
            onClick={onOpenPromo}
            className="bg-[#151c28] hover:bg-[#1e293b] rounded-xl p-4 border border-[#c9a265]/30 flex flex-row items-center shadow-lg relative overflow-hidden group cursor-pointer transition-all"
          >
            {/* Subtle background texture/gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#c9a265]/5 to-transparent pointer-events-none" />
            
            {/* Santa Clara Logo Area */}
            <div className="flex flex-col items-center flex-shrink-0 w-16 relative z-10">
              <span className="text-[6.5px] text-[#c9a265] font-serif uppercase tracking-[0.2em] leading-none mb-0.5">
                CAFÉ
              </span>
              <span className="text-[12px] text-[#dfbe85] font-serif font-bold leading-none tracking-tight">
                SANTA
              </span>
              <span className="text-[12px] text-[#dfbe85] font-serif font-bold leading-none tracking-tight">
                CLARA
              </span>
              
              {/* SVG Leaves and Cherries */}
              <svg viewBox="0 0 60 50" className="w-10 h-8 mt-1">
                {/* Left outer leaf */}
                <path d="M 12 10 Q 0 30 30 50 Q 22 35 22 20 Q 22 10 12 10" fill="#143c16"/>
                {/* Left inner leaf */}
                <path d="M 18 15 Q 10 35 30 50 Q 26 38 26 25 Q 26 15 18 15" fill="#2e7d32"/>
                {/* Right outer leaf */}
                <path d="M 48 10 Q 60 30 30 50 Q 38 35 38 20 Q 38 10 48 10" fill="#143c16"/>
                {/* Right inner leaf */}
                <path d="M 42 15 Q 50 35 30 50 Q 34 38 34 25 Q 34 15 42 15" fill="#2e7d32"/>
                
                {/* Center leaves */}
                <path d="M 24 20 Q 20 35 30 50 Q 28 35 28 25 Q 28 20 24 20" fill="#4caf50"/>
                <path d="M 36 20 Q 40 35 30 50 Q 32 35 32 25 Q 32 20 36 20" fill="#4caf50"/>

                {/* Coffee Cherries */}
                <circle cx="30" cy="40" r="4.5" fill="#e11d48"/>
                <circle cx="23" cy="32" r="4" fill="#e11d48"/>
                <circle cx="37" cy="32" r="4" fill="#e11d48"/>
                <circle cx="26" cy="23" r="3.5" fill="#e11d48"/>
                <circle cx="34" cy="23" r="3.5" fill="#e11d48"/>
              </svg>
            </div>

            {/* Text & Button Area */}
            <div className="flex-1 ml-3 flex flex-col justify-center relative z-10">
              <p className="text-[11px] 2xl:text-[12px] text-[#cbd5e1] font-serif leading-snug">
                Tradição que acorda.
              </p>
              <p className="text-[11px] 2xl:text-[12px] text-[#cbd5e1] font-serif leading-snug mb-2.5">
                Qualidade que<br/>inspira confiança.
              </p>
              <div className="inline-flex items-center justify-center space-x-1.5 px-3 py-1 rounded-full border border-[#c9a265] text-[#c9a265] text-[9px] font-bold uppercase tracking-widest w-max transition-colors group-hover:bg-[#c9a265]/10">
                <span>SAIBA MAIS</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}



