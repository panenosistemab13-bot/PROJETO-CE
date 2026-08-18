import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MenuInicial } from './pages/MenuInicial';
import { Veiculos } from './pages/Veiculos';
import { Colaboradores } from './pages/Colaboradores';
import { PassagemPlantao } from './pages/PassagemPlantao';
import { Login360 } from './pages/Login360';
import { Perfil } from './pages/Perfil';
import { Configuracoes } from './pages/Configuracoes';

// Modals
import { NewIncidentModal } from './components/modals/NewIncidentModal';
import { CameraMonitorModal } from './components/modals/CameraMonitorModal';
import { ShiftHandoverModal } from './components/modals/ShiftHandoverModal';
import { PatrolsModal } from './components/modals/PatrolsModal';
import { TeamLeadersModal } from './components/modals/TeamLeadersModal';
import { AnalyticsModal } from './components/modals/AnalyticsModal';
import { AllAlertsModal } from './components/modals/AllAlertsModal';
import { SafetyAuditModal } from './components/modals/SafetyAuditModal';
import { PromoModal } from './components/modals/PromoModal';
import { User as AuthUser } from './lib/authStore';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cco_auth_logged_in') === 'true';
  });
  const [activeTab, setActiveTab] = useState('menu_inicial');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modal states
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [isPatrolsOpen, setIsPatrolsOpen] = useState(false);
  const [isLeadersOpen, setIsLeadersOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  const handleLoginSuccess = (userData: AuthUser) => {
    localStorage.setItem('cco_auth_logged_in', 'true');
    localStorage.setItem('cco_user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setActiveTab('menu_inicial');
  };

  const handleLogout = () => {
    localStorage.removeItem('cco_auth_logged_in');
    setIsAuthenticated(false);
  };

  // KPI card click handler
  const handleKpiClick = (type: string) => {
    if (type === 'ocorrencias') setIsNewIncidentOpen(true);
    if (type === 'rondas') setIsPatrolsOpen(true);
    if (type === 'equipes') setIsLeadersOpen(true);
    if (type === 'alertas') setIsAlertsOpen(true);
    if (type === 'status') setIsSafetyOpen(true);
  };

  // If unauthenticated, show the 4K 3D 360-Degree Login Page
  if (!isAuthenticated) {
    return <Login360 onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="relative font-sans h-screen flex overflow-hidden w-full bg-[#0c1017] selection:bg-[#c9a265]/40 select-none text-slate-100">
      {/* Subtle radial ambient background glow (only on menu_inicial) */}
      {activeTab === 'menu_inicial' && (
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,162,101,0.08),rgba(255,255,255,0))] pointer-events-none" />
      )}

      {/* 1. LEFT SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPromo={() => setIsPromoOpen(true)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden min-w-0 bg-transparent">
        {/* Top Header Bar */}
        <Header
          onOpenAlerts={() => setIsAlertsOpen(true)}
          onOpenSafetyStatus={() => setIsSafetyOpen(true)}
          onLogout={handleLogout}
          onOpenPerfil={() => setActiveTab('perfil')}
          onOpenConfig={() => setActiveTab('configuracoes')}
        />

        {/* Scrollable Workspace Area */}
        <div id="main-scroll-container" className="flex-1 overflow-y-auto p-4 sm:p-6 2xl:p-8 custom-scroll">
          {activeTab === 'menu_inicial' && (
            <MenuInicial 
              onKpiClick={handleKpiClick} 
              onOpenAnalytics={() => setIsAnalyticsOpen(true)} 
            />
          )}
          
          {activeTab === 'veiculos' && (
            <Veiculos />
          )}

          {activeTab === 'colaboradores' && (
            <Colaboradores />
          )}

          {(activeTab === 'ocorrencias' || activeTab === 'passagem_plantao') && (
            <PassagemPlantao />
          )}

          {activeTab === 'perfil' && (
            <Perfil />
          )}

          {activeTab === 'configuracoes' && (
            <Configuracoes />
          )}
        </div>
      </main>

      {/* MODALS */}
      <NewIncidentModal
        isOpen={isNewIncidentOpen}
        onClose={() => setIsNewIncidentOpen(false)}
        onSuccess={(data) => {
          console.log('Novo incidente:', data);
        }}
      />

      <CameraMonitorModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
      />

      <ShiftHandoverModal
        isOpen={isShiftOpen}
        onClose={() => setIsShiftOpen(false)}
      />

      <PatrolsModal
        isOpen={isPatrolsOpen}
        onClose={() => setIsPatrolsOpen(false)}
      />

      <TeamLeadersModal
        isOpen={isLeadersOpen}
        onClose={() => setIsLeadersOpen(false)}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      <AllAlertsModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />

      <SafetyAuditModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
      />

      <PromoModal
        isOpen={isPromoOpen}
        onClose={() => setIsPromoOpen(false)}
      />
    </div>
  );
}


