"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  col: number;
  row: number;
}

interface Pulse {
  fromNode: Node;
  toNode: Node;
  progress: number;
  speed: number;
  color: string;
  width: number;
  tail: number;
  glow: number;
  hopsLeft: number;
  dir: [number, number] | null;
}

/** Alineado con .bg-workshop-surface (56px) */
const CELL = 56;
const COLORS = ["#FF5500", "#FF7A30", "#E64A00", "#FF8C42"];
const MAX_PULSES = 14;

function randColor() {
  const weights = [50, 28, 14, 8];
  let r = Math.random() * 100;
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i];
    if (r <= 0) return COLORS[i];
  }
  return COLORS[0];
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function EnergyGridBgLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let cols = 0;
    let rows = 0;
    let nodes: Node[][] = [];
    let pulses: Pulse[] = [];
    let animId = 0;
    let dpr = 1;

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

    function nodeAt(col: number, row: number): Node | null {
      if (row < 0 || row >= rows || col < 0 || col >= cols) return null;
      return nodes[row][col];
    }

    function randomNeighbour(n: Node, preferDir?: [number, number] | null): Node {
      const dirs: [number, number][] = [
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ];

      if (preferDir && Math.random() < 0.72) {
        const forward = nodeAt(n.col + preferDir[0], n.row + preferDir[1]);
        if (forward && forward !== n) return forward;
      }

      const shuffled = [...dirs].sort(() => Math.random() - 0.5);
      for (const [dc, dr] of shuffled) {
        const next = nodeAt(n.col + dc, n.row + dr);
        if (next && next !== n) return next;
      }
      return n;
    }

    function segmentDir(from: Node, to: Node): [number, number] {
      return [Math.sign(to.col - from.col), Math.sign(to.row - from.row)];
    }

    function spawnPulse() {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      const from = nodes[r][c];
      const to = randomNeighbour(from);
      if (from === to) return;

      const hopsLeft = 5 + Math.floor(Math.random() * 8);
      pulses.push({
        fromNode: from,
        toNode: to,
        progress: Math.random() * 0.25,
        speed: 0.0035 + Math.random() * 0.006,
        color: randColor(),
        width: 1 + Math.random() * 0.8,
        tail: 0.38 + Math.random() * 0.22,
        glow: 0.6 + Math.random() * 0.3,
        hopsLeft,
        dir: segmentDir(from, to),
      });
    }

    function drawPulses() {
      const c = ctx!;
      for (const p of pulses) {
        const { fromNode: f, toNode: t, progress, tail, color, width, glow } = p;
        const tailStart = Math.max(0, progress - tail);
        const hx = f.x + (t.x - f.x) * progress;
        const hy = f.y + (t.y - f.y) * progress;
        const tx2 = f.x + (t.x - f.x) * tailStart;
        const ty2 = f.y + (t.y - f.y) * tailStart;

        const glowWidths = [width * 10, width * 4, width];
        const glowAlphas = [0.04, 0.12, 0.55];

        for (let i = 0; i < glowWidths.length; i++) {
          const grad = c.createLinearGradient(tx2, ty2, hx, hy);
          grad.addColorStop(0, "transparent");
          grad.addColorStop(0.55, hexToRgba(color, glowAlphas[i] * glow * 0.35));
          grad.addColorStop(1, hexToRgba(color, glowAlphas[i] * glow));

          c.beginPath();
          c.moveTo(tx2, ty2);
          c.lineTo(hx, hy);
          c.strokeStyle = grad;
          c.lineWidth = glowWidths[i];
          c.lineCap = "round";
          c.stroke();
        }

        const headGrad = c.createRadialGradient(hx, hy, 0, hx, hy, width * 5);
        headGrad.addColorStop(0, hexToRgba(color, 0.75 * glow));
        headGrad.addColorStop(0.4, hexToRgba(color, 0.2 * glow));
        headGrad.addColorStop(1, "transparent");
        c.beginPath();
        c.arc(hx, hy, width * 5, 0, Math.PI * 2);
        c.fillStyle = headGrad;
        c.fill();
      }
    }

    function drawNodeActivations() {
      const c = ctx!;
      for (const p of pulses) {
        if (p.progress > 0.82) {
          const alpha = (p.progress - 0.82) / 0.18;
          const n = p.toNode;
          const radius = 3 + alpha * 5;
          const g = c.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 2.5);
          g.addColorStop(0, hexToRgba(p.color, 0.35 * alpha));
          g.addColorStop(0.55, hexToRgba(p.color, 0.08 * alpha));
          g.addColorStop(1, "transparent");
          c.beginPath();
          c.arc(n.x, n.y, radius * 2.5, 0, Math.PI * 2);
          c.fillStyle = g;
          c.fill();
        }
      }
    }

    function chainFrom(p: Pulse): Pulse | null {
      if (p.hopsLeft <= 0) return null;

      const next = randomNeighbour(p.toNode, p.dir);
      if (next === p.toNode) return null;

      const newDir = segmentDir(p.toNode, next);
      return {
        ...p,
        fromNode: p.toNode,
        toNode: next,
        progress: 0,
        speed: 0.0035 + Math.random() * 0.006,
        tail: Math.min(0.82, p.tail + 0.06),
        hopsLeft: p.hopsLeft - 1,
        dir: newDir,
      };
    }

    function tick() {
      const w = canvas!.width / dpr;
      const h = canvas!.height / dpr;

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      drawNodeActivations();
      drawPulses();

      const alive: Pulse[] = [];
      for (const p of pulses) {
        p.progress += p.speed;
        if (p.progress < 1) {
          alive.push(p);
        } else if (Math.random() < 0.9) {
          const chained = chainFrom(p);
          if (chained) alive.push(chained);
        }
      }
      pulses = alive;

      const target = Math.min(MAX_PULSES, Math.max(5, Math.round((w * h) / 80000)));
      const deficit = target - pulses.length;
      if (deficit > 0) {
        for (let i = 0; i < Math.min(deficit, 2); i++) spawnPulse();
      }

      animId = requestAnimationFrame(tick);
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid(w, h);
      pulses = [];
      const seed = Math.min(MAX_PULSES, Math.max(4, Math.round((w * h) / 80000)));
      for (let i = 0; i < seed; i++) spawnPulse();
    }

    resize();
    animId = requestAnimationFrame(tick);

    window.addEventListener("resize", resize);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{ display: "block" }}
    />
  );
}
