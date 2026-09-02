"use client";

import { useEffect, useRef } from "react";

/* ─── TYPES ─────────────────────────────────────────────── */
interface Node {
  x: number;
  y: number;
  col: number;
  row: number;
}

interface Pulse {
  fromNode: Node;
  toNode: Node;
  progress: number;   // 0 → 1
  speed: number;
  color: string;
  width: number;
  tail: number;       // tail length 0→1
  glow: number;       // glow alpha multiplier
}

/* ─── CONSTANTS ─────────────────────────────────────────── */
const CELL   = 52;          // px between nodes
const COLORS = [
  "#FF5500",  // brand orange
  "#FF7A30",  // light orange
  "#FF3800",  // deep orange
  "#FFB300",  // amber / yellow-orange
  "#38D39F",  // teal (accent)
  "#00BFFF",  // electric blue (rare)
];
const MAX_PULSES = 28;

function randColor() {
  // Orange-heavy distribution
  const weights = [40, 25, 20, 10, 4, 1];
  const total   = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return COLORS[i];
  }
  return COLORS[0];
}

/* ─── COMPONENT ──────────────────────────────────────────── */
export function EnergyGridBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Build grid ──────────────────────────────────────────
    let cols = 0, rows = 0;
    let nodes: Node[][] = [];
    let pulses: Pulse[] = [];
    let animId = 0;

    function buildGrid(w: number, h: number) {
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      nodes = [];
      for (let r = 0; r < rows; r++) {
        nodes[r] = [];
        for (let c = 0; c < cols; c++) {
          nodes[r][c] = { x: c * CELL, y: r * CELL, col: c, row: r };
        }
      }
    }

    function randomNeighbour(n: Node): Node {
      const dirs = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
      ];
      const shuffled = dirs.sort(() => Math.random() - 0.5);
      for (const [dc, dr] of shuffled) {
        const nc = n.col + dc, nr = n.row + dr;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          return nodes[nr][nc];
        }
      }
      return n;
    }

    function spawnPulse() {
      // Random edge or interior node
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      const from = nodes[r][c];
      const to   = randomNeighbour(from);
      if (from === to) return;
      pulses.push({
        fromNode: from,
        toNode: to,
        progress: 0,
        speed:  0.008 + Math.random() * 0.018,
        color:  randColor(),
        width:  1.2 + Math.random() * 1.8,
        tail:   0.3 + Math.random() * 0.5,
        glow:   0.5 + Math.random() * 0.5,
      });
    }

    // ── Draw ────────────────────────────────────────────────
    function drawGrid(w: number, h: number) {
      const c = ctx!;
      // Background
      c.fillStyle = "#0E1117";
      c.fillRect(0, 0, w, h);

      // Grid lines (very faint)
      c.strokeStyle = "rgba(255,255,255,0.03)";
      c.lineWidth   = 0.5;
      for (let col = 0; col < cols; col++) {
        c.beginPath();
        c.moveTo(col * CELL, 0);
        c.lineTo(col * CELL, h);
        c.stroke();
      }
      for (let r = 0; r < rows; r++) {
        c.beginPath();
        c.moveTo(0, r * CELL);
        c.lineTo(w, r * CELL);
        c.stroke();
      }

      // Node dots (very faint)
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const n = nodes[r][col];
          c.beginPath();
          c.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
          c.fillStyle = "rgba(255,255,255,0.06)";
          c.fill();
        }
      }
    }

    function drawPulses() {
      const c = ctx!;
      for (const p of pulses) {
        const { fromNode: f, toNode: t, progress, tail, color, width, glow } = p;

        const tailStart = Math.max(0, progress - tail);
        const headProg  = progress;

        const hx = f.x + (t.x - f.x) * headProg;
        const hy = f.y + (t.y - f.y) * headProg;
        const tx2 = f.x + (t.x - f.x) * tailStart;
        const ty2 = f.y + (t.y - f.y) * tailStart;

        // Glow layers (outer → inner)
        const glowWidths  = [width * 12, width * 6, width * 2.5, width];
        const glowAlphas  = [0.04, 0.10, 0.25, 0.9];

        for (let i = 0; i < glowWidths.length; i++) {
          const grad = c.createLinearGradient(tx2, ty2, hx, hy);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.5, hexToRgba(color, glowAlphas[i] * glow));
          grad.addColorStop(1,   hexToRgba(color, glowAlphas[i] * glow * 1.4));

          c.beginPath();
          c.moveTo(tx2, ty2);
          c.lineTo(hx, hy);
          c.strokeStyle = grad;
          c.lineWidth   = glowWidths[i];
          c.lineCap     = "round";
          c.stroke();
        }

        // Bright head dot
        const headGrad = c.createRadialGradient(hx, hy, 0, hx, hy, width * 5);
        headGrad.addColorStop(0,   hexToRgba(color, 1.0));
        headGrad.addColorStop(0.4, hexToRgba(color, 0.5));
        headGrad.addColorStop(1,   "transparent");
        c.beginPath();
        c.arc(hx, hy, width * 5, 0, Math.PI * 2);
        c.fillStyle = headGrad;
        c.fill();
      }
    }

    function drawNodeActivations() {
      const c = ctx!;
      for (const p of pulses) {
        if (p.progress > 0.85) {
          const alpha = (p.progress - 0.85) / 0.15;
          const n = p.toNode;
          const r = 5 + alpha * 8;
          const g = c.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3);
          g.addColorStop(0,   hexToRgba(p.color, 0.8 * alpha));
          g.addColorStop(0.5, hexToRgba(p.color, 0.25 * alpha));
          g.addColorStop(1,   "transparent");
          c.beginPath();
          c.arc(n.x, n.y, r * 3, 0, Math.PI * 2);
          c.fillStyle = g;
          c.fill();

          // Tiny dot at node
          c.beginPath();
          c.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2);
          c.fillStyle = hexToRgba(p.color, alpha);
          c.fill();
        }
      }
    }

    // ── Tick ────────────────────────────────────────────────
    function tick() {
      const c = canvas!;
      const w = c.width;
      const h = c.height;

      drawGrid(w, h);
      drawNodeActivations();
      drawPulses();

      // Advance pulses
      const alive: Pulse[] = [];
      for (const p of pulses) {
        p.progress += p.speed;
        if (p.progress < 1.0) {
          alive.push(p);
        } else {
          // On arrival → maybe chain to next node
          if (Math.random() < 0.70) {
            const next = randomNeighbour(p.toNode);
            if (next !== p.toNode) {
              alive.push({
                ...p,
                fromNode: p.toNode,
                toNode:   next,
                progress: 0,
                speed:    0.007 + Math.random() * 0.018,
              });
            }
          }
        }
      }
      pulses = alive;

      // Maintain pulse count
      const target = Math.round(Math.min(MAX_PULSES, (w * h) / 60000));
      if (pulses.length < target) {
        const toAdd = target - pulses.length;
        for (let i = 0; i < Math.min(toAdd, 3); i++) spawnPulse();
      }

      animId = requestAnimationFrame(tick);
    }

    // ── Resize ──────────────────────────────────────────────
    function resize() {
      const c = canvas!;
      c.width  = window.innerWidth;
      c.height = document.documentElement.scrollHeight;
      buildGrid(c.width, c.height);
      pulses = []; // reset on resize
    }

    // ── Init ────────────────────────────────────────────────
    resize();
    // Seed initial pulses
    const initTarget = Math.round(Math.min(MAX_PULSES, (canvas!.width * canvas!.height) / 60000));
    for (let i = 0; i < initTarget; i++) spawnPulse();
    animId = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: "block" }}
    />
  );
}

/* ─── UTIL ───────────────────────────────────────────────── */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
