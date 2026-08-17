import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  RotateCw,
  Compass,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Heart,
  KeyRound,
  Radio,
  Clock,
  ShieldCheck,
  Building2,
  Move3D,
  LogIn,
  Eye as ViewIcon,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Info,
  ChevronLeft,
  ChevronRight,
  Hand,
} from 'lucide-react';

import tresCoracoes360Img from '../assets/images/tres_coracoes_360_panorama_1786974698163.jpg';
import eusebio360Img from '../assets/images/eusebio_factory_ultra_hd_360_1786943148780.jpg';
import joaoLima360Img from '../assets/images/edificio_joao_lima_360_1786970922827.jpg';
import medallionImg from '../assets/images/medallion_dark_3c_1786935069743.jpg';
import { getAuthUsers, User as AuthUser } from '../lib/authStore';

interface Login360Props {
  onLoginSuccess: (user: AuthUser) => void;
}

interface PanoramaScene {
  id: string;
  name: string;
  subtitle: string;
  image: string;
}

const PANORAMA_SCENES: PanoramaScene[] = [
  {
    id: 'sede_joao_lima',
    name: 'Sede Administrativa João Lima',
    subtitle: 'Centro Corporativo & CCO 360°',
    image: joaoLima360Img,
  },
];

export function Login360({ onLoginSuccess }: Login360Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeScene, setActiveScene] = useState<PanoramaScene>(PANORAMA_SCENES[0]);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  
  // Wallpaper Only / Immersive 360 Free Exploration Mode
  const [isWallpaperOnlyMode, setIsWallpaperOnlyMode] = useState(false);

  // 360 WebGL Panorama Refs & Controls
  // Default FOV set to 118 for a significantly zoomed-out panoramic wide vista without edge cutoff
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const isInteractingRef = useRef(false);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const targetLonRef = useRef(0);
  const targetLatRef = useRef(0);
  const fovRef = useRef(118); // Substantially wide angle (zoomed out) as requested
  const isAutoRotateRef = useRef(isAutoRotate);

  useEffect(() => {
    isAutoRotateRef.current = isAutoRotate;
  }, [isAutoRotate]);

  // Keyboard navigation for 360 view (Arrow keys and ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isWallpaperOnlyMode) {
        setIsWallpaperOnlyMode(false);
      }
      // Arrow keys for smooth rotation
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '-'].includes(e.key)) {
        const target = e.target as HTMLElement;
        if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

        if (e.key === 'ArrowLeft') lonRef.current -= 5;
        if (e.key === 'ArrowRight') lonRef.current += 5;
        if (e.key === 'ArrowUp') latRef.current += 4;
        if (e.key === 'ArrowDown') latRef.current -= 4;
        if (e.key === '+' || e.key === '=') handleZoom('in');
        if (e.key === '-') handleZoom('out');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWallpaperOnlyMode]);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Three.js 360 Panorama & Golden Ambient Floating Particles
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup (High-Precision 4K field of view with expanded wide angle)
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 2000);
    cameraRef.current = camera;

    // 2. High-Performance WebGL Renderer (optimized for 4K / Ultra-wide)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. 360 Photosphere Geometry with High Poly Count for ultra-smoothness
    const geometry = new THREE.SphereGeometry(900, 160, 80);
    geometry.scale(-1, 1, 1);

    const textureLoader = new THREE.TextureLoader();
    textureLoaderRef.current = textureLoader;

    const texture = textureLoader.load(activeScene.image, () => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
    });

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh);

    // 4. Floating 3D Golden Particles (Warm coffee aroma embers / golden dust in 4K)
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 600;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 450;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 600;
      particleScales[i] = Math.random() * 2 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    // Particle Material with Golden Ambient Glow
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc9a265,
      size: 3.5,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Pointer Interaction Handling
    let onPointerDownMouseX = 0;
    let onPointerDownMouseY = 0;
    let onPointerDownLon = 0;
    let onPointerDownLat = 0;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('#login-glass-card, button, input, a, .interactive-hud, modal')) {
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
      const target = e.target as HTMLElement;
      if (target && target.closest('#login-glass-card, .interactive-hud')) return;
      
      // Expand FOV limit up to 135 degrees for very wide zoom-out capability
      fovRef.current = Math.max(50, Math.min(135, fovRef.current + e.deltaY * 0.08));
      if (cameraRef.current) {
        cameraRef.current.fov = fovRef.current;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    container.style.cursor = 'grab';
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: true });

    // 6. Resize Observer for 4K and ultra-wide screens
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 7. Animation Loop with smooth inertial lerping
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isInteractingRef.current && isAutoRotateRef.current) {
        lonRef.current += 0.045;
      }

      // Constrain latitude so view doesn't flip
      latRef.current = Math.max(-85, Math.min(85, latRef.current));

      // Lerp for cinematic smoothness
      targetLonRef.current += (lonRef.current - targetLonRef.current) * 0.09;
      targetLatRef.current += (latRef.current - targetLatRef.current) * 0.09;

      const phi = THREE.MathUtils.degToRad(90 - targetLatRef.current);
      const theta = THREE.MathUtils.degToRad(targetLonRef.current);

      const target = new THREE.Vector3(
        800 * Math.sin(phi) * Math.cos(theta),
        800 * Math.cos(phi),
        800 * Math.sin(phi) * Math.sin(theta)
      );

      camera.lookAt(target);

      // Animate floating gold particles
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.16;
        if (positions[i * 3 + 1] > 220) {
          positions[i * 3 + 1] = -220;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;
      particleSystem.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      texture.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  // Update Texture when scene changes
  useEffect(() => {
    if (!meshRef.current || !textureLoaderRef.current) return;
    const loader = textureLoaderRef.current;
    loader.load(activeScene.image, (newTex) => {
      newTex.minFilter = THREE.LinearFilter;
      newTex.magFilter = THREE.LinearFilter;
      newTex.colorSpace = THREE.SRGBColorSpace;
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshBasicMaterial;
        mat.map = newTex;
        mat.needsUpdate = true;
      }
    });
  }, [activeScene]);

  // Zoom Controls
  const handleZoom = (direction: 'in' | 'out' | 'wide' | 'reset') => {
    if (!cameraRef.current) return;
    if (direction === 'in') {
      fovRef.current = Math.max(50, fovRef.current - 14);
    } else if (direction === 'out') {
      fovRef.current = Math.min(135, fovRef.current + 14);
    } else {
      fovRef.current = 118; // Wide default (zoomed out, no clipping)
      lonRef.current = 0;
      latRef.current = 0;
    }
    cameraRef.current.fov = fovRef.current;
    cameraRef.current.updateProjectionMatrix();
  };

  // Quick Pre-Fill Helper (crisfialho / 123)
  const handleQuickFill = () => {
    setUsername('crisfialho');
    setPassword('123');
    setErrorMsg(null);
    setSuccessMsg('Credenciais preenchidas: crisfialho / 123');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Handle Login Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMsg('Por favor, informe o usuário e a senha de acesso.');
      return;
    }

    setIsLoading(true);

    // Validate against user requirement (login: crisfialho, senha: 123)
    setTimeout(() => {
      const users = getAuthUsers();
      const user = users.find(u => u.login.toLowerCase() === cleanUser && u.password === cleanPass);

      if (user) {
        setSuccessMsg('Acesso autorizado! Carregando CCO 3Corações...');
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(user);
        }, 800);
      } else {
        setIsLoading(false);
        setErrorMsg('Credenciais inválidas. Verifique usuário e senha.');
      }
    }, 600);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#070a0f] text-slate-100 select-none flex flex-col justify-between font-sans">
      {/* 3D Container for Three.js 360-Degree Wallpaper */}
      <div
        id="3d-login-360-container"
        ref={containerRef}
        className="absolute inset-0 w-full h-full z-0 overflow-hidden"
      />

      {/* Empty specific containers prepared for external Three.js / Spline models as requested */}
      <div id="3d-cup-container" className="hidden" aria-hidden="true" />
      <div id="3d-map-container" className="hidden" aria-hidden="true" />
      <div id="3d-particle-field" className="hidden" aria-hidden="true" />
      <div id="3d-hero-container" className="hidden" aria-hidden="true" />

      {/* Soft Vignette & Subtle Golden Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none z-[1] bg-gradient-to-t from-[#070a0f]/80 via-transparent to-[#070a0f]/50" />
      <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(201,162,101,0.04),transparent_90%)]" />

      {/* =========================================================================
          MODE 1: IMMERSIVE 360 WALLPAPER ONLY HUD (100% FREE EXPLORATION)
      ========================================================================= */}
      {isWallpaperOnlyMode && (
        <div className="relative z-20 w-full h-full flex flex-col justify-between p-4 sm:p-6 pointer-events-none animate-in fade-in duration-300">
          {/* Top Floating Immersive Bar */}
          <div className="flex items-center justify-between w-full pointer-events-auto">
            {/* Left Brand Badge */}
            <div className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-[#0c1017]/85 border border-[#c9a265]/40 backdrop-blur-md shadow-2xl">
              <div className="w-8 h-8 rounded-full border border-[#c9a265] bg-gradient-to-b from-[#241e15] to-[#120f0a] flex items-center justify-center">
                <Heart className="w-4 h-4 text-[#c9a265] fill-[#c9a265]/25" />
              </div>
              <div>
                <span className="text-[10px] tracking-[0.2em] text-[#c9a265] uppercase font-bold block">
                  CAFÉ 3 CORAÇÕES
                </span>
                <span className="text-xs font-semibold text-white">
                  {activeScene.name}
                </span>
              </div>
            </div>

            {/* Center Hint & Interaction Tips */}
            <div className="hidden lg:flex items-center space-x-3 px-5 py-2 rounded-full bg-[#121824]/90 border border-[#242d3d] backdrop-blur-md text-xs text-slate-200 shadow-xl">
              <Move3D className="w-4 h-4 text-[#c9a265] animate-pulse" />
              <span>Arraste o mouse em qualquer direção ou use o scroll para navegar em 360 graus</span>
            </div>

            {/* Right Return to Login Button */}
            <button
              onClick={() => setIsWallpaperOnlyMode(false)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] text-[#140e06] font-extrabold text-xs sm:text-sm shadow-[0_0_25px_rgba(201,162,101,0.5)] hover:scale-105 transition-all cursor-pointer active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Voltar ao Login (ESC)</span>
            </button>
          </div>

          {/* Bottom Floating 360 Controls in Immersive Mode */}
          <div className="flex flex-wrap items-center justify-between w-full gap-3 pointer-events-auto bg-[#0c1017]/85 border border-[#c9a265]/35 backdrop-blur-md p-3 rounded-2xl shadow-2xl">
            {/* Scene Selector */}
            <div className="flex items-center space-x-2 overflow-x-auto custom-scroll">
              <span className="text-[10px] text-[#c9a265] font-bold uppercase tracking-wider hidden sm:inline">
                Ambiente 360°:
              </span>
              {PANORAMA_SCENES.map((scene) => {
                const isActive = activeScene.id === scene.id;
                return (
                  <button
                    key={scene.id}
                    onClick={() => setActiveScene(scene)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[#c9a265] text-[#140e06] border-white shadow-md font-bold'
                        : 'bg-[#151b26]/90 text-slate-300 border-[#242d3d] hover:border-[#c9a265]/50 hover:text-white'
                    }`}
                  >
                    <Compass className={`w-3.5 h-3.5 ${isActive ? 'text-[#140e06]' : 'text-[#c9a265]'}`} />
                    <span>{scene.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Camera Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isAutoRotate
                    ? 'bg-[#241e15] text-[#dfbe85] border-[#c9a265]'
                    : 'bg-[#151b26] text-slate-400 border-[#242d3d] hover:text-white'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '10s' }} />
                <span>{isAutoRotate ? 'Auto-Giro Ativo' : 'Giro Pausado'}</span>
              </button>

              <button
                onClick={() => handleZoom('in')}
                title="Aproximar Zoom (+)"
                className="w-8 h-8 rounded-xl bg-[#151b26] border border-[#242d3d] hover:border-[#c9a265] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ZoomIn className="w-4 h-4 text-[#c9a265]" />
              </button>

              <button
                onClick={() => handleZoom('out')}
                title="Afastar Zoom / Visão Ampla (-)"
                className="w-8 h-8 rounded-xl bg-[#151b26] border border-[#242d3d] hover:border-[#c9a265] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ZoomOut className="w-4 h-4 text-[#c9a265]" />
              </button>

              <button
                onClick={() => handleZoom('reset')}
                title="Resetar Ângulo & Visão Panorâmica Ampla"
                className="px-3 py-1.5 rounded-xl bg-[#151b26] border border-[#242d3d] hover:border-[#c9a265] text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#c9a265]" />
                <span className="hidden md:inline">Visão Ampla 4K</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 2: CLEAN MINIMALIST LOGIN INTERFACE (NO TOP/BOTTOM BARS)
      ========================================================================= */}
      {!isWallpaperOnlyMode && (
        <main className="relative z-10 w-full h-full flex items-center justify-center p-4">
          <div
            id="login-glass-card"
            className="w-full max-w-[400px] 2xl:max-w-[430px] rounded-3xl bg-[#0c1017]/85 border border-[#c9a265]/45 backdrop-blur-2xl p-5 sm:p-6 2xl:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(201,162,101,0.15)] relative overflow-hidden transition-all"
          >
            {/* Top Golden Light Edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a265] to-transparent" />
            
            {/* Subtle Ambient Radial Highlight inside card */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#c9a265]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header Top Row */}
            <div className="flex items-center justify-end w-full mb-2.5 relative z-10">
              {/* Direct quick button to minimize card into 360 wallpaper mode */}
              <button
                type="button"
                onClick={() => setIsWallpaperOnlyMode(true)}
                title="Ocultar formulário para ver o papel de parede completo em 360°"
                className="flex items-center space-x-1.5 text-[11px] font-semibold text-[#c9a265] hover:text-white hover:underline cursor-pointer transition-colors bg-[#151b26]/70 px-2.5 py-1 rounded-lg border border-[#242d3d]"
              >
                <Move3D className="w-3.5 h-3.5" />
                <span>Ver Papel de Parede 360°</span>
              </button>
            </div>

            {/* Medallion & Title Header */}
            <div className="flex flex-col items-center text-center mb-4 relative z-10">
              <div className="w-16 h-16 2xl:w-20 2xl:h-20 rounded-full p-1 border-2 border-[#c9a265] shadow-[0_0_20px_rgba(201,162,101,0.35)] relative mb-2 bg-[#120f0a] group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={medallionImg}
                    alt="Grupo 3Corações"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#c9a265] text-[#140e06] flex items-center justify-center font-bold text-[8.5px] shadow-md">
                  <Shield className="w-2.5 h-2.5 fill-[#140e06]" />
                </div>
              </div>

              <span className="text-[9.5px] 2xl:text-[10.5px] font-bold text-[#c9a265] tracking-[0.25em] uppercase">
                AUTENTIFICAÇÃO
              </span>
              <h2 className="text-base 2xl:text-lg font-serif font-bold text-white tracking-tight mt-0.5">
                Gerenciamento de risco
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-[310px]">
                Insira suas credenciais corporativas do Grupo 3corações.
              </p>
            </div>

            {/* Feedback Messages */}
            {errorMsg && (
              <div className="mb-3 p-2 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-center space-x-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-3 p-2 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs flex items-center space-x-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3 relative z-10">
              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-[10.5px] 2xl:text-[11px] font-bold text-slate-300 block">
                  Usuário / Identificação
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-slate-400 pointer-events-none">
                    <User className="w-4 h-4 text-[#c9a265]" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuário"
                    autoComplete="username"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141b26]/90 border border-[#242d3d] focus:border-[#c9a265] focus:ring-1 focus:ring-[#c9a265] text-slate-100 text-xs sm:text-sm placeholder:text-slate-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10.5px] 2xl:text-[11px] font-bold text-slate-300 block">
                    Senha de Acesso
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-[10px] text-[#c9a265] hover:underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4 text-[#c9a265]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    autoComplete="current-password"
                    className="w-full pl-9 pr-10 py-2 rounded-xl bg-[#141b26]/90 border border-[#242d3d] focus:border-[#c9a265] focus:ring-1 focus:ring-[#c9a265] text-slate-100 text-xs sm:text-sm placeholder:text-slate-500 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-200 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#c9a265]" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-0.5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-700 bg-[#141b26] text-[#c9a265] accent-[#c9a265] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[10.5px] text-slate-300">Lembrar dispositivo</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1 py-2.5 rounded-xl bg-gradient-to-r from-[#dfbe85] via-[#c9a265] to-[#a37c3f] hover:opacity-95 text-[#140e06] font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-[0_4px_20px_rgba(201,162,101,0.4)] transition-all cursor-pointer active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Validando Credenciais...</span>
                  </>
                ) : (
                  <>
                    <span>ACESSAR CENTRAL DE OPERAÇÕES</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </main>
      )}

      {/* HELP / FORGOT PASSWORD MODAL */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0f141d] border border-[#c9a265]/60 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#241e15] border border-[#c9a265]/50 flex items-center justify-center text-[#c9a265]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Suporte & Recuperação de Acesso</h3>
                <p className="text-xs text-slate-400">Segurança da Informação CCO</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed mb-6">
              <p>
                Para recuperar a sua senha corporativa ou solicitar um novo token de acesso, utilize os dados padrão de homologação:
              </p>
              <div className="p-3 rounded-xl bg-[#151b26] border border-[#242d3d] space-y-1 font-mono">
                <div className="text-slate-400">Usuário Padrão: <span className="text-[#dfbe85] font-bold">crisfialho</span></div>
                <div className="text-slate-400">Senha Padrão: <span className="text-[#dfbe85] font-bold">123</span></div>
              </div>
              <p>
                Em caso de bloqueio permanente ou dúvidas operacionais, contate a Central de Monitoramento pelo ramal interno <strong>#3420</strong> ou envie mensagem para <strong>seguranca@3coracoes.com.br</strong>.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-5 py-2 rounded-xl bg-[#c9a265] text-[#140e06] font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
