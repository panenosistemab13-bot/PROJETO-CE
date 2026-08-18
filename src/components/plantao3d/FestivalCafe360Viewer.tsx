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
    id: 'festival_arena_central',
    name: 'Pavilhão Central do Festival',
    category: 'Festival 3corações',
    subtitle: 'Mural Panorâmico & Espaço de Experiências',
    image: festivalPanoramaImg,
    badge: '360° HDR',
    accentColor: 'from-[#dfbe85] to-[#a37c3f]',
    description: 'Visão imersiva 360° do pavilhão central com estandes dos produtores de cafés especiais.',
  },
];

interface FestivalCafe360ViewerProps {
  onSelectHotspot?: (hotspotId: string) => void;
  isCompact?: boolean;
  activeTheme?: Wallpaper360Theme;
}

export function FestivalCafe360Viewer({
  onSelectHotspot,
  isCompact = false,
  activeTheme: externalActiveTheme,
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

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Interaction refs
  const isInteractingRef = useRef(false);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const targetLonRef = useRef(0);
  const targetLatRef = useRef(0);
  const fovRef = useRef(95);
  const isAutoRotateRef = useRef(true);
  const rotateSpeedRef = useRef(0.06);



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
      // Intentionally disabled zoom logic based on recent user request
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


      </div>



    </div>
  );
}
