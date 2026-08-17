import React from 'react';
import { ThreeCupViewer } from './ThreeCupViewer';
import { Sparkles, Move3d } from 'lucide-react';

export function SecondaryBanner() {
  return (
    <div className="bg-[#151b26] border border-[#1f2737] hover:border-[#c9a265]/50 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden flex flex-col justify-between group">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#c9a265]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-[#c9a265]" />
          <h3 className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wider font-serif">
            CAFÉ TRÊS CORAÇÕES 3D
          </h3>
        </div>
        <span className="text-[9px] font-mono text-[#c9a265] font-bold bg-[#241e15] px-2.5 py-0.5 rounded-full border border-[#c9a265]/40 flex items-center space-x-1 shadow-2xs">
          <Move3d className="w-3 h-3 text-[#c9a265]" />
          <span>Interativo</span>
        </span>
      </div>

      {/* 3D Model Container (Three.js WebGL with id="3d-cup-container") */}
      <div className="w-full h-44 my-1 rounded-xl bg-[#0c1017] border border-[#1f2737] relative overflow-hidden flex items-center justify-center shadow-inner">
        <ThreeCupViewer />
      </div>

      {/* Caption & Brand Quote */}
      <div className="mt-2 text-center z-10">
        <p className="text-xs text-white font-serif italic">
          &ldquo;O sabor da paixão com segurança em cada detalhe.&rdquo;
        </p>
        <p className="text-[10px] text-[#94a3b8] mt-0.5 font-medium">
          Gire o modelo 3D com o mouse &bull; 4K Ultra-HD
        </p>
      </div>
    </div>
  );
}


