import React from 'react';
import { CloudSun, Sunset } from 'lucide-react';

export function WeatherWidget() {
  return (
    <div className="bg-[#151b26] border border-[#1f2737] hover:border-[#c9a265]/50 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sunset className="w-4 h-4 text-[#c9a265]" />
          <h3 className="text-xs font-bold text-[#f1f5f9] uppercase tracking-wider">
            SOL DE FIM DE TARDE &bull; FORTALEZA
          </h3>
        </div>
        <span className="text-[10px] text-[#c9a265] font-bold bg-[#241e15] px-2 py-0.5 rounded-full border border-[#c9a265]/40">
          Praia de Iracema
        </span>
      </div>

      <div className="flex items-center justify-between">
        {/* Left: Icon + Temperature */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-[#241e15] border border-[#c9a265]/40 flex items-center justify-center text-[#c9a265] shadow-xs group-hover:scale-105 transition-transform">
            <CloudSun className="w-7 h-7 text-[#c9a265]" />
          </div>
          <div>
            <span className="text-3xl 2xl:text-4xl font-extrabold text-white font-sans tracking-tight">
              29°C
            </span>
          </div>
        </div>

        {/* Right: Weather Description & Details */}
        <div className="text-right">
          <p className="text-xs font-bold text-white">Céu Dourado &bull; Mar Calmo</p>
          <p className="text-[11px] text-[#c9a265] font-semibold">Vento Leste 16 km/h</p>
          <div className="text-[10px] text-[#94a3b8] mt-1 space-y-0.5 font-normal">
            <p>Umidade: 72% &bull; Maré: 0.4m (Baixa)</p>
            <p className="text-[#dfbe85] font-medium">Pôr do Sol previsto: 17:48</p>
          </div>
        </div>
      </div>
    </div>
  );
}


