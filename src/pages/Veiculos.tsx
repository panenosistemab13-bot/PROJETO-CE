import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  Search, 
  Plus, 
  Truck, 
  Calendar, 
  Clock, 
  Hash, 
  Building2, 
  Eye, 
  EyeOff, 
  Pencil, 
  Trash2, 
  X, 
  MapPin, 
  ShieldCheck, 
  Filter, 
  CheckCircle2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import bgVeiculos from '../assets/images/eusebio_factory_ultra_hd_360_1786943148780.jpg';
import { ThreePanorama } from '../components/ThreePanorama';
import { LateralGoldScrollbar } from '../components/LateralGoldScrollbar';
import { getInitialVehicles, VehicleItem } from '../data/veiculosData';

export function Veiculos() {
  const [vehicles, setVehicles] = useState<VehicleItem[]>(() => getInitialVehicles());

  // Form states
  const [plateInput, setPlateInput] = useState('');
  const [fleetInput, setFleetInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<VehicleItem['category']>('Frota Própria 3C');
  const [statusInput, setStatusInput] = useState<VehicleItem['status']>('No Pátio');
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);

  // Filter & UI states
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [selectedFleetFilter, setSelectedFleetFilter] = useState<string>('all');
  const [hideContent, setHideContent] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  // Distinct fleets for quick filter pills
  const availableFleets = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.fleet) set.add(v.fleet);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateInput.trim() || !carrierInput.trim()) return;

    let formattedCarrier = carrierInput.trim();
    // Enforce 3C prefix rule if not already present and looks like city or contains city
    if (!formattedCarrier.startsWith('3C') && fleetInput && fleetInput.toUpperCase() === formattedCarrier.toUpperCase()) {
      formattedCarrier = `3C ${formattedCarrier}`;
    }

    if (editingVehicleId) {
      setVehicles(vehicles.map(v => v.id === editingVehicleId ? {
        ...v,
        plate: plateInput.toUpperCase().trim(),
        fleet: fleetInput.toUpperCase().trim() || 'LOGÍSTICA',
        carrier: formattedCarrier,
        category: categoryInput,
        status: statusInput
      } : v));
      setEditingVehicleId(null);
      setPlateInput('');
      setFleetInput('');
      setCarrierInput('');
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const newVehicle: VehicleItem = {
      id: `v-${Date.now()}-${plateInput.toUpperCase().trim()}`,
      plate: plateInput.toUpperCase().trim(),
      fleet: fleetInput.toUpperCase().trim() || 'LOGÍSTICA',
      carrier: formattedCarrier,
      category: formattedCarrier.startsWith('3C') ? (formattedCarrier.includes('DEDICADO') ? 'Dedicado 3C' : 'Frota Própria 3C') : 'Transportadora Parceira',
      dateAdded: dateStr,
      timeAdded: timeStr,
      status: statusInput,
    };

    setVehicles([newVehicle, ...vehicles]);
    setPlateInput('');
    setFleetInput('');
    setCarrierInput('');
    setCurrentPage(1);
  };

  const handleEditVehicle = (vehicle: VehicleItem) => {
    setEditingVehicleId(vehicle.id);
    setPlateInput(vehicle.plate);
    setFleetInput(vehicle.fleet);
    setCarrierInput(vehicle.carrier);
    setCategoryInput(vehicle.category);
    setStatusInput(vehicle.status);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
    if (editingVehicleId === id) {
      setEditingVehicleId(null);
      setPlateInput('');
      setFleetInput('');
      setCarrierInput('');
    }
  };

  const handleCancelEdit = () => {
    setEditingVehicleId(null);
    setPlateInput('');
    setFleetInput('');
    setCarrierInput('');
  };

  // Filtered vehicles logic
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      const matchesSearch = 
        v.plate.toLowerCase().includes(searchFilter.toLowerCase()) ||
        v.carrier.toLowerCase().includes(searchFilter.toLowerCase()) ||
        v.fleet.toLowerCase().includes(searchFilter.toLowerCase());

      const matchesCategory = 
        selectedCategoryTab === 'all' || 
        (selectedCategoryTab === '3c' && v.carrier.startsWith('3C')) ||
        (selectedCategoryTab === 'terceiros' && !v.carrier.startsWith('3C')) ||
        (selectedCategoryTab === 'dedicados' && v.carrier.includes('DEDICADO'));

      const matchesFleet = 
        selectedFleetFilter === 'all' || 
        v.fleet.toUpperCase() === selectedFleetFilter.toUpperCase();

      return matchesSearch && matchesCategory && matchesFleet;
    });
  }, [vehicles, searchFilter, selectedCategoryTab, selectedFleetFilter]);

  // Paginated vehicles
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage, itemsPerPage]);

  // KPIs
  const stats = useMemo(() => {
    const total = vehicles.length;
    const total3C = vehicles.filter(v => v.carrier.startsWith('3C')).length;
    const totalParceiros = vehicles.filter(v => !v.carrier.startsWith('3C')).length;
    const totalNoPatio = vehicles.filter(v => v.status === 'No Pátio').length;
    const uniqueCarriers = new Set(vehicles.map(v => v.carrier)).size;
    return { total, total3C, totalParceiros, totalNoPatio, uniqueCarriers };
  }, [vehicles]);

  // ECharts Top Carriers distribution
  const topCarriersData = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      counts[v.carrier] = (counts[v.carrier] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [vehicles]);

  const chartOptions = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(10, 14, 22, 0.95)',
        borderColor: '#c9a265',
        borderWidth: 1,
        padding: [10, 14],
        textStyle: { color: '#ffffff', fontSize: 13, fontWeight: 500 },
        formatter: '{b}: <strong style="color:#dfbe85">{c} veículo(s)</strong> ({d}%)',
      },
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        bottom: 0,
        textStyle: {
          color: '#cbd5e1',
          fontSize: 11,
          fontWeight: 600,
        },
        pageTextStyle: { color: '#c9a265' },
        itemGap: 10,
        itemWidth: 10,
        itemHeight: 10,
      },
      series: [
        {
          name: 'Top Transportadoras',
          type: 'pie',
          radius: ['35%', '65%'],
          center: ['50%', '42%'],
          roseType: 'radius',
          itemStyle: {
            borderRadius: 6,
            borderColor: '#0c1017',
            borderWidth: 2,
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.8)',
          },
          label: {
            show: true,
            color: '#f8fafc',
            fontWeight: 'bold',
            fontSize: 10,
            formatter: '{b}\n({c})',
            backgroundColor: 'rgba(12, 16, 23, 0.85)',
            borderColor: '#c9a265',
            borderWidth: 1,
            borderRadius: 4,
            padding: [3, 5],
          },
          labelLine: {
            lineStyle: {
              color: '#c9a265',
              width: 1,
            },
            smooth: 0.2,
            length: 8,
            length2: 10,
          },
          data: topCarriersData.map((item, index) => {
            const colors = [
              { top: '#dfbe85', bottom: '#a37c3f' }, // Gold
              { top: '#38bdf8', bottom: '#0369a1' }, // Sky
              { top: '#34d399', bottom: '#047857' }, // Emerald
              { top: '#a78bfa', bottom: '#6d28d9' }, // Purple
              { top: '#fb7185', bottom: '#be123c' }, // Rose
              { top: '#fb923c', bottom: '#c2410c' }, // Orange
              { top: '#facc15', bottom: '#a16207' }, // Yellow
              { top: '#818cf8', bottom: '#4338ca' }, // Indigo
              { top: '#2dd4bf', bottom: '#0f766e' }, // Teal
              { top: '#94a3b8', bottom: '#475569' }, // Slate
            ];
            const color = colors[index % colors.length];
            return {
              value: item.value,
              name: item.name,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: color.top },
                    { offset: 1, color: color.bottom }
                  ]
                }
              }
            };
          }),
        }
      ]
    };
  }, [topCarriersData]);

  return (
    <div className="max-w-[2560px] mx-auto flex flex-col gap-6 relative z-10 select-none pb-16">
      {/* Lateral Golden Scrollbar matching the reference image */}
      <LateralGoldScrollbar />

      {/* 3D 360-Degree Panoramic Interactive Background */}
      <ThreePanorama imageUrl={bgVeiculos} interactive={hideContent} />

      {/* Subtle vignette layer to enhance contrast */}
      <div className={`fixed inset-0 z-[-1] pointer-events-none bg-black/35 backdrop-blur-[1px] transition-all duration-1000 ${hideContent ? 'bg-transparent backdrop-blur-none' : ''}`} />

      {/* 3D External Container Hooks for Three.js / Spline models */}
      <div id="3d-vehicle-container" className="fixed right-0 top-0 bottom-0 w-1/4 pointer-events-none z-0" />
      <div id="3d-cup-container" className="fixed left-0 bottom-0 w-1/6 pointer-events-none z-0" />

      {/* Top Header & Wallpaper Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-40 relative">
        <div>
          <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-serif font-black text-white tracking-wide flex items-center gap-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#dfbe85] to-[#a37c3f] flex items-center justify-center shadow-lg shadow-[#c9a265]/30">
              <Truck className="w-5 h-5 text-[#0c1017]" />
            </div>
            <span>Gestão de Frota & Veículos</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mt-1">
            Controle integrado da Frota Própria 3corações, Frotas Regionais e Transportadoras Parceiras
          </p>
        </div>

        {/* View Toggle */}
        <button
          onClick={() => setHideContent(!hideContent)}
          className="flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-black/70 hover:bg-black/95 border border-[#c9a265]/60 hover:border-[#c9a265] text-[#dfbe85] hover:text-white transition-all duration-300 shadow-2xl backdrop-blur-md cursor-pointer active:scale-95 text-xs font-bold uppercase tracking-wider"
        >
          {hideContent ? (
            <>
              <Eye className="w-4 h-4 text-[#c9a265] animate-pulse" />
              <span>Mostrar Controles</span>
            </>
          ) : (
            <>
              <EyeOff className="w-4 h-4 text-[#c9a265]" />
              <span>Ver Apenas 360°</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3.5 transition-all duration-500 ${hideContent ? 'opacity-0 scale-95 pointer-events-none' : ''}`}>
        <div className="bg-[#0c1017]/85 backdrop-blur-md border border-[#1e293b] hover:border-[#c9a265]/50 p-4 rounded-2xl shadow-xl flex items-center justify-between transition-all">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">Total de Veículos</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5 block">{stats.total}</span>
            <span className="text-[10px] text-[#c9a265] font-semibold flex items-center gap-1 mt-0.5">
              <Sparkles className="w-3 h-3" /> Base Completa Cadastrada
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#c9a265]/10 border border-[#c9a265]/30 flex items-center justify-center text-[#dfbe85]">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0c1017]/85 backdrop-blur-md border border-[#1e293b] hover:border-[#dfbe85]/50 p-4 rounded-2xl shadow-xl flex items-center justify-between transition-all">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">Frota 3corações</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#dfbe85] mt-0.5 block">{stats.total3C}</span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3" /> Própria + Dedicada
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#dfbe85]">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0c1017]/85 backdrop-blur-md border border-[#1e293b] hover:border-blue-500/50 p-4 rounded-2xl shadow-xl flex items-center justify-between transition-all">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">Parceiros & Terceiros</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-sky-300 mt-0.5 block">{stats.totalParceiros}</span>
            <span className="text-[10px] text-sky-400 font-semibold flex items-center gap-1 mt-0.5">
              <Layers className="w-3 h-3" /> {stats.uniqueCarriers} Transportadoras
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0c1017]/85 backdrop-blur-md border border-[#1e293b] hover:border-emerald-500/50 p-4 rounded-2xl shadow-xl flex items-center justify-between transition-all">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">Status no Pátio</span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-0.5 block">{stats.totalNoPatio}</span>
            <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Monitoramento Ativo
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Top Section: Form & Visual Analytics */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-700 ease-in-out ${hideContent ? 'opacity-0 scale-95 pointer-events-none translate-y-4' : ''}`}>
        
        {/* Form Container (7 cols on lg) */}
        <div className="lg:col-span-7 bg-[#0c1017]/90 backdrop-blur-xl rounded-2xl border border-[#c9a265]/40 p-5 sm:p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#c9a265]/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#dfbe85] to-[#a37c3f] flex items-center justify-center shadow-lg shadow-[#c9a265]/20">
                  <Truck className="w-4 h-4 text-[#0c1017]" />
                </div>
                <div>
                  <h2 className="text-lg 2xl:text-xl font-serif font-bold text-white tracking-wide">
                    {editingVehicleId ? 'Editar Veículo Cadastrado' : 'Cadastrar Novo Veículo na Frota'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {editingVehicleId ? 'Modifique a placa, frota ou transportadora associada' : 'Adicione novas placas ao sistema com identificação automática de frota 3C'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/40 border border-[#c9a265]/60 text-[#dfbe85]">
                {editingVehicleId ? 'Modo Edição' : 'Operacional'}
              </span>
            </div>
            
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider flex items-center space-x-1.5">
                    <Hash className="w-3.5 h-3.5 text-[#c9a265]" />
                    <span>Placa do Veículo</span>
                  </label>
                  <input
                    type="text"
                    value={plateInput}
                    onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                    placeholder="EX: SBN5A55"
                    maxLength={8}
                    className="w-full bg-[#121722] border border-[#2d3748] focus:border-[#c9a265] rounded-xl px-3.5 py-2.5 text-white font-mono text-sm font-bold tracking-wider placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c9a265] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c9a265]" />
                    <span>Frota / Cidade</span>
                  </label>
                  <input
                    type="text"
                    value={fleetInput}
                    onChange={(e) => setFleetInput(e.target.value.toUpperCase())}
                    placeholder="EX: EUSEBIO, BELEM..."
                    className="w-full bg-[#121722] border border-[#2d3748] focus:border-[#c9a265] rounded-xl px-3.5 py-2.5 text-white text-sm font-semibold placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c9a265] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5 uppercase tracking-wider flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#c9a265]" />
                    <span>Transportadora</span>
                  </label>
                  <input
                    type="text"
                    value={carrierInput}
                    onChange={(e) => setCarrierInput(e.target.value)}
                    placeholder="EX: 3C EUSEBIO, ARGUS..."
                    className="w-full bg-[#121722] border border-[#2d3748] focus:border-[#c9a265] rounded-xl px-3.5 py-2.5 text-white text-sm font-semibold placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#c9a265] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-slate-300 whitespace-nowrap">Status:</span>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as VehicleItem['status'])}
                    className="bg-[#121722] border border-[#2d3748] rounded-xl px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none focus:border-[#c9a265]"
                  >
                    <option value="No Pátio">No Pátio</option>
                    <option value="Em Trânsito">Em Trânsito</option>
                    <option value="Carregando">Carregando</option>
                    <option value="Manutenção">Manutenção</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {editingVehicleId ? (
                    <>
                      <button
                        type="submit"
                        className="flex-1 sm:flex-initial bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 active:scale-[0.99] text-[#0f0b04] font-extrabold px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer text-xs uppercase tracking-wider"
                      >
                        <span>Salvar Alterações</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-white/10 hover:bg-white/20 active:scale-[0.99] text-white font-bold px-4 py-2.5 rounded-xl border border-white/10 transition-all flex items-center justify-center space-x-2 cursor-pointer text-xs uppercase tracking-wider"
                      >
                        <X className="w-4 h-4 text-rose-400" />
                        <span>Cancelar</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:brightness-110 active:scale-[0.99] text-[#0f0b04] font-extrabold px-6 py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer text-xs uppercase tracking-wider"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Cadastrar Veículo</span>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* ECharts Visual Distribution (5 cols on lg) */}
        <div className="lg:col-span-5 bg-[#0c1017]/90 backdrop-blur-xl rounded-2xl border border-[#1e293b] p-5 shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h2 className="text-base font-serif font-bold text-white tracking-wide">
                Top Frotas & Transportadoras
              </h2>
              <p className="text-xs text-slate-400">
                Distribuição dos 10 maiores volumes cadastrados
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#c9a265] bg-[#121722] px-2.5 py-1 rounded-lg border border-[#c9a265]/40">
              {stats.total} Total
            </span>
          </div>

          <div className="h-56 w-full flex items-center justify-center mt-2">
            <ReactECharts option={chartOptions} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

      </div>

      {/* Main Filter & Table Section */}
      <div className={`flex flex-col bg-[#0c1017]/90 backdrop-blur-xl rounded-2xl border border-[#1e293b] p-5 sm:p-6 shadow-2xl transition-all duration-700 ease-in-out ${hideContent ? 'opacity-0 scale-95 pointer-events-none translate-y-8' : ''}`}>
        
        {/* Filter Navigation Bar */}
        <div className="flex flex-col gap-4 mb-5 pb-4 border-b border-[#1e293b]">
          {/* Top Row: Tabs and Search Input */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => { setSelectedCategoryTab('all'); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                  selectedCategoryTab === 'all'
                    ? 'bg-[#c9a265] text-[#0c1017] border-white shadow-md'
                    : 'bg-[#121722] text-slate-300 border-[#2d3748] hover:border-slate-400'
                }`}
              >
                Todos ({vehicles.length})
              </button>

              <button
                onClick={() => { setSelectedCategoryTab('3c'); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  selectedCategoryTab === '3c'
                    ? 'bg-[#dfbe85] text-[#0c1017] border-white shadow-md'
                    : 'bg-[#121722] text-[#dfbe85] border-[#2d3748] hover:border-[#dfbe85]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Frota 3C ({stats.total3C})
              </button>

              <button
                onClick={() => { setSelectedCategoryTab('dedicados'); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  selectedCategoryTab === 'dedicados'
                    ? 'bg-amber-400 text-[#0c1017] border-white shadow-md'
                    : 'bg-[#121722] text-amber-300 border-[#2d3748] hover:border-amber-400'
                }`}
              >
                Dedicados 3C ({vehicles.filter(v => v.carrier.includes('DEDICADO')).length})
              </button>

              <button
                onClick={() => { setSelectedCategoryTab('terceiros'); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border flex items-center gap-1.5 ${
                  selectedCategoryTab === 'terceiros'
                    ? 'bg-sky-400 text-[#0c1017] border-white shadow-md'
                    : 'bg-[#121722] text-sky-300 border-[#2d3748] hover:border-sky-400'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Parceiros & Terceiros ({stats.totalParceiros})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-[#c9a265]" />
              </div>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => { setSearchFilter(e.target.value); setCurrentPage(1); }}
                className="w-full bg-[#121722] border border-[#2d3748] rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:border-[#c9a265] focus:ring-1 focus:ring-[#c9a265] transition-all"
                placeholder="Buscar placa, frota ou transportadora..."
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Fleet Pills Filter */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scroll pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-[#c9a265]" /> Filtrar Frota:
            </span>
            <button
              onClick={() => { setSelectedFleetFilter('all'); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                selectedFleetFilter === 'all'
                  ? 'bg-[#c9a265]/30 text-[#dfbe85] border border-[#c9a265]'
                  : 'bg-[#121722] text-slate-400 hover:text-white border border-[#1e293b]'
              }`}
            >
              Todas as Frotas
            </button>
            {availableFleets.map(fleet => (
              <button
                key={fleet}
                onClick={() => { setSelectedFleetFilter(fleet); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                  selectedFleetFilter === fleet
                    ? 'bg-[#c9a265] text-[#0c1017] border border-white font-extrabold shadow-sm'
                    : 'bg-[#121722] text-slate-300 hover:text-white border border-[#1e293b] hover:border-slate-400'
                }`}
              >
                {fleet}
              </button>
            ))}
          </div>
        </div>

        {/* Table & Content */}
        <div className="overflow-x-auto custom-scroll">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-[#1e293b] bg-[#121722]/60 text-slate-400">
                <th className="py-3 px-4 text-xs font-extrabold text-[#dfbe85] uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5">
                    <Hash className="w-3.5 h-3.5 text-[#c9a265]" />
                    <span>Identificador / Placa</span>
                  </span>
                </th>
                <th className="py-3 px-4 text-xs font-extrabold text-[#dfbe85] uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c9a265]" />
                    <span>Frota</span>
                  </span>
                </th>
                <th className="py-3 px-4 text-xs font-extrabold text-[#dfbe85] uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#c9a265]" />
                    <span>Transportador (Oficial)</span>
                  </span>
                </th>
                <th className="py-3 px-4 text-xs font-extrabold text-[#dfbe85] uppercase tracking-wider">
                  Categoria
                </th>
                <th className="py-3 px-4 text-xs font-extrabold text-[#dfbe85] uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#c9a265]" />
                    <span>Entrada / Hora</span>
                  </span>
                </th>
                <th className="py-3 px-4 text-xs font-extrabold text-[#dfbe85] uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-extrabold text-[#dfbe85] uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]/60 text-xs">
              {paginatedVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold bg-[#121722]/30">
                    Nenhum veículo encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                paginatedVehicles.map((vehicle) => {
                  const is3C = vehicle.carrier.startsWith('3C');
                  const isDedicado = vehicle.carrier.includes('DEDICADO');

                  return (
                    <tr 
                      key={vehicle.id}
                      className="hover:bg-[#121722]/80 transition-colors group"
                    >
                      {/* Placa Badge */}
                      <td className="py-3 px-4">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[#121722] border border-[#2d3748] text-white font-mono text-sm font-black shadow-md tracking-wider group-hover:border-[#c9a265] group-hover:text-[#dfbe85] transition-all">
                          {vehicle.plate}
                        </div>
                      </td>

                      {/* Frota */}
                      <td className="py-3 px-4 font-bold text-slate-200">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#c9a265]" />
                          <span>{vehicle.fleet || 'LOGÍSTICA'}</span>
                        </div>
                      </td>

                      {/* Transportador */}
                      <td className="py-3 px-4 font-bold">
                        <span className={is3C ? 'text-[#dfbe85] font-extrabold' : 'text-slate-200'}>
                          {vehicle.carrier}
                        </span>
                      </td>

                      {/* Categoria Badge */}
                      <td className="py-3 px-4">
                        {isDedicado ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            3C Dedicado
                          </span>
                        ) : is3C ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#c9a265]/10 text-[#dfbe85] border border-[#c9a265]/30">
                            Frota Própria 3C
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-sky-500/10 text-sky-300 border border-sky-500/30">
                            Parceiro / Terceiro
                          </span>
                        )}
                      </td>

                      {/* Data / Hora */}
                      <td className="py-3 px-4 text-slate-300 font-mono">
                        <span>{vehicle.dateAdded}</span>
                        <span className="text-slate-500 ml-1.5">({vehicle.timeAdded})</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          vehicle.status === 'No Pátio'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : vehicle.status === 'Em Trânsito'
                            ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                            : vehicle.status === 'Carregando'
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            vehicle.status === 'No Pátio' ? 'bg-emerald-400 animate-pulse' : 'bg-current'
                          }`} />
                          {vehicle.status}
                        </span>
                      </td>

                      {/* Ações */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          <button
                            onClick={() => handleEditVehicle(vehicle)}
                            title="Editar Veículo"
                            className="p-1.5 rounded-lg bg-[#121722] hover:bg-[#c9a265]/20 border border-[#2d3748] hover:border-[#c9a265] text-slate-300 hover:text-[#dfbe85] transition-all cursor-pointer active:scale-90"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            title="Remover Veículo"
                            className="p-1.5 rounded-lg bg-[#121722] hover:bg-rose-500/20 border border-[#2d3748] hover:border-rose-500 text-slate-300 hover:text-rose-300 transition-all cursor-pointer active:scale-90"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-[#1e293b] text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Mostrando <strong>{paginatedVehicles.length}</strong> de <strong>{filteredVehicles.length}</strong> veículos filtrados</span>
            <span className="text-slate-600">|</span>
            <span>Itens por página:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-[#121722] border border-[#2d3748] rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-[#c9a265]"
            >
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={300}>Todos</option>
            </select>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#121722] border border-[#2d3748] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c9a265] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono font-bold text-white px-2">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#121722] border border-[#2d3748] text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#c9a265] transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
