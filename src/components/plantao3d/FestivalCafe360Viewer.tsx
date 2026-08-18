import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Compass,
  Sparkles,
  Layers,
  Eye,
  Coffee,
  Flame,
  Volume2,
  VolumeX,
  ChevronRight,
  Move3D,
  Image as ImageIcon,
  Check,
  Sliders,
  Sun,
  Shield,
  Truck,
} from 'lucide-react';

import festivalArena4kImg from '../../assets/images/festival_360_gold_arena_1787015144893.jpg';
import festivalPanoramaImg from '../../assets/images/festival_cafe_panorama_1787013330815.jpg';
import festivalRoasteryImg from '../../assets/images/festival_cafe_roastery_1787013341855.jpg';
import ccoLounge4kImg from '../../assets/images/cco_360_lounge_4k_1787015183690.jpg';
import ccoControlImg from '../../assets/images/cco_plantao_360_1786994085712.jpg';
import factorySantaClaraImg from '../../assets/images/tres_coracoes_360_panorama_1786974698163.jpg';

import iconFolder3d from '../../assets/images/icon_folder_3d_1787015156529.jpg';
import iconCoffee3d from '../../assets/images/icon_coffee_3d_1787015165985.jpg';
import iconBadge3d from '../../assets/images/icon_badge_3d_1787015174678.jpg';
import iconTruck3d from '../../assets/images/icon_truck_3d_1787015195876.jpg';

export interface Wallpaper360Theme {
  id: string;
  name: string;
  category: 'Festival 3corações' | 'CCO & Operações' | 'Indústria & Cafés';
  subtitle: string;
  image: string;
  badge: string;
  accentColor: string;
  description: string;
}

export const WALLPAPERS_360_THEMES: Wallpaper360Theme[] = [
  {
    id: 'festival_arena_gold_4k',
    name: 'Arena Dourada & Pavilhão 4K',
    category: 'Festival 3corações',
    subtitle: 'Festival do Café 3corações em 360° Ultra HD',
    image: festivalArena4kImg,
    badge: '4K Ultra HD',
    accentColor: 'from-amber-400 to-amber-700',
    description: 'Ambiente noturno luxuoso com iluminação âmbar, quiosques de café gourmet e estrutura moderna.',
  },
  {
    id: 'festival_arena_central',
    name: 'Pavilhão Central do Festival',
    category: 'Festival 3corações',
    subtitle: 'Mural Panorâmico & Espaço de Experiências',
    image: festivalPanoramaImg,
    badge: '360° HDR',
    accentColor: 'from-[#dfbe85] to-[#a37c3f]',
    description: 'Visão imersiva 360° do pavilhão central com estandes dos produtores de cafés especiais.',
  },
  {
    id: 'festival_roastery_lounge',
    name: 'Espaço Torrefação & Baristas',
    category: 'Festival 3corações',
    subtitle: 'Mestres de Café & Grãos Selecionados',
    image: festivalRoasteryImg,
    badge: 'Gourmet 4K',
    accentColor: 'from-amber-500 to-orange-700',
    description: 'Torradores de cobre polido, bancadas rústicas e aromas dos melhores lotes de café do Brasil.',
  },
  {
    id: 'cco_lounge_4k',
    name: 'CCO Lounge & Inteligência 4K',
    category: 'CCO & Operações',
    subtitle: 'Centro de Operações e Monitoramento Logístico',
    image: ccoLounge4kImg,
    badge: '4K Executivo',
    accentColor: 'from-cyan-400 to-blue-700',
    description: 'Sala de comando executiva com painéis curvos de telemetria e espaço exclusivo para passagem de turno.',
  },
  {
    id: 'cco_plantao_control',
    name: 'Sala de Monitoramento CCO 24H',
    category: 'CCO & Operações',
    subtitle: 'Torre de Controle Operacional 3corações',
    image: ccoControlImg,
    badge: '360° Operacional',
    accentColor: 'from-blue-400 to-indigo-700',
    description: 'Monitoramento contínuo da frota de carretas, transferências e distribuição com visão 360°.',
  },
  {
    id: 'santa_clara_factory_4k',
    name: 'Complexo Industrial Santa Clara',
    category: 'Indústria & Cafés',
    subtitle: 'Unidade Industrial e Pátio Logístico 360°',
    image: factorySantaClaraImg,
    badge: 'Panorâmica 4K',
    accentColor: 'from-emerald-400 to-emerald-700',
    description: 'Pátio principal de expedição e recepção de grãos da fábrica Santa Clara do Grupo 3corações.',
  },
];

interface FestivalCafe360ViewerProps {
  onSelectHotspot?: (hotspotId: string) => void;
  isCompact?: boolean;
  activeTheme?: Wallpaper360Theme;
  onChangeTheme?: (theme: Wallpaper360Theme) => void;
  onTogglePageBackground?: (enabled: boolean) => void;
  isPageBackgroundActive?: boolean;
}

export function FestivalCafe360Viewer({
  onSelectHotspot,
  isCompact = false,
  activeTheme: externalActiveTheme,
  onChangeTheme,
  onTogglePageBackground,
  isPageBackgroundActive = false,
}: FestivalCafe360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);

  const [internalActiveTheme, setInternalActiveTheme] = useState<Wallpaper360Theme>(
    WALLPAPERS_360_THEMES[0]
  );
  const activeScene = externalActiveTheme || internalActiveTheme;

  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [rotateSpeed, setRotateSpeed] = useState(0.06);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Interaction refs
  const isInteractingRef = useRef(false);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const targetLonRef = useRef(0);
  const targetLatRef = useRef(0);
  const fovRef = useRef(95);
  const isAutoRotateRef = useRef(isAutoRotate);
  const rotateSpeedRef = useRef(rotateSpeed);

  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  useEffect(() => {
    rotateSpeedRef.current = rotateSpeed;
  }, [rotateSpeed]);

  // Handle Zoom
  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!cameraRef.current) return;
    if (direction === 'in') {
      fovRef.current = Math.max(45, fovRef.current - 15);
    } else if (direction === 'out') {
      fovRef.current = Math.min(130, fovRef.current + 15);
    } else {
      fovRef.current = 95;
      lonRef.current = 0;
      latRef.current = 0;
    }
    cameraRef.current.fov = fovRef.current;
    cameraRef.current.updateProjectionMatrix();
  };

  // Change Theme
  const handleSelectTheme = (theme: Wallpaper360Theme) => {
    if (onChangeTheme) {
      onChangeTheme(theme);
    } else {
      setInternalActiveTheme(theme);
    }
    setIsThemePickerOpen(false);

    if (meshRef.current && textureLoaderRef.current) {
      textureLoaderRef.current.load(theme.image, (texture) => {
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        texture.colorSpace = THREE.SRGBColorSpace;
        if (meshRef.current) {
          (meshRef.current.material as THREE.MeshBasicMaterial).map = texture;
          (meshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
      });
    }
  };

  // Setup WebGL Three.js Sphere & Floating Golden Particles
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || (isCompact ? 360 : 490);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 2000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 1. High-poly Photosphere Geometry for Ultra-Crisp 4K Quality
    const sphereGeometry = new THREE.SphereGeometry(950, 180, 90);
    sphereGeometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoaderRef.current = textureLoader;

    const texture = textureLoader.load(activeScene.image, () => {
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      texture.colorSpace = THREE.SRGBColorSpace;
    });

    const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    meshRef.current = sphereMesh;
    scene.add(sphereMesh);

    // 2. Floating 3D Golden Roasted Coffee Aroma Particles
    const particleCount = 260;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 800;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 800;
      particleScales[i] = Math.random() * 2.8 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xdfbe85,
      size: 4.5,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 3. Pointer event interactions
    let onPointerDownMouseX = 0;
    let onPointerDownMouseY = 0;
    let onPointerDownLon = 0;
    let onPointerDownLat = 0;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('button, .hud-control, input, a, select, .theme-picker-modal')) {
        return;
      }
      isInteractingRef.current = true;
      onPointerDownMouseX = e.clientX;
      onPointerDownMouseY = e.clientY;
      onPointerDownLon = lonRef.current;
      onPointerDownLat = latRef.current;
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isInteractingRef.current) return;
      lonRef.current = (onPointerDownMouseX - e.clientX) * 0.18 + onPointerDownLon;
      latRef.current = (e.clientY - onPointerDownMouseY) * 0.18 + onPointerDownLat;
    };

    const onPointerUp = () => {
      isInteractingRef.current = false;
      container.style.cursor = 'grab';
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      fovRef.current = THREE.MathUtils.clamp(fovRef.current + e.deltaY * 0.05, 45, 130);
      if (cameraRef.current) {
        cameraRef.current.fov = fovRef.current;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 4. Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotateRef.current && !isInteractingRef.current) {
        lonRef.current += rotateSpeedRef.current;
      }

      // Smooth damping interpolation
      targetLonRef.current += (lonRef.current - targetLonRef.current) * 0.1;
      targetLatRef.current += (latRef.current - targetLatRef.current) * 0.1;
      targetLatRef.current = Math.max(-85, Math.min(85, targetLatRef.current));

      const phi = THREE.MathUtils.degToRad(90 - targetLatRef.current);
      const theta = THREE.MathUtils.degToRad(targetLonRef.current);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      if (cameraRef.current) {
        cameraRef.current.lookAt(targetX, targetY, targetZ);
      }

      // Slowly rotate particle field for floating coffee embers effect
      if (particleSystem) {
        particleSystem.rotation.y += 0.0008;
        particleSystem.rotation.x += 0.0003;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Resize observer
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [activeScene, isCompact]);

  return (
    <div
      className={`relative rounded-3xl overflow-hidden border border-[#c9a265]/50 shadow-2xl transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-4 z-50 bg-[#0c1017] flex flex-col'
          : isCompact
          ? 'h-[360px]'
          : 'h-[460px] 2xl:h-[510px]'
      }`}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Gradient Overlay & Ambient Light */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#090d14]/90 via-[#090d14]/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#090d14]/95 via-[#090d14]/60 to-transparent pointer-events-none" />

      {/* Top Header HUD with 3D Icons & Active Wallpaper Title */}
      <div className="absolute top-3.5 left-4 right-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pointer-events-none z-10">
        <div className="flex items-center space-x-3">
          {/* 3D Rendered Coffee Cup Icon Thumbnail */}
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border-2 border-[#c9a265] shadow-lg shadow-[#c9a265]/30 flex-shrink-0 pointer-events-auto group">
            <img
              src={iconCoffee3d}
              alt="Ícone 3D Café"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm sm:text-base font-bold text-white tracking-wide font-serif">
                {activeScene.name}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#dfbe85]/20 to-[#c9a265]/20 border border-[#c9a265]/60 text-[#dfbe85] text-[10px] font-mono font-extrabold uppercase tracking-wider shadow">
                {activeScene.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium drop-shadow flex items-center space-x-1.5">
              <span>{activeScene.subtitle}</span>
              <span>&bull;</span>
              <span className="text-[#dfbe85] font-semibold">Giro 360° Real</span>
            </p>
          </div>
        </div>

        {/* Right HUD: Wallpaper 4K Theme Switcher & Background Projection */}
        <div className="flex items-center space-x-2 pointer-events-auto self-end sm:self-auto">
          {/* Wallpaper 4K Theme Chooser Button */}
          <button
            onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
            className="px-3.5 py-2 rounded-2xl bg-[#111724]/90 hover:bg-[#182337] border border-[#c9a265]/70 hover:border-[#dfbe85] text-white text-xs font-bold flex items-center space-x-2 backdrop-blur-md shadow-xl transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <ImageIcon className="w-4 h-4 text-[#dfbe85]" />
            <span>Papéis de Parede 4K 360° ({WALLPAPERS_360_THEMES.length})</span>
          </button>

          {/* Page Background Toggle */}
          {onTogglePageBackground && (
            <button
              onClick={() => onTogglePageBackground(!isPageBackgroundActive)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center space-x-1.5 backdrop-blur-md border transition-all cursor-pointer ${
                isPageBackgroundActive
                  ? 'bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] text-[#140e06] border-white/40 shadow-lg'
                  : 'bg-[#111724]/80 hover:bg-[#192336] text-slate-300 border-[#2b3c58]'
              }`}
              title="Projetar este ambiente 360° no fundo da tela inteira"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Fundo Imersivo</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating 3D Hotspot Interactive Points on 360 Stage */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Central 3D Interactive Hotspot Button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10 flex flex-col items-center">
          <button
            onClick={() => {
              setActiveHotspot(activeHotspot === 'mural' ? null : 'mural');
              if (onSelectHotspot) onSelectHotspot('mural');
            }}
            className="group relative p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-[#0c1017]/85 hover:bg-[#141b27] border-2 border-[#c9a265] hover:border-[#dfbe85] backdrop-blur-md shadow-[0_0_30px_rgba(201,162,101,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95 flex items-center space-x-3"
          >
            {/* 3D Folder Icon inside button */}
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#dfbe85]/60 flex-shrink-0 shadow">
              <img
                src={iconFolder3d}
                alt="Pasta 3D"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white tracking-wide font-serif flex items-center space-x-1.5">
                <span>Mural 3D de Pastas</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[10px] text-[#dfbe85] font-medium">
                Clique para navegar até as pastas dos colaboradores
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Wallpaper Themes 4K Selection Drawer/Modal */}
      {isThemePickerOpen && (
        <div className="absolute inset-x-4 top-16 z-30 p-4 sm:p-5 rounded-3xl bg-[#0d131f]/95 border-2 border-[#c9a265] backdrop-blur-xl shadow-2xl theme-picker-modal animate-fade-in max-h-[75%] overflow-y-auto custom-scroll">
          <div className="flex items-center justify-between pb-3 border-b border-[#223046]">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#c9a265]/20 border border-[#c9a265] flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-[#dfbe85]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-serif">
                  Galeria de Papéis de Parede 4K & Ambientes 360°
                </h3>
                <p className="text-[11px] text-slate-300">
                  Selecione o cenário 360° em ultra definição para a Passagem de Plantão
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsThemePickerOpen(false)}
              className="px-3 py-1 rounded-xl bg-[#172030] hover:bg-[#233148] text-xs text-slate-300 hover:text-white border border-[#2b3c58] transition-all cursor-pointer font-semibold"
            >
              Fechar
            </button>
          </div>

          {/* Wallpapers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-4">
            {WALLPAPERS_360_THEMES.map((theme) => {
              const isSelected = activeScene.id === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleSelectTheme(theme)}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer p-3 flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-[#c9a265] bg-gradient-to-b from-[#182337] to-[#0e1422] shadow-[0_0_20px_rgba(201,162,101,0.35)]'
                      : 'border-[#202d42] bg-[#0c1017]/90 hover:border-[#dfbe85]/70 hover:bg-[#131a29]'
                  }`}
                >
                  {/* Thumbnail Banner */}
                  <div className="relative h-28 rounded-xl overflow-hidden border border-[#263750]">
                    <img
                      src={theme.image}
                      alt={theme.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-white text-[9.5px] font-mono font-bold uppercase">
                      {theme.badge}
                    </span>

                    {isSelected && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#c9a265] text-[#140e06] text-[10px] font-extrabold flex items-center space-x-1 shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>ATIVO</span>
                      </span>
                    )}

                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-[10px] font-bold text-[#dfbe85] uppercase tracking-wider block">
                        {theme.category}
                      </span>
                      <h4 className="text-xs font-bold text-white font-serif truncate">
                        {theme.name}
                      </h4>
                    </div>
                  </div>

                  {/* Description & Selection state */}
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                    {theme.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-slate-400 font-mono">Panorâmica 360°</span>
                    <button
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#c9a265] text-[#140e06]'
                          : 'bg-[#182337] text-slate-300 group-hover:bg-[#c9a265] group-hover:text-[#140e06]'
                      }`}
                    >
                      {isSelected ? 'Em Exibição' : 'Carregar Cenário'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Control Bar HUD with 3D Details */}
      <div className="absolute bottom-3 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none z-10">
        <div className="flex items-center space-x-2 text-[11px] text-[#dfbe85] bg-[#0c111a]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#232f45] shadow-lg pointer-events-auto">
          <Compass className="w-4 h-4 animate-spin-slow text-[#c9a265]" />
          <span>Interativo 360°: arraste ou use o scroll para zoom em 4K</span>
        </div>

        {/* Action Controls & HUD Tools */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#0c111a]/95 border border-[#232f45] backdrop-blur-md pointer-events-auto shadow-xl hud-control">
          {/* Auto rotate toggle */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isAutoRotate
                ? 'bg-[#c9a265] text-[#140e06] shadow'
                : 'text-slate-400 hover:text-white hover:bg-[#1a2436]'
            }`}
            title={isAutoRotate ? 'Pausar Giro 360°' : 'Iniciar Giro Automático'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Rotation Speed Adjuster */}
          <button
            onClick={() => {
              const speeds = [0.03, 0.06, 0.12];
              const next = speeds[(speeds.indexOf(rotateSpeed) + 1) % speeds.length];
              setRotateSpeed(next);
            }}
            className="px-2 py-1 rounded-lg text-[10.5px] font-mono font-bold text-slate-300 hover:text-white hover:bg-[#1a2436] transition-all cursor-pointer"
            title="Ajustar Velocidade do Giro"
          >
            {rotateSpeed === 0.03 ? '1x Lento' : rotateSpeed === 0.06 ? '2x Normal' : '3x Rápido'}
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1a2436] transition-all cursor-pointer"
            title="Aproximar (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1a2436] transition-all cursor-pointer"
            title="Afastar (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Reset Zoom */}
          <button
            onClick={() => handleZoom('reset')}
            className="px-2.5 py-1 rounded-lg text-[10.5px] font-mono font-bold text-slate-300 hover:text-white hover:bg-[#1a2436] transition-all cursor-pointer"
            title="Redefinir Visão"
          >
            100%
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1a2436] transition-all cursor-pointer"
            title={isFullscreen ? 'Reduzir Tela' : 'Expandir Tela 360°'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
