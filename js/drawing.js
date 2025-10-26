// drawing.js
/**
 * Draws road layout, vehicles, casualties, and hazards (incl. EV Battery Fire).
 */

export function drawSetupScene(canvas, scenario) {
  if (!canvas || !scenario) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Background
  ctx.clearRect(0, 0, W, H);
  drawRoadLayout(ctx, W, H, scenario.layoutType);

  // Hazards first
  (scenario.environmentalObjects || []).forEach(h => drawHazard(ctx, h));

  // Vehicles & casualties
  (scenario.vehicles || []).forEach((v, idx) => {
    drawVehicle(ctx, v.x, v.y, v.position.rotation, v.color, String.fromCharCode(65 + idx), v.type, v.isEV, v.hasUHSS);
    if (v.impactType === 'frontal') {
      drawImpact(ctx, v.x, v.y, v.position.rotation, 60);
    } else if (v.impactType === 'side') {
      drawSideImpact(ctx, v.x, v.y, v.position.rotation, v.impactSide);
    }
    (v.casualties || []).forEach((cas, ci) => {
      const ox = (ci % 2 === 0 ? -20 : 20) + rand(-8, 8);
      const oy = (ci < 2 ? -26 : 18) + rand(-6, 6);
      drawCasualty(ctx, v.x + rotateX(ox, oy, v.position.rotation), v.y + rotateY(ox, oy, v.position.rotation), `C${cas.id + 1}`);
    });
  });
}

function drawRoadLayout(ctx, W, H, type) {
  // Grass
  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, W, H);

  // Road
  ctx.fillStyle = '#4b5563';
  if (type === 't-junction') {
    ctx.fillRect(0, H * 0.32, W, H * 0.36);
    ctx.fillRect(W * 0.35, 0, W * 0.3, H);
    ctx.strokeStyle = 'white';
    ctx.setLineDash([14, 22]);
    line(ctx, 0, H * 0.5, W, H * 0.5);
    line(ctx, W * 0.5, 0, W * 0.5, H);
    ctx.setLineDash([]);
  } else {
    ctx.fillRect(0, H * 0.36, W, H * 0.28);
    ctx.fillStyle = '#374151';
    ctx.fillRect(W * 0.72, H * 0.2, W * 0.18, H * 0.2);
    ctx.strokeStyle = 'white';
    ctx.setLineDash([14, 22]);
    line(ctx, 0, H * 0.5, W, H * 0.5);
    ctx.setLineDash([]);
  }
}

function drawVehicle(ctx, x, y, rotationDeg, color, label, type, isEV, hasUHSS) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rotationDeg * Math.PI) / 180);

  // Body
  ctx.fillStyle = color || '#93c5fd';
  roundRect(ctx, -52, -24, 104, 48, 6, true, false);

  // Windscreen
  ctx.fillStyle = '#bfdbfe';
  roundRect(ctx, -36, -18, 72, 16, 4, true, false);

  ctx.rotate(0);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 16px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(label, 0, -34);
  ctx.font = '10px Inter';
  ctx.fillText(type, 0, 38);

  // Chips for EV/UHSS
  if (isEV) {
    ctx.fillStyle = '#064e3b';
    roundRect(ctx, -50, -46, 36, 14, 7, true, false);
    ctx.fillStyle = '#bbf7d0';
    ctx.font = '10px Inter';
    ctx.fillText('EV', -32, -36);
  }
  if (hasUHSS) {
    ctx.fillStyle = '#1f2937';
    roundRect(ctx, 14, -46, 40, 14, 7, true, false);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '10px Inter';
    ctx.fillText('UHSS', 34, -36);
  }

  ctx.restore();
}

function drawCasualty(ctx, x, y, label) {
  ctx.save();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = '12px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y - 12);
  ctx.restore();
}

function drawImpact(ctx, x, y, rotationDeg, offset) {
  const ox = rotateX(0, -offset, rotationDeg);
  const oy = rotateY(0, -offset, rotationDeg);
  ctx.save();
  ctx.fillStyle = '#f97316';
  ctx.font = '20px Inter';
  ctx.fillText('💥', x + ox, y + oy);
  ctx.restore();
}

function drawSideImpact(ctx, x, y, rotationDeg, side) {
  const s = side === 'nearside' ? -1 : 1;
  const ox = rotateX(48 * s, 0, rotationDeg);
  const oy = rotateY(48 * s, 0, rotationDeg);
  ctx.save();
  ctx.fillStyle = '#f97316';
  ctx.font = '20px Inter';
  ctx.fillText('💥', x + ox, y + oy);
  ctx.restore();
}

function drawHazard(ctx, h) {
  ctx.save();
  if (h.type === 'Fuel Spill') {
    ctx.translate(h.x, h.y);
    ctx.rotate(h.rotation || 0);
    ctx.fillStyle = 'rgba(59,130,246,0.35)';
    ellipse(ctx, 0, 0, h.rx || 50, h.ry || 25, true, false);
    ctx.fillStyle = 'white';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Fuel Spill', 0, 0);
  } else if (h.type === 'Fire') {
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.r || 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('🔥 Fire', h.x, h.y + 4);
  } else if (h.type === 'Battery Fire') {
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.r || 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('🔋🔥', h.x, h.y + 4);
  } else if (h.type === 'Wall') {
    ctx.fillStyle = '#8b5cf6';
    roundRect(ctx, h.x, h.y, h.w || 80, h.h || 12, 4, true, false);
    ctx.fillStyle = 'white';
    ctx.font = '11px Inter';
    ctx.fillText('Wall', h.x + (h.w || 80) / 2, (h.y || 0) - 6);
  } else if (h.type === 'Lamppost') {
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(h.x - 5, h.y - 40, 10, 60);
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(h.x, h.y - 44, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Lamp', h.x, h.y - 60);
  }
  ctx.restore();
}

/* ---------- helpers ---------- */
function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
function ellipse(ctx, x, y, rx, ry, fill, stroke) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
function rotateX(x, y, deg) {
  const r = (deg * Math.PI) / 180; return x * Math.cos(r) - y * Math.sin(r);
}
function rotateY(x, y, deg) {
  const r = (deg * Math.PI) / 180; return x * Math.sin(r) + y * Math.cos(r);
}
function rand(min, max) { return Math.random() * (max - min) + min; }
