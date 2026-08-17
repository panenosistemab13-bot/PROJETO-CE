import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreePanoramaProps {
  imageUrl?: string;
  imageSrc?: string;
  interactive?: boolean;
  autoRotate?: boolean;
  rotateSpeed?: number;
  initialFov?: number;
}

export function ThreePanorama({
  imageUrl,
  imageSrc,
  interactive = true,
  autoRotate = true,
  rotateSpeed = 0.015,
  initialFov = 118,
}: ThreePanoramaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const srcToLoad = imageUrl || imageSrc || '';

  useEffect(() => {
    if (!containerRef.current || !srcToLoad) return;

    const container = containerRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup (Ultra HD wide-angle FOV matching Login360 for razor-sharp realism)
    const scene = new THREE.Scene();
    let currentFov = initialFov;
    const camera = new THREE.PerspectiveCamera(currentFov, width / height, 1, 2500);

    // 2. High-Performance WebGL Renderer (Optimized for 4K / Ultra-wide with sRGB and ACES Tone Mapping)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. High-Poly 360 Photosphere Geometry for perfect curvature and no seam artifacts
    const geometry = new THREE.SphereGeometry(900, 160, 80);
    geometry.scale(-1, 1, 1);

    // 4. Load Texture with Maximum Anisotropy, Mipmapping and sRGB color accuracy
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(srcToLoad, (tex) => {
      const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.anisotropy = maxAnisotropy;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
    });

    const material = new THREE.MeshBasicMaterial({ 
      map: texture,
      side: THREE.FrontSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 5. Floating 3D Golden Particles (Warm Coffee Aroma / Golden Embers matching Login360)
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

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc9a265,
      size: 3.2,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Navigation, Dragging & Inertia Physics
    let isUserInteracting = false;
    let onPointerDownMouseX = 0;
    let onPointerDownMouseY = 0;
    let lon = 0;
    let onPointerDownLon = 0;
    let lat = 0;
    let onPointerDownLat = 0;

    let dynamicRotateSpeed = autoRotate ? (rotateSpeed * 0.05) : 0;
    let targetLon = 0;
    let targetLat = 0;

    const onPointerDown = (event: PointerEvent) => {
      if (!interactive) return;
      const target = event.target as HTMLElement;
      if (target && target.closest('button, input, select, textarea, a, .interactive-card, table, modal, tr')) {
        return;
      }

      isUserInteracting = true;
      onPointerDownMouseX = event.clientX;
      onPointerDownMouseY = event.clientY;
      onPointerDownLon = lon;
      onPointerDownLat = lat;
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isUserInteracting) return;
      const clientX = event.clientX;
      const clientY = event.clientY;

      lon = (onPointerDownMouseX - clientX) * 0.15 + onPointerDownLon;
      lat = (clientY - onPointerDownMouseY) * 0.15 + onPointerDownLat;
    };

    const onPointerUp = () => {
      isUserInteracting = false;
      container.style.cursor = interactive ? 'grab' : 'default';
    };

    // Zoom on mouse wheel
    const onWheel = (event: WheelEvent) => {
      if (!interactive) return;
      currentFov = Math.max(50, Math.min(130, currentFov + event.deltaY * 0.05));
      camera.fov = currentFov;
      camera.updateProjectionMatrix();
    };

    container.style.cursor = interactive ? 'grab' : 'default';

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: true });

    // 7. Dynamic Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // 8. Animation & Render Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isUserInteracting && autoRotate) {
        lon += dynamicRotateSpeed;
      }

      // Constrain latitude to prevent gimbal flip
      lat = Math.max(-85, Math.min(85, lat));

      // Smooth interpolation (lerp) towards target values
      targetLon += (lon - targetLon) * 0.1;
      targetLat += (lat - targetLat) * 0.1;

      // Convert Spherical Coordinates to Cartesian Vector3
      const phi = THREE.MathUtils.degToRad(90 - targetLat);
      const theta = THREE.MathUtils.degToRad(targetLon);

      const target = new THREE.Vector3();
      target.x = 900 * Math.sin(phi) * Math.cos(theta);
      target.y = 900 * Math.cos(phi);
      target.z = 900 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(target);

      // Gently rotate ambient golden particle system
      if (particleSystem) {
        particleSystem.rotation.y += 0.0006;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup Resources on Unmount
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
  }, [srcToLoad, interactive, autoRotate, rotateSpeed, initialFov]);

  return (
    <div 
      id="3d-panorama-container" 
      ref={containerRef} 
      className="fixed inset-0 z-[-2] w-full h-full overflow-hidden select-none pointer-events-auto"
    />
  );
}
