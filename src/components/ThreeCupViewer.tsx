import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeCupViewer() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 4.5);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group for rotation
    const group = new THREE.Group();
    scene.add(group);

    // Materials
    const cupMaterial = new THREE.MeshStandardMaterial({
      color: 0xFDFCFB,
      roughness: 0.15,
      metalness: 0.1,
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9a265,
      roughness: 0.25,
      metalness: 0.95,
    });

    const coffeeMaterial = new THREE.MeshStandardMaterial({
      color: 0x22130c,
      roughness: 0.1,
      metalness: 0.3,
    });

    // 1. Cup body (Cylinder with taper)
    const cupGeometry = new THREE.CylinderGeometry(0.85, 0.65, 1.2, 32, 1, true);
    const cupMesh = new THREE.Mesh(cupGeometry, cupMaterial);
    cupMesh.position.y = 0.6;
    group.add(cupMesh);

    // Cup Base
    const baseGeometry = new THREE.CylinderGeometry(0.65, 0.65, 0.08, 32);
    const baseMesh = new THREE.Mesh(baseGeometry, cupMaterial);
    baseMesh.position.y = 0.04;
    group.add(baseMesh);

    // Gold Rim
    const rimGeometry = new THREE.TorusGeometry(0.85, 0.04, 16, 64);
    const rimMesh = new THREE.Mesh(rimGeometry, goldMaterial);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 1.2;
    group.add(rimMesh);

    // Coffee Liquid surface
    const liquidGeometry = new THREE.CircleGeometry(0.82, 32);
    const liquidMesh = new THREE.Mesh(liquidGeometry, coffeeMaterial);
    liquidMesh.rotation.x = -Math.PI / 2;
    liquidMesh.position.y = 1.1;
    group.add(liquidMesh);

    // Coffee Foam Spiral
    const foamGeometry = new THREE.RingGeometry(0.1, 0.5, 32);
    const foamMaterial = new THREE.MeshStandardMaterial({
      color: 0x966d3a,
      roughness: 0.8,
      transparent: true,
      opacity: 0.6,
    });
    const foamMesh = new THREE.Mesh(foamGeometry, foamMaterial);
    foamMesh.rotation.x = -Math.PI / 2;
    foamMesh.position.y = 1.102;
    group.add(foamMesh);

    // Cup Handle (Torus segment)
    const handleGeometry = new THREE.TorusGeometry(0.4, 0.08, 16, 32, Math.PI * 1.2);
    const handleMesh = new THREE.Mesh(handleGeometry, goldMaterial);
    handleMesh.position.set(0.9, 0.6, 0);
    handleMesh.rotation.z = -Math.PI / 2.8;
    group.add(handleMesh);

    // Saucer Plate
    const saucerGeometry = new THREE.CylinderGeometry(1.4, 0.9, 0.1, 32);
    const saucerMesh = new THREE.Mesh(saucerGeometry, cupMaterial);
    saucerMesh.position.y = -0.05;
    group.add(saucerMesh);

    const saucerRimGeo = new THREE.TorusGeometry(1.4, 0.03, 16, 64);
    const saucerRimMesh = new THREE.Mesh(saucerRimGeo, goldMaterial);
    saucerRimMesh.rotation.x = Math.PI / 2;
    saucerRimMesh.position.y = 0.0;
    group.add(saucerRimMesh);

    // 3C Emblem on the Cup (Front)
    const emblemGeo = new THREE.CircleGeometry(0.22, 24);
    const emblemMat = new THREE.MeshBasicMaterial({ color: 0xc9a265, side: THREE.DoubleSide });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.position.set(0, 0.65, 0.81);
    group.add(emblem);

    // Steam particles
    const particleCount = 28;
    const particleGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0xe5d0b1,
      transparent: true,
      opacity: 0.35,
    });

    const particles: { mesh: THREE.Mesh; speed: number; startY: number; radius: number; angle: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      const startY = 1.15 + Math.random() * 0.8;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.3;
      p.position.set(Math.cos(angle) * radius, startY, Math.sin(angle) * radius);
      scene.add(p);
      particles.push({
        mesh: p,
        speed: 0.006 + Math.random() * 0.008,
        startY: 1.15,
        radius: radius,
        angle: angle,
      });
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xfff3e0, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xc9a265, 3, 10);
    pointLight.position.set(3, 4, 3);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0x60a5fa, 1.5, 10);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // Interaction / Mouse Drag
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      group.rotation.y += deltaX * 0.01;
      group.rotation.x = Math.max(-0.2, Math.min(0.4, group.rotation.x + deltaY * 0.005));
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        group.rotation.y += 0.008;
      }

      // Steam animation
      particles.forEach((p) => {
        p.mesh.position.y += p.speed;
        p.angle += 0.02;
        p.mesh.position.x = Math.cos(p.angle) * (p.radius + (p.mesh.position.y - p.startY) * 0.2);
        p.mesh.position.z = Math.sin(p.angle) * (p.radius + (p.mesh.position.y - p.startY) * 0.2);

        const progress = (p.mesh.position.y - p.startY) / 1.4;
        if (progress >= 1) {
          p.mesh.position.y = p.startY;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 300;
      const newHeight = container.clientHeight || 180;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      id="3d-cup-container"
      ref={mountRef}
      className="w-full h-full min-h-[170px] relative flex items-center justify-center cursor-grab active:cursor-grabbing"
      title="Modelo 3D Interativo: Xícara Três Corações (Arraste para girar)"
    />
  );
}
