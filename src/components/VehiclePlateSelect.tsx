import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Truck, X, ChevronDown, Check, Building2, MapPin } from 'lucide-react';
import { INITIAL_VEHICLES_RAW } from '../data/veiculosData';

interface VehiclePlateSelectProps {
  value: string;
  onChange: (plate: string, carrier?: string, fleet?: string) => void;
  placeholder?: string;
  className?: string;
}

export function VehiclePlateSelect({
  value,
  onChange,
  placeholder = 'Buscar placa ou transportadora...',
  className = '',
}: VehiclePlateSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter list of vehicles from veiculosData
  const filteredVehicles = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return INITIAL_VEHICLES_RAW.slice(0, 50); // first 50 when empty
    return INITIAL_VEHICLES_RAW.filter(
      (v) =>
        v.plate.toLowerCase().includes(term) ||
        v.carrier.toLowerCase().includes(term) ||
        v.fleet.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSelect = (plate: string, carrier: string, fleet: string) => {
    onChange(plate, carrier, fleet);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleCustomInput = (customValue: string) => {
    onChange(customValue.toUpperCase());
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger / Input box */}
      <div className="relative flex items-center">
        <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
          <Truck className="w-4 h-4 text-[#c9a265]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            handleCustomInput(e.target.value);
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setSearchTerm(value);
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-16 py-2 bg-[#121824] border border-[#232f45] focus:border-[#c9a265] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner uppercase tracking-wider font-semibold font-mono"
        />

        <div className="absolute right-2 flex items-center space-x-1">
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setSearchTerm('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-400 hover:text-[#c9a265] rounded-md hover:bg-slate-700/50 transition-colors"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-[#0f141f] border border-[#c9a265]/40 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-64 flex flex-col">
          {/* Top Search bar inside dropdown */}
          <div className="p-2 border-b border-[#232f45] bg-[#151c2a] flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-[#c9a265]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filtrar por placa, frota ou transportadora..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
              autoFocus
            />
            <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 bg-[#1e2738] rounded">
              {filteredVehicles.length}
            </span>
          </div>

          {/* List items */}
          <div className="overflow-y-auto custom-scroll flex-1 divide-y divide-[#1b2434]">
            {filteredVehicles.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-slate-400 mb-1">Nenhum veículo cadastrado com esse termo.</p>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange(searchTerm.toUpperCase());
                      setIsOpen(false);
                    }}
                    className="text-[11px] text-[#c9a265] hover:underline font-semibold cursor-pointer"
                  >
                    Usar placa digitada: "{searchTerm.toUpperCase()}"
                  </button>
                )}
              </div>
            ) : (
              filteredVehicles.map((v, idx) => {
                const isSelected = value.toUpperCase() === v.plate.toUpperCase();
                const is3C = v.carrier.startsWith('3C');

                return (
                  <button
                    key={`${v.plate}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(v.plate, v.carrier, v.fleet)}
                    className={`w-full text-left p-2.5 flex items-center justify-between hover:bg-[#1b2536] transition-colors cursor-pointer group ${
                      isSelected ? 'bg-[#c9a265]/15 border-l-2 border-[#c9a265]' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {/* Plate Badge */}
                      <span className="px-2 py-0.5 rounded-md bg-[#192233] border border-[#2f3d54] text-[#dfbe85] font-mono font-bold text-xs tracking-wider group-hover:border-[#c9a265] group-hover:text-white transition-colors">
                        {v.plate}
                      </span>

                      {/* Carrier & Fleet details */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs text-slate-200 font-medium truncate group-hover:text-white flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          {v.carrier}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-slate-500 flex-shrink-0" />
                          Frota: {v.fleet}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
                      <span
                        className={`text-[9.5px] px-1.5 py-0.5 rounded font-medium ${
                          is3C
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                        }`}
                      >
                        {is3C ? 'Frota 3C' : 'Parceira'}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#c9a265]" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
