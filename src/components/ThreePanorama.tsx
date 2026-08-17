import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreePanoramaProps {
  imageUrl?: string;
  imageSrc?: string;
  interactive?: boolean;
  autoRotate?: boolean;
  rotateSpeed?: number;
}

export function ThreePanorama({
  imageUrl,
  imageSrc,
  interactive = true,
  autoRotate = true,
  rotateSpeed = 0.015,
}: ThreePanoramaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const srcToLoad = imageUrl || imageSrc || '';

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1100);

    // 2. Renderer Setup (Premium High-DPI support for 4K / Ultra-wide monitors)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio to 2 for performance, still looks gorgeous on 4K
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 3. Create Sphere for photosphere mapping (increased segments for perfect 3D roundness and seam elimination)
    const geometry = new THREE.SphereGeometry(500, 128, 64);
    geometry.scale(-1, 1, 1);

    // 4. Load Texture with Premium UHD Anisotropy and SRGB color accuracy
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(srcToLoad, () => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      // Configure sRGB color space for pristine realistic colors
      texture.colorSpace = THREE.SRGBColorSpace;
    });

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 5. Navigation & Animation Variables
    let isUserInteracting = false;
    let onPointerDownMouseX = 0;
    let onPointerDownMouseY = 0;
    let lon = 0;
    let onPointerDownLon = 0;
    let lat = 0;
    let onPointerDownLat = 0;

    // Slow dynamic drift variables (inertia and natural movement)
    let dynamicRotateSpeed = autoRotate ? (rotateSpeed * 0.05) : 0;
    let targetLon = 0;
    let targetLat = 0;

    // 6. Event Handlers for Dragging (Active only when interactive mode is turned on)
    const onPointerDown = (event: PointerEvent) => {
      if (!interactive) return;
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

      // Adjust panning sensitivity for smooth feeling
      lon = (onPointerDownMouseX - clientX) * 0.15 + onPointerDownLon;
      lat = (clientY - onPointerDownMouseY) * 0.15 + onPointerDownLat;
    };

    const onPointerUp = () => {
      isUserInteracting = false;
      container.style.cursor = interactive ? 'grab' : 'default';
    };

    // Initialize cursor style
    container.style.cursor = interactive ? 'grab' : 'default';

    // Hook listeners
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 7. Dynamic Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // 8. Dynamic Animation Loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isUserInteracting) {
        // Slow continuous drift
        lon += dynamicRotateSpeed;
      }

      // Constrain latitude so we don't flip the camera upside down
      lat = Math.max(-85, Math.min(85, lat));

      // Smooth interpolation (lerp) towards target values
      targetLon += (lon - targetLon) * 0.1;
      targetLat += (lat - targetLat) * 0.1;

      // Convert Spherical Coordinates to Cartesian Vector3
      const phi = THREE.MathUtils.degToRad(90 - targetLat);
      const theta = THREE.MathUtils.degToRad(targetLon);

      const target = new THREE.Vector3();
      target.x = 500 * Math.sin(phi) * Math.cos(theta);
      target.y = 500 * Math.cos(phi);
      target.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(target);
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup Resources
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose geometry and materials
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, [srcToLoad, interactive, autoRotate, rotateSpeed]);

  return (
    <div 
      id="3d-panorama-container" 
      ref={containerRef} 
      className="fixed inset-0 z-[-2] w-full h-full overflow-hidden select-none"
    />
  );
}
