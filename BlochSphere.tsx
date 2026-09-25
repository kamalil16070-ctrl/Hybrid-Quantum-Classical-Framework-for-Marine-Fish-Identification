/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';

interface BlochSphereProps {
  theta: number; // polar angle in radians (0 to PI)
  phi: number;   // azimuthal angle in radians (0 to 2*PI)
}

export default function BlochSphere({ theta, phi }: BlochSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: -0.5, y: 0.6 }); // Initial 3D viewing angle
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Calculate 3D coordinates on Bloch Sphere:
  // x = sin(theta) * cos(phi)
  // y = sin(theta) * sin(phi)
  // z = cos(theta)
  const stateX = Math.sin(theta) * Math.cos(phi);
  const stateY = Math.sin(theta) * Math.sin(phi);
  const stateZ = Math.cos(theta);

  // Mouse handler to rotate the sphere
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    setRotation(prev => ({
      x: prev.x + dy * 0.01,
      y: prev.y + dx * 0.01
    }));

    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.35;

      ctx.clearRect(0, 0, width, height);

      // 3D rotation projection matrix
      const cosX = Math.cos(rotation.x);
      const sinX = Math.sin(rotation.x);
      const cosY = Math.cos(rotation.y);
      const sinY = Math.sin(rotation.y);

      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        // Rotate around X axis
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Orthographic projection
        return {
          x: centerX + x1 * radius,
          y: centerY - y2 * radius,
          z: z2 // depth factor
        };
      };

      // Draw background glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius * 1.5);
      glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.08)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // --- Draw Reference Axes ---
      ctx.lineWidth = 1;
      
      const drawAxis = (x: number, y: number, z: number, color: string, label: string) => {
        const pStart = project(0, 0, 0);
        const pEnd = project(x * 1.2, y * 1.2, z * 1.2);
        
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = '10px monospace';
        ctx.fillText(label, pEnd.x + 4, pEnd.y + 4);
      };

      // Draw Axes (X=cyan, Y=emerald, Z=violet)
      drawAxis(1, 0, 0, 'rgba(6, 182, 212, 0.6)', 'X');
      drawAxis(0, 1, 0, 'rgba(16, 185, 129, 0.6)', 'Y');
      drawAxis(0, 0, 1, 'rgba(139, 92, 246, 0.6)', 'Z');

      // --- Draw Outer Wireframe Circles ---
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;

      // 1. Equator circle (xy-plane)
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const p = project(Math.cos(angle), Math.sin(angle), 0);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // 2. Prime meridian circle (xz-plane)
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const p = project(Math.cos(angle), 0, Math.sin(angle));
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // 3. YZ circle (yz-plane)
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const p = project(0, Math.cos(angle), Math.sin(angle));
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // --- State Labels on poles ---
      const drawPoleLabel = (x: number, y: number, z: number, label: string) => {
        const p = project(x, y, z);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(label, p.x - 8, p.y - 8);
      };

      drawPoleLabel(0, 0, 1.05, '|0⟩'); // North Pole
      drawPoleLabel(0, 0, -1.05, '|1⟩'); // South Pole
      drawPoleLabel(1.05, 0, 0, '|+⟩'); // X+
      drawPoleLabel(0, 1.05, 0, '|+i⟩'); // Y+

      // --- Draw State Vector ---
      const pCenter = project(0, 0, 0);
      const pState = project(stateX, stateY, stateZ);

      // Draw dashed reference lines from state vector to poles/equator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([2, 2]);
      
      // Line to xy equator plane
      const pEquatorRef = project(stateX, stateY, 0);
      ctx.beginPath();
      ctx.moveTo(pState.x, pState.y);
      ctx.lineTo(pEquatorRef.x, pEquatorRef.y);
      ctx.stroke();

      // Line from equator point to center
      ctx.beginPath();
      ctx.moveTo(pCenter.x, pCenter.y);
      ctx.lineTo(pEquatorRef.x, pEquatorRef.y);
      ctx.stroke();
      
      ctx.setLineDash([]); // Reset line dash

      // Draw actual State Vector (bold glowing gradient line)
      ctx.lineWidth = 3;
      const vectorGrad = ctx.createLinearGradient(pCenter.x, pCenter.y, pState.x, pState.y);
      vectorGrad.addColorStop(0, '#06b6d4');
      vectorGrad.addColorStop(1, '#ec4899');
      ctx.strokeStyle = vectorGrad;
      
      ctx.beginPath();
      ctx.moveTo(pCenter.x, pCenter.y);
      ctx.lineTo(pState.x, pState.y);
      ctx.stroke();

      // Draw end-point node (state sphere)
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(pState.x, pState.y, 5, 0, Math.PI * 2);
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Draw angle labels
      ctx.fillStyle = 'rgba(6, 182, 212, 0.9)';
      ctx.font = '10px monospace';
      ctx.fillText(`θ = ${(theta * 180 / Math.PI).toFixed(1)}°`, 10, height - 25);
      ctx.fillText(`φ = ${(phi * 180 / Math.PI).toFixed(1)}°`, 10, height - 10);
    };

    const anim = () => {
      render();
      animationFrameId = requestAnimationFrame(anim);
    };

    anim();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rotation, theta, phi, stateX, stateY, stateZ]);

  return (
    <div className="relative flex flex-col items-center">
      <div 
        className="cursor-grab active:cursor-grabbing bg-slate-950/40 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] p-2 backdrop-blur-md"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas 
          ref={canvasRef} 
          width={300} 
          height={300} 
          className="w-full max-w-[280px] h-[280px]"
        />
      </div>
      <span className="text-xs text-cyan-300/60 mt-2 text-center select-none">
        Drag to rotate Bloch Sphere in 3D Space
      </span>
    </div>
  );
}
