import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
} from 'lucide-react';
import mapBg from '../assets/images/fortaleza_beiramar_sunset_1786933488857.jpg';

interface UnitPin {
  id: string;
  name: string;
  type: 'unit' | 'alert' | 'patrol' | 'camera';
  location: string;
  coords: { x: number; y: number };
  status: 'normal' | 'critical' | 'patrol' | 'online';
  statusLabel: string;
  description: string;
  officers: number;
  camerasCount: number;
  lastUpdate: string;
}

const INITIAL_PINS: UnitPin[] = [
  {
    id: 'matriz',
    name: 'Sede Três Corações - Matriz',
    type: 'unit',
    location: 'Aldeota / Beira Mar, Fortaleza - CE',
    coords: { x: 28, y: 56 },
    status: 'normal',
    statusLabel: 'Seguro & Operacional',
    description: 'Centro de Comando e Diretoria Geral. Todos os sistemas 100% integrados.',
    officers: 6,
    camerasCount: 24,
    lastUpdate: 'Há 2 min',
  },
  {
    id: 'praia-iracema',
    name: 'CD Três Corações - Praia de Iracema',
    type: 'unit',
    location: 'Praia de Iracema, Fortaleza - CE',
    coords: { x: 44, y: 48 },
    status: 'normal',
    statusLabel: 'Seguro & Operacional',
    description: 'Centro de Distribuição regional e armazém avançado. Posto de guarda ativo.',
    officers: 4,
    camerasCount: 16,
    lastUpdate: 'Há 5 min',
  },
  {
    id: 'eusebio',
    name: 'Fábrica & Torrefação Eusébio',
    type: 'patrol',
    location: 'Distrito Industrial, Eusébio - CE',
    coords: { x: 64, y: 62 },
    status: 'patrol',
    statusLabel: 'Ronda em Andamento',
    description: 'Equipe Alpha completando checklist no setor de moagem e expedição de café.',
    officers: 8,
    camerasCount: 32,
    lastUpdate: 'Há 8 min',
  },
  {
    id: 'porto-mucuripe',
    name: 'Terminal Logístico Portuário Mucuripe',
    type: 'camera',
    location: 'Cais do Porto Mucuripe, Fortaleza - CE',
    coords: { x: 76, y: 40 },
    status: 'online',
    statusLabel: 'Monitoramento de Exportação',
    description: 'Carregamento de contêineres de café arábica especial para exportação.',
    officers: 5,
    camerasCount: 18,
    lastUpdate: 'Há 12 min',
  },
];

export function InteractiveMap() {
  const [pins] = useState<UnitPin[]>(INITIAL_PINS);
  const [selectedPin, setSelectedPin] = useState<UnitPin | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    unit: true,
    alert: true,
    patrol: true,
    camera: true,
  });
  const [zoomLevel, setZoomLevel] = useState(1);

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(0.8, Math.min(1.8, Number((prev + delta).toFixed(1)))));
  };

  const resetMap = () => {
    setZoomLevel(1);
    setSelectedPin(null);
  };

  return (
    <div
      id="3d-map-container"
      className="bg-[#151b26] border border-[#1f2737] rounded-2xl p-5 flex flex-col h-full min-h-[350px] relative overflow-hidden group shadow-xl hover:border-[#c9a265]/50 transition-all"
    >
      {/* Header with Title & Controls */}
      <div className="flex items-center justify-between mb-3 z-10">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#c9a265] animate-pulse"></span>
          <h3 className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wider">
            MAPA E SITUAÇÃO EM TEMPO REAL
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 bg-[#0c1017] border border-[#1f2737] rounded-xl p-1 shadow-xs">
          <button
            onClick={() => handleZoom(0.2)}
            className="p-1 text-[#94a3b8] hover:text-[#c9a265] rounded transition-colors cursor-pointer"
            title="Aproximar Zoom"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            className="p-1 text-[#94a3b8] hover:text-[#c9a265] rounded transition-colors cursor-pointer"
            title="Afastar Zoom"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetMap}
            className="p-1 text-[#94a3b8] hover:text-[#c9a265] rounded transition-colors cursor-pointer"
            title="Restaurar Visão Padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="flex-1 relative rounded-xl overflow-hidden bg-[#0a0d14] border border-[#1f2737] flex items-center justify-center select-none shadow-inner">
        {/* 4K Beach Sunset Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out opacity-100"
          style={{
            backgroundImage: `url(${mapBg})`,
            transform: `scale(${zoomLevel})`,
          }}
        />

        {/* Tactical Radar Scanner Sweep Effect */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="w-[500px] h-[500px] rounded-full border border-[#c9a265]/30 animate-spin opacity-40 [animation-duration:12s]">
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#c9a265]/40 to-transparent rounded-tl-full" />
          </div>
        </div>

        {/* Location Pins */}
        <div
          className="absolute inset-0 transition-transform duration-300 pointer-events-auto"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {pins.map((pin) => {
            if (!activeLayers[pin.type]) return null;

            return (
              <div
                key={pin.id}
                className="absolute cursor-pointer transition-transform hover:scale-125 z-20 group/pin"
                style={{ top: `${pin.coords.y}%`, left: `${pin.coords.x}%` }}
                onClick={() => setSelectedPin(pin)}
              >
                {/* Specific Pin Styles */}
                {pin.type === 'unit' && (
                  <div className="relative flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#151b26] border-2 border-[#c9a265] flex items-center justify-center text-[#c9a265] shadow-xl">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#c9a265]"></div>
                    </div>
                    <span className="text-[8.5px] font-bold text-white bg-black/80 px-1.5 py-0.2 rounded mt-0.5 shadow-xs whitespace-nowrap">
                      {pin.name.split(' - ')[0]}
                    </span>
                  </div>
                )}

                {pin.type === 'alert' && (
                  <div className="relative flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#2a1212] border-2 border-[#ef4444] flex items-center justify-center text-[#ef4444] shadow-xl animate-pulse">
                      <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
                    </div>
                    <span className="text-[8.5px] font-bold text-white bg-[#ef4444]/90 px-1.5 py-0.2 rounded mt-0.5 shadow-xs whitespace-nowrap">
                      ALERTA CRÍTICO
                    </span>
                  </div>
                )}

                {pin.type === 'patrol' && (
                  <div className="relative flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#10241e] border-2 border-[#10b981] flex items-center justify-center text-[#10b981] shadow-xl">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                    </div>
                    <span className="text-[8.5px] font-bold text-white bg-black/80 px-1.5 py-0.2 rounded mt-0.5 shadow-xs whitespace-nowrap">
                      RONDA ATIVA
                    </span>
                  </div>
                )}

                {pin.type === 'camera' && (
                  <div className="relative flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#111e33] border-2 border-[#3b82f6] flex items-center justify-center text-[#3b82f6] shadow-xl">
                      <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
                    </div>
                    <span className="text-[8.5px] font-bold text-white bg-black/80 px-1.5 py-0.2 rounded mt-0.5 shadow-xs whitespace-nowrap">
                      CFTV PORTO
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Pin Details Overlay */}
        {selectedPin && (
          <div className="absolute top-3 right-3 z-30 w-72 bg-[#151b26]/95 backdrop-blur-xl border border-[#c9a265] rounded-xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    selectedPin.status === 'critical'
                      ? 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                      : selectedPin.status === 'patrol'
                      ? 'bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/40'
                      : 'bg-[#c9a265]/20 text-[#dfbe85] border border-[#c9a265]/40'
                  }`}
                >
                  {selectedPin.statusLabel}
                </span>
                <h4 className="text-xs font-bold text-white mt-1">{selectedPin.name}</h4>
              </div>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-[#94a3b8] hover:text-white p-1 rounded-md hover:bg-[#1f2737] transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-[#cbd5e1] mb-2 font-medium leading-relaxed">{selectedPin.description}</p>
            <div className="flex justify-between text-[10px] text-[#94a3b8] pt-2 border-t border-[#1f2737]">
              <span>Vigilantes: <b className="text-white">{selectedPin.officers}</b></span>
              <span>Câmeras: <b className="text-white">{selectedPin.camerasCount}</b></span>
              <span>Atualização: <b className="text-[#c9a265]">{selectedPin.lastUpdate}</b></span>
            </div>
          </div>
        )}

        {/* Bottom Legend */}
        <div className="absolute bottom-3 left-3 bg-[#0c1017]/90 backdrop-blur-xl border border-[#1f2737] rounded-xl px-3.5 py-1.5 flex items-center space-x-4 text-[10px] font-medium z-20 shadow-lg">
          <button
            onClick={() => toggleLayer('unit')}
            className={`flex items-center space-x-1.5 transition-opacity cursor-pointer ${
              activeLayers.unit ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#c9a265]"></div>
            <span className="text-[#e2e8f0]">Unidades</span>
          </button>

          <button
            onClick={() => toggleLayer('alert')}
            className={`flex items-center space-x-1.5 transition-opacity cursor-pointer ${
              activeLayers.alert ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444] animate-pulse"></div>
            <span className="text-[#e2e8f0]">Alertas</span>
          </button>

          <button
            onClick={() => toggleLayer('patrol')}
            className={`flex items-center space-x-1.5 transition-opacity cursor-pointer ${
              activeLayers.patrol ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
            <span className="text-[#e2e8f0]">Rondas</span>
          </button>

          <button
            onClick={() => toggleLayer('camera')}
            className={`flex items-center space-x-1.5 transition-opacity cursor-pointer ${
              activeLayers.camera ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
            <span className="text-[#e2e8f0]">Câmeras</span>
          </button>
        </div>
      </div>
    </div>
  );
}


