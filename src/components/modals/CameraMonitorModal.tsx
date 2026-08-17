import React, { useState } from 'react';
import {
  X,
  Video,
  Maximize2,
  Minimize2,
  RefreshCw,
  Eye,
  Camera,
  Play,
  Pause,
  Sliders,
} from 'lucide-react';

interface CameraMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CAMERAS = [
  {
    id: 'CAM-01',
    name: 'Portaria Principal - Matriz',
    unit: 'Aldeota, Fortaleza',
    status: 'ONLINE 4K',
    image:
      'https://images.unsplash.com/photo-1541888946425-d0fbb18015f6?auto=format&fit=crop&q=80&w=800',
    fps: '60 FPS',
  },
  {
    id: 'CAM-02',
    name: 'Armazém Grãos Verdes - Fábrica',
    unit: 'Eusébio, CE',
    status: 'ONLINE 4K',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    fps: '30 FPS',
  },
  {
    id: 'CAM-03',
    name: 'Docas de Carga - CD Praia de Iracema',
    unit: 'Fortaleza, CE',
    status: 'ALERTA TÉRMICO',
    image:
      'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=800',
    fps: '60 FPS',
  },
  {
    id: 'CAM-04',
    name: 'Linha de Torrefação & Embalagem',
    unit: 'Eusébio, CE',
    status: 'ONLINE 4K',
    image:
      'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&q=80&w=800',
    fps: '60 FPS',
  },
];

export function CameraMonitorModal({ isOpen, onClose }: CameraMonitorModalProps) {
  const [selectedCam, setSelectedCam] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border border-[#E7E5E4] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E7E5E4] bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#FDF8EE] border border-[#c9a265] flex items-center justify-center text-[#8c6a38]">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1C1917] font-serif">
                Mosaico de Câmeras CFTV 4K &bull; Alta Fidelidade
              </h3>
              <p className="text-xs text-[#78716C]">
                Monitoramento Perimetral &bull; Café Três Corações
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 text-[#78716C] hover:text-[#8c6a38] bg-white rounded-lg border border-[#E7E5E4] transition-colors cursor-pointer"
              title={isPlaying ? 'Pausar feeds ao vivo' : 'Reproduzir feeds ao vivo'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#78716C] hover:text-[#1C1917] bg-white rounded-lg border border-[#E7E5E4] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4-Grid Camera Streams */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto bg-[#F9F9F8]">
          {CAMERAS.map((cam) => (
            <div
              key={cam.id}
              onClick={() => setSelectedCam(cam.id)}
              className="bg-white border border-[#E7E5E4] hover:border-[#c9a265] rounded-xl overflow-hidden relative group cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              {/* Video Thumbnail Simulation */}
              <div className="relative h-56 w-full overflow-hidden bg-black">
                <img
                  src={cam.image}
                  alt={cam.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                />

                {/* Overlays */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-white flex items-center space-x-1.5 border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></div>
                  <span>LIVE &bull; {cam.id}</span>
                </div>

                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded text-[10px] font-mono text-[#c9a265] border border-white/10">
                  {cam.fps}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 rounded-b-lg">
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{cam.name}</h4>
                    <p className="text-[10px] text-[#D6D3D1]">{cam.unit}</p>
                  </div>
                  <button className="text-[#c9a265] p-1.5 rounded-lg bg-black/60 hover:bg-[#c9a265] hover:text-[#110F0E] transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E7E5E4] bg-[#FAF8F5] flex flex-col sm:flex-row justify-between items-center text-xs text-[#78716C] gap-2">
          <span>94 câmeras operacionais conectadas via fibra óptica dedicada</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => alert('Gravando clipe de 30 segundos.')}
              className="px-3 py-1.5 bg-white hover:bg-[#F5F3EF] text-[#1C1917] rounded-lg border border-[#E7E5E4] flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-[#8c6a38]" />
              <span>Capturar Frame</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-gradient-to-r from-[#c9a265] to-[#dfbe85] text-[#1C1917] font-bold rounded-lg uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              Fechar Mosaico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
