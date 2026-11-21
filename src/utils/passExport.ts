import { EVENT_CONFIG, type EventConfigType } from '../data/eventData';
import { generateQrMatrix, type IssuedPass } from './partyLogic';

/**
 * Renders an official Synora digital entry pass onto an offscreen canvas
 * and triggers a PNG file download.
 */
export function downloadPassAsPng(
  pass: IssuedPass,
  config: EventConfigType = EVENT_CONFIG
): boolean {
  if (typeof document === 'undefined') return false;

  const width = 960;
  const height = 520;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  // Obsidian background
  ctx.fillStyle = '#09090B';
  ctx.fillRect(0, 0, width, height);

  // Subtle card frame
  ctx.fillStyle = '#121216';
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(28, 28, width - 56, height - 56, 18);
  ctx.fill();
  ctx.stroke();

  // Top amber hairline
  ctx.fillStyle = '#F5A623';
  ctx.fillRect(28, 28, width - 56, 5);

  // Vertical perforation divider
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(640, 56);
  ctx.lineTo(640, height - 56);
  ctx.stroke();
  ctx.restore();

  // Left side content
  ctx.fillStyle = '#F5A623';
  ctx.font = '600 16px sans-serif';
  ctx.fillText(
    `${config.collegeName} · ${config.department}`,
    64,
    88
  );

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 44px sans-serif';
  ctx.fillText(`${config.brandName} Entry Pass`, 64, 146);

  ctx.fillStyle = '#A1A1AA';
  ctx.font = '400 18px sans-serif';
  ctx.fillText(
    `${config.batchLabel} · ${config.venueShort}`,
    64,
    182
  );

  // Divider line
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath();
  ctx.moveTo(64, 212);
  ctx.lineTo(604, 212);
  ctx.stroke();

  // Attendee details
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '500 14px sans-serif';
  ctx.fillText('ATTENDEE', 64, 248);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 30px sans-serif';
  ctx.fillText(pass.fullName, 64, 286);

  ctx.fillStyle = '#D4D4D8';
  ctx.font = '500 17px monospace';
  ctx.fillText(`${pass.rollNumber}  ·  ${pass.section}`, 64, 320);

  // Lower metadata row
  const drawField = (label: string, value: string, x: number, y: number) => {
    ctx.fillStyle = '#A1A1AA';
    ctx.font = '500 13px sans-serif';
    ctx.fillText(label, x, y);
    ctx.fillStyle = '#F4F4F5';
    ctx.font = '600 18px sans-serif';
    ctx.fillText(value, x, y + 26);
  };

  drawField('ENTRY GATE', pass.gate, 64, 378);
  drawField('DINING LANE', pass.diningCode, 340, 378);
  drawField('TRACK', pass.track, 455, 378);

  // Right stub: QR code & pass ID
  const qrSize = 17;
  const cell = 10;
  const qrPixelSize = qrSize * cell;
  const qrX = 640 + Math.floor((width - 28 - 640 - qrPixelSize) / 2);
  const qrY = 120;

  // White quiet zone behind QR
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.roundRect(qrX - 16, qrY - 16, qrPixelSize + 32, qrPixelSize + 32, 10);
  ctx.fill();

  const matrix = generateQrMatrix(pass.passCode, qrSize);
  ctx.fillStyle = '#09090B';
  for (let r = 0; r < qrSize; r += 1) {
    for (let c = 0; c < qrSize; c += 1) {
      if (matrix[r][c]) {
        ctx.fillRect(qrX + c * cell, qrY + r * cell, cell, cell);
      }
    }
  }

  ctx.fillStyle = '#A1A1AA';
  ctx.font = '500 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PASS CODE', 786, 355);

  ctx.fillStyle = '#F5A623';
  ctx.font = '600 24px monospace';
  ctx.fillText(pass.passCode, 786, 388);

  ctx.fillStyle = '#A1A1AA';
  ctx.font = '400 13px sans-serif';
  ctx.fillText('Present with College ID', 786, 434);

  const link = document.createElement('a');
  link.download = `synora26-pass-${pass.rollNumber.toLowerCase()}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return true;
}
