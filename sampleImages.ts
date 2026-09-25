/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Helper to generate realistic sample underwater images as base64 Data URLs for testing
export function createSampleUnderwaterImage(speciesKey: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. Draw underwater gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 480);
  bgGrad.addColorStop(0, '#0c4a6e'); // Deep sky blue top
  bgGrad.addColorStop(0.4, '#075985');
  bgGrad.addColorStop(1, '#082f49'); // Dark ocean floor
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 640, 480);

  // 2. Add water caustics / light rays
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(80 * i, 0);
    ctx.lineTo(80 * i + 120, 0);
    ctx.lineTo(80 * i + 60, 480);
    ctx.lineTo(80 * i - 20, 480);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 3. Add seabed/coral elements at bottom
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(0, 420);
  ctx.quadraticCurveTo(200, 390, 400, 430);
  ctx.quadraticCurveTo(550, 460, 640, 410);
  ctx.lineTo(640, 480);
  ctx.lineTo(0, 480);
  ctx.closePath();
  ctx.fill();

  // 4. Draw species specific morphological silhouette
  ctx.save();
  ctx.translate(320, 220);
  ctx.scale(1.6, 1.6);
  ctx.translate(-150, -50);

  if (speciesKey === 'sturgeon') {
    // Chinese Sturgeon - elongated armored body
    ctx.fillStyle = '#334155';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(10, 50);
    ctx.quadraticCurveTo(40, 30, 80, 35);
    ctx.quadraticCurveTo(150, 45, 200, 42);
    ctx.lineTo(270, 30);
    ctx.quadraticCurveTo(280, 50, 270, 70);
    ctx.lineTo(240, 52);
    ctx.quadraticCurveTo(150, 55, 80, 65);
    ctx.quadraticCurveTo(40, 70, 10, 50);
    ctx.fill();
    // Bony scutes
    ctx.fillStyle = '#94a3b8';
    for (let s = 40; s < 220; s += 30) {
      ctx.beginPath();
      ctx.arc(s, 38, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (speciesKey === 'sawfish') {
    // Sawfish - rostrum saw
    ctx.fillStyle = '#115e59';
    ctx.shadowColor = '#2dd4bf';
    ctx.shadowBlur = 15;
    // Rostrum saw
    ctx.fillRect(5, 48, 75, 4);
    for (let t = 10; t < 80; t += 6) {
      ctx.fillRect(t, 45, 2, 3);
      ctx.fillRect(t, 52, 2, 3);
    }
    // Body
    ctx.beginPath();
    ctx.moveTo(80, 50);
    ctx.quadraticCurveTo(110, 30, 160, 35);
    ctx.lineTo(270, 30);
    ctx.quadraticCurveTo(280, 50, 270, 70);
    ctx.lineTo(160, 65);
    ctx.quadraticCurveTo(110, 70, 80, 50);
    ctx.fill();
  } else if (speciesKey === 'whaleshark') {
    // Whale shark - massive body with spots
    ctx.fillStyle = '#0369a1';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(10, 50);
    ctx.quadraticCurveTo(40, 20, 90, 22);
    ctx.lineTo(250, 38);
    ctx.lineTo(280, 20);
    ctx.quadraticCurveTo(290, 50, 280, 80);
    ctx.lineTo(250, 62);
    ctx.quadraticCurveTo(90, 78, 10, 50);
    ctx.fill();
    // Spots
    ctx.fillStyle = '#ffffff';
    for (let x = 60; x < 230; x += 22) {
      for (let y = 32; y < 68; y += 16) {
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (speciesKey === 'hammerhead') {
    // Hammerhead - cephalofoil head
    ctx.fillStyle = '#1e293b';
    ctx.shadowColor = '#cbd5e1';
    ctx.shadowBlur = 15;
    // Cephalofoil head
    ctx.fillRect(5, 30, 25, 40);
    // Body
    ctx.beginPath();
    ctx.moveTo(30, 50);
    ctx.quadraticCurveTo(60, 30, 110, 35);
    ctx.lineTo(280, 25);
    ctx.quadraticCurveTo(290, 50, 280, 75);
    ctx.lineTo(110, 65);
    ctx.quadraticCurveTo(60, 70, 30, 50);
    ctx.fill();
  } else if (speciesKey === 'wrasse') {
    // Humphead wrasse - bulbous hump
    ctx.fillStyle = '#0284c7';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(10, 50);
    ctx.quadraticCurveTo(30, 15, 90, 20);
    ctx.lineTo(250, 42);
    ctx.lineTo(275, 32);
    ctx.lineTo(275, 68);
    ctx.lineTo(250, 58);
    ctx.quadraticCurveTo(90, 80, 10, 50);
    ctx.fill();
    // Forehead hump
    ctx.beginPath();
    ctx.arc(70, 22, 14, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Non-target Clownfish (Out of distribution test)
    ctx.fillStyle = '#ea580c'; // Vibrant orange
    ctx.shadowColor = '#fdba74';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(150, 50, 70, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tail fin
    ctx.beginPath();
    ctx.moveTo(220, 50);
    ctx.lineTo(260, 25);
    ctx.lineTo(260, 75);
    ctx.closePath();
    ctx.fill();
    // White stripes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(120, 15, 12, 70);
    ctx.fillRect(160, 18, 12, 64);
  }

  ctx.restore();

  // 5. Add watermark text indicating sample test image
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`SAMPLE_TEST_DATASET: ${speciesKey.toUpperCase()}`, 15, 465);

  return canvas.toDataURL('image/jpeg', 0.92);
}
