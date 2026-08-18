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
} from 'lucide-react';

import festivalPanoramaImg from '../../assets/images/festival_cafe_panorama_1787013330815.jpg';
import festivalRoasteryImg from '../../assets/images/festival_cafe_roastery_1787013341855.jpg';

interface FestivalScene {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  badge: string;
}

const FESTIVAL_SCENES: FestivalScene[] = [
  {
    id: 'festival_arena',
    name: 'Pavilhão Principal 3corações',
    subtitle: 'Festival do Café 3D & Mural 360°',
    image: festivalPanoramaImg,
    badge: '360° Ultra HD',
  },
  {
    id: 'festival_roastery',
    name: 'Espaço Torrefação & Baristas',
    subtitle: 'Mestres de Café & Grãos Especiais',
    image: festivalRoasteryImg,
    badge: 'Ambiente Gourmet',
  },
];

interface FestivalCafe360ViewerProps {
  onSelectHotspot?: (hotspotId: string) => void;
  isCompact?: boolean;
}

export function FestivalCafe360Viewer({ onSelectHotspot, isCompact = false }: FestivalCafe360ViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);

  const [activeScene, setActiveScene] = useState<FestivalScene>(FESTIVAL_SCENES[0]);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [audioAmbient, setAudioAmbient] = useState(false);

  // Interaction refs
  const isInteractingRef = useRef(false);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const targetLonRef = useRef(0);
  const targetLatRef = useRef(0);
  const fovRef = useRef(95);
  const isAutoRotateRef = useRef(isAutoRotate);

  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  // Handle Zoom
  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!cameraRef.current) return;
    if (direction === 'in') {
      fovRef.current = Math.max(50, fovRef.current - 12);
    } else if (direction === 'out') {
      fovRef.current = Math.min(125, fovRef.current + 12);
    } else {
      fovRef.current = 95;
      lonRef.current = 0;
      latRef.current = 0;
    }
    cameraRef.current.fov = fovRef.current;
    cameraRef.current.updateProjectionMatrix();
  };

  // Change Scene
  const handleSceneChange = (scene: FestivalScene) => {
    setActiveScene(scene);
    if (meshRef.current && textureLoaderRef.current) {
      textureLoaderRef.current.load(scene.image, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
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
    let height = container.clientHeight || (isCompact ? 360 : 480);

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

    // 1. High-poly Photosphere Geometry for Ultra-Crisp Quality
    const sphereGeometry = new THREE.SphereGeometry(900, 160, 80);
    sphereGeometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoaderRef.current = textureLoader;

    const texture = textureLoader.load(activeScene.image, () => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
    });

    const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    meshRef.current = sphereMesh;
    scene.add(sphereMesh);

    // 2. Floating 3D Golden Roasted Coffee Aroma Particles
    const particleCount = 220;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 700;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 500;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 700;
      particleScales[i] = Math.random() * 2.5 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xdfbe85,
      size: 4,
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
      if (target && target.closest('button, .hud-control, input, a, select')) {
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
      fovRef.current = THREE.MathUtils.clamp(fovRef.current + e.deltaY * 0.05, 45, 125);
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
        lonRef.current += 0.06;
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
      className={`relative rounded-3xl overflow-hidden border border-[#c9a265]/40 shadow-2xl transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-4 z-50 bg-[#0c1017] flex flex-col'
          : isCompact
          ? 'h-[360px]'
          : 'h-[440px] 2xl:h-[490px]'
      }`}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Gradient Overlay & Ambient Light */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#090d14]/90 via-[#090d14]/50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#090d14]/95 via-[#090d14]/60 to-transparent pointer-events-none" />

      {/* Top Header HUD */}
      <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#c9a265]/20 border border-[#c9a265]/60 flex items-center justify-center backdrop-blur-md shadow-lg pointer-events-auto">
            <Move3D className="w-5 h-5 text-[#dfbe85]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white tracking-wide font-serif">
                Festival do Café 3corações
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#c9a265]/25 border border-[#c9a265]/50 text-[#dfbe85] text-[10px] font-mono font-bold uppercase tracking-wider">
                Ambiente 3D 360°
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium drop-shadow">
              {activeScene.name} &bull; {activeScene.subtitle}
            </p>
          </div>
        </div>

        {/* Scene Selector Pills */}
        <div className="hidden sm:flex items-center space-x-1.5 p-1 rounded-xl bg-[#0e1420]/80 border border-[#26354d] backdrop-blur-md pointer-events-auto shadow-xl">
          {FESTIVAL_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleSceneChange(scene)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeScene.id === scene.id
                  ? 'bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] text-[#140e06] shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#1a2436]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{scene.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating 3D Hotspot Interactive Points on 360 Stage */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Central 3D Festival Medallion Hotspot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-10 flex flex-col items-center">
          <button
            onClick={() => {
              setActiveHotspot(activeHotspot === 'mural' ? null : 'mural');
              if (onSelectHotspot) onSelectHotspot('mural');
            }}
            className="group relative p-2.5 rounded-2xl bg-[#121927]/85 hover:bg-[#192336] border border-[#c9a265]/70 hover:border-[#dfbe85] backdrop-blur-md shadow-[0_0_25px_rgba(201,162,101,0.4)] transition-all cursor-pointer transform hover:scale-105 active:scale-95 flex items-center space-x-2.5"
          >
            <div className="w-3 h-3 rounded-full bg-[#dfbe85] animate-ping" />
            <Sparkles className="w-4 h-4 text-[#dfbe85]" />
            <span className="text-xs font-bold text-white tracking-wide">
              Mural 3D de Pastas do Plantão
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Control Bar HUD */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center space-x-2 text-[11px] text-[#dfbe85] bg-[#0c111a]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#232f45] shadow-lg pointer-events-auto">
          <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#c9a265]" />
          <span>Arraste com o mouse ou toque para girar 360° em alta definição</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#0c111a]/90 border border-[#232f45] backdrop-blur-md pointer-events-auto shadow-xl hud-control">
          {/* Auto rotate */}
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isAutoRotate
                ? 'bg-[#c9a265] text-[#140e06]'
                : 'text-slate-400 hover:text-white hover:bg-[#1a2436]'
            }`}
            title={isAutoRotate ? 'Pausar Rotação 360°' : 'Iniciar Rotação Automática'}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin-slow' : ''}`} />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom('in')}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1a2436] transition-all cursor-pointer"
            title="Aproximar Visão (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom('out')}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1a2436] transition-all cursor-pointer"
            title="Afastar Visão (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Reset Zoom */}
          <button
            onClick={() => handleZoom('reset')}
            className="px-2 py-1 rounded-lg text-[10.5px] font-mono font-bold text-slate-300 hover:text-white hover:bg-[#1a2436] transition-all cursor-pointer"
            title="Redefinir Ângulo & Zoom"
          >
            100%
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1a2436] transition-all cursor-pointer"
            title={isFullscreen ? 'Reduzir Visão' : 'Expandir Visão 360°'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
