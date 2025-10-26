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
  ctx.fillStyle = '#c8e6c9'; // Light green for grass
  ctx.fillRect(0, 0, W, H);

  // Road
  ctx.fillStyle = '#bdbdbd'; // Light grey for road
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
    ctx.fillStyle = '#9e9e9e'; // Darker grey for other road part
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
  ctx.fillStyle = color || '#90caf9';
  roundRect(ctx, -52, -24, 104, 48, 6, true, true);
  ctx.strokeStyle = '#424242';
  ctx.lineWidth = 1;

  // Windscreen
  ctx.fillStyle = '#e3f2fd';
  roundRect(ctx, -36, -18, 72, 16, 4, true, false);

  ctx.restore(); // Restore before drawing text

  ctx.save();
  ctx.translate(x,y);
  ctx.fillStyle = '#212121'; // Dark text for visibility
  ctx.font = 'bold 16px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(label, 0, 5);
  ctx.font = '10px Inter';
  // No need to draw type again as it's outside the vehicle body in the UI

  // Chips for EV/UHSS
    if (isEV) {
        ctx.fillStyle = '#d1e7dd';
        roundRect(ctx, -50, -46, 36, 14, 7, true, false);
        ctx.fillStyle = '#0f5132';
        ctx.font = '10px Inter';
        ctx.fillText('EV', -32, -36);
    }
    if (hasUHSS) {
        ctx.fillStyle = '#e2e3e5';
        roundRect(ctx, 14, -46, 40, 14, 7, true, false);
        ctx.fillStyle = '#41464b';
        ctx.font = '10px Inter';
        ctx.fillText('UHSS', 34, -36);
    }


  ctx.restore();
}

function drawCasualty(ctx, x, y, label) {
  ctx.save();
  ctx.fillStyle = '#d32f2f';
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'white';
  ctx.font = 'bold 10px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(label, x, y + 4);
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
    ctx.fillStyle = '#212121';
    ctx.font = '11px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Fuel Spill', 0, 4);
  } else if (h.type === 'Fire') {
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.r || 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d32f2f';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('🔥 Fire', h.x, h.y + 4);
  } else if (h.type === 'Battery Fire') {
    ctx.fillStyle = '#fb923c';
    ctx.beginPath();
    ctx.arc(h.x, h.y, h.r || 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d32f2f';
    ctx.font = '14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('🔋🔥', h.x, h.y + 4);
  } else if (h.type === 'Wall') {
    ctx.fillStyle = '#7e57c2';
    roundRect(ctx, h.x, h.y, h.w || 80, h.h || 12, 4, true, false);
  } else if (h.type === 'Lamppost') {
    ctx.fillStyle = '#9e9e9e';
    ctx.fillRect(h.x - 5, h.y - 40, 10, 60);
    ctx.fillStyle = '#ffeb3b';
    ctx.beginPath();
    ctx.arc(h.x, h.y - 44, 12, 0, Math.PI * 2);
    ctx.fill();
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
  ctx.closePath();
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
