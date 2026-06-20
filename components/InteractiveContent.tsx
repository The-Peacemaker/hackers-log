'use client';

import { useEffect, useRef } from 'react';

function initSimulator(root: HTMLElement) {
  const simPhone = root.querySelector('#sim-phone') as HTMLInputElement | null;
  const simBook = root.querySelector('#sim-book') as HTMLInputElement | null;
  const simGaze = root.querySelector('#sim-gaze') as HTMLInputElement | null;
  const simHead = root.querySelector('#sim-head') as HTMLInputElement | null;
  const simDown = root.querySelector('#sim-down') as HTMLInputElement | null;
  const simTemp = root.querySelector('#sim-temp') as HTMLInputElement | null;
  const resetBtn = root.querySelector('#sim-reset') as HTMLElement | null;
  const gauge = root.querySelector('#gauge-active') as HTMLElement | null;
  const scoreDisplay = root.querySelector('#sim-score-display') as HTMLElement | null;
  const tier = root.querySelector('#sim-tier') as HTMLElement | null;
  const composition = root.querySelector('#sim-composition') as HTMLElement | null;
  const heatmap = root.querySelector('#temporal-heatmap') as HTMLElement | null;
  const activeFramesEl = root.querySelector('#sim-active-frames') as HTMLElement | null;

  if (!gauge || !scoreDisplay || !tier || !composition || !heatmap || !activeFramesEl) return;

  let html = '';
  for (let i = 0; i < 90; i++) html += '<div class="frame-cell" style="aspect-ratio:3/1;border-radius:2px;transition:all 0.3s ease;background:var(--border);opacity:0.15"></div>';
  heatmap.innerHTML = html;

  const compute = () => {
    const phone = simPhone?.checked || false;
    const book = simBook?.checked || false;
    const gaze = simGaze?.checked || false;
    const head = simHead?.checked || false;
    const down = simDown?.checked || false;
    const temp = simTemp?.checked || false;

    const O = phone ? 1.0 : (book ? 0.45 : 0.0);
    const E = gaze ? 0.35 : 0;
    const H = head ? 0.30 : 0;
    const D = down ? 0.25 : 0;
    const C = temp ? 0.20 : 0;

    let score = 100 * (0.40 * O + 0.22 * E + 0.16 * H + 0.14 * D + 0.08 * C);
    if (phone) score = Math.max(score, 85);
    score = Math.min(score, 100);

    scoreDisplay.textContent = Math.round(score).toString();

    const circumference = 314;
    gauge.setAttribute('stroke-dasharray', `${(score / 100) * circumference} ${circumference}`);

    let color = '#22c55e';
    let tierText = 'Normal — No Anomalies Detected';
    if (score >= 90) { color = '#ef4444'; tierText = 'Critical Escalation — Immediate Intervention Required'; }
    else if (score >= 80) { color = '#f97316'; tierText = 'High Alert — Escalating to Admin'; }
    else if (score >= 60) { color = '#eab308'; tierText = 'Alert — Suspicious Activity Detected'; }
    gauge.setAttribute('stroke', color);

    tier.style.background = `${color}20`;
    tier.style.color = color;
    tier.textContent = tierText;

    composition.textContent = `0.40·${O.toFixed(2)} + 0.22·${E.toFixed(2)} + 0.16·${H.toFixed(2)} + 0.14·${D.toFixed(2)} + 0.08·${C.toFixed(2)} = ${score.toFixed(1)}`;

    const cells = heatmap?.querySelectorAll('.frame-cell') || [];
    const active = [phone, book, gaze, head, down, temp].filter(Boolean).length * 15;
    activeFramesEl.textContent = Math.min(active, 90).toString();
    cells.forEach((cell, i) => {
      const el = cell as HTMLElement;
      if (i < Math.min(active, 90)) {
        const intensity = Math.min(1, (score / 100) * (1 - i / 90));
        if (intensity > 0.6) el.style.background = '#ef4444';
        else if (intensity > 0.3) el.style.background = '#f59e0b';
        else el.style.background = '#22c55e';
        el.style.opacity = (0.4 + 0.6 * (1 - i / 90)).toString();
      } else {
        el.style.background = 'var(--border)';
        el.style.opacity = '0.15';
      }
    });
  };

  const triggers = [simPhone, simBook, simGaze, simHead, simDown, simTemp].filter(Boolean) as HTMLInputElement[];
  triggers.forEach(cb => cb.addEventListener('change', compute));
  resetBtn?.addEventListener('click', () => {
    triggers.forEach(cb => { cb.checked = false; });
    compute();
  });

  compute();
}

function initBenchmark(root: HTMLElement) {
  const tabs = root.querySelectorAll('.bench-tab');
  const container = document.getElementById('bench-container');
  const fpsEl = document.getElementById('bench-fps');
  if (!tabs.length || !container || !fpsEl) return;

  const colors = ['#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#06b6d4'];
  // Full pipeline per-stage data (not individual configs)
  const pipelineStagesCpu = [
    { name: 'Frame Ingestion', ms: 2.1 },
    { name: 'MediaPipe FaceMesh', ms: 24.5 },
    { name: 'YOLOv8n (every N=15)', ms: 5.5 },
    { name: 'ByteTrack + HUD', ms: 12.3 },
    { name: 'Async Logger', ms: 0.1 },
  ];
  const pipelineStagesGpu = [
    { name: 'Frame Ingestion', ms: 1.8 },
    { name: 'MediaPipe FaceMesh', ms: 8.2 },
    { name: 'YOLOv8n (every N=15)', ms: 1.4 },
    { name: 'ByteTrack + HUD', ms: 4.1 },
    { name: 'Async Logger', ms: 0.1 },
  ];

  const updateBars = (mode: string) => {
    const data = mode === 'gpu' ? pipelineStagesGpu : pipelineStagesCpu;
    const total = data.reduce((s, d) => s + d.ms, 0);

    const rows = container.querySelectorAll('.bench-row');
    rows.forEach((r, i) => {
      const el = r as HTMLElement;
      const val = parseFloat(el.dataset[mode] || '0');
      const pct = Math.max(1, (val / Math.max(...data.map(d => d.ms))) * 100);
      const bar = el.querySelector('.bench-bar') as HTMLElement | null;
      const valEl = el.querySelector('.bench-val') as HTMLElement | null;
      if (bar) { bar.style.width = pct + '%'; bar.style.background = colors[i % colors.length]; }
      if (valEl) valEl.textContent = val.toFixed(1) + ' ms';
    });

    fpsEl.textContent = `~${(1000 / total).toFixed(1)} FPS (${mode.toUpperCase()}) · ${total.toFixed(1)} ms total latency`;
  };

  const handleClick = (e: Event) => {
    const btn = e.currentTarget as HTMLElement;
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    updateBars(btn.dataset.mode || 'cpu');
  };

  tabs.forEach(tab => tab.addEventListener('click', handleClick));
  (tabs[0] as HTMLElement)?.classList.add('active');
  updateBars('cpu');
}

function initCopyButtons(root: HTMLElement) {
  const handleCopy = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest('.copy-code-btn');
    if (!btn) return;
    const code = decodeURIComponent(btn.getAttribute('data-code') || '');
    navigator.clipboard.writeText(code).then(() => {
      const oldHTML = btn.innerHTML;
      btn.innerHTML = '<span class="nf nf-fa-check mr-1 text-emerald-600"></span>Copied';
      btn.classList.add('text-foreground');
      setTimeout(() => {
        btn.innerHTML = oldHTML;
        btn.classList.remove('text-foreground');
      }, 2000);
    });
  };

  root.addEventListener('click', handleCopy);
  return () => root.removeEventListener('click', handleCopy);
}

export default function InteractiveContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanupCopy = initCopyButtons(el);

    // Use rAF to ensure DOM is fully committed
    const id = requestAnimationFrame(() => {
      initSimulator(el);
      initBenchmark(el);
    });

    return () => {
      cleanupCopy();
      cancelAnimationFrame(id);
    };
  }, [html]);

  return (
    <article
      ref={ref}
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
