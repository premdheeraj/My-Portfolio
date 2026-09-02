'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function MetalScene({ theme }: { theme: 'dark' | 'light' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 6.6);

    const group = new THREE.Group();
    group.rotation.set(-0.2, 0.45, 0.25);
    scene.add(group);

    const geometry = new THREE.TorusKnotGeometry(1.28, 0.43, 220, 32, 2, 3);
    const material = new THREE.MeshPhysicalMaterial({
      color: theme === 'dark' ? 0xc7ccd2 : 0x8c9294,
      metalness: 1,
      roughness: 0.17,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.28,
      iridescenceIOR: 1.65,
    });
    const knot = new THREE.Mesh(geometry, material);
    group.add(knot);

    const wire = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.82, 0.008, 260, 8, 3, 5),
      new THREE.MeshBasicMaterial({
        color: theme === 'dark' ? 0xcaff61 : 0x6b970e,
        transparent: true,
        opacity: 0.72,
      }),
    );
    wire.rotation.set(0.7, -0.4, 0.2);
    group.add(wire);

    scene.add(
      new THREE.HemisphereLight(
        0xf0f5ff,
        theme === 'dark' ? 0x080909 : 0xb7bbb4,
        theme === 'dark' ? 2.1 : 2.8,
      ),
    );
    const key = new THREE.PointLight(0xffffff, theme === 'dark' ? 55 : 38, 20);
    key.position.set(3, 3, 5);
    scene.add(key);
    const accent = new THREE.PointLight(0xbfff4f, theme === 'dark' ? 42 : 30, 18);
    accent.position.set(-3, -2, 3);
    scene.add(accent);
    const blue = new THREE.PointLight(0x7f93ff, theme === 'dark' ? 28 : 22, 15);
    blue.position.set(2, -3, 1);
    scene.add(blue);

    const pointer = new THREE.Vector2();
    const updatePointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', updatePointer, { passive: true });

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement ?? canvas);
    resize();

    const clock = new THREE.Clock();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    const render = () => {
      const time = clock.getElapsedTime();
      group.rotation.y += 0.0025;
      group.rotation.x += (pointer.y * 0.12 - group.rotation.x) * 0.025;
      group.rotation.z += (pointer.x * 0.1 + 0.22 - group.rotation.z) * 0.025;
      knot.position.y = Math.sin(time * 0.8) * 0.08;
      wire.rotation.z = time * 0.08;
      renderer.render(scene, camera);
      if (!reduceMotion) frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', updatePointer);
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="metal-canvas" aria-hidden="true" />;
}
