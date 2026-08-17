import React from 'react';
import sunsetHeroCup from '../assets/images/hero_fortaleza_cup_1786935044690.jpg';
import { LeadershipPrinciples } from './LeadershipPrinciples';

export function HeroBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#1f2737] shadow-2xl min-h-[200px] 2xl:min-h-[230px] flex items-center justify-between p-6 sm:p-8 2xl:p-10 group select-none bg-[#0c1017]">
      {/* Background 4K Panoramic Sunset Beach Image with Sand, Sea & Coffee Cup */}
      <div
        className="absolute inset-0 bg-cover bg-right md:bg-center pointer-events-none transition-transform duration-1000 group-hover:scale-[1.02]"
        style={{
          backgroundImage: `url(${sunsetHeroCup})`,
          backgroundPosition: 'center 45%',
        }}
      />

      {/* Empty container with specific ID for external 3D models via Three.js / Spline */}
      <div id="3d-cup-container" className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none z-0" />

      {/* Left Content Column with strong text-shadows instead of background dark gradients */}
      <div className="relative z-10 max-w-xl flex flex-col justify-between h-full">
        <div>
          <p className="text-[10px] 2xl:text-[11px] font-bold text-[#c9a265] tracking-[0.25em] uppercase mb-1.5 flex items-center space-x-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a265] animate-pulse"></span>
            <span>FORTALEZA, CEARÁ</span>
          </p>

          <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-serif text-white font-medium tracking-tight leading-[1.15] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Segurança que<br />
            gera confiança.<br />
            <span className="text-[#dfbe85] font-serif italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Café que conecta.</span>
          </h1>

          <p className="text-xs 2xl:text-sm text-[#e2e8f0] mt-2.5 font-sans font-medium drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
            Café Três Corações em cada detalhe.
          </p>

          {/* Golden Signature */}
          <p className="text-[#c9a265] font-serif italic text-lg 2xl:text-xl mt-1 tracking-wider drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
            Desde 1959
          </p>
        </div>

        {/* Rotating Leadership Principles Component - Aligned to bottom */}
        <div className="mt-8">
          <LeadershipPrinciples />
        </div>
      </div>


    </div>
  );
}



