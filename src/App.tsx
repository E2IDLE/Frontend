import './index.css';
import React, { useState, useEffect } from "react";


/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg-0: #0d0e10;
    --bg-1: #13151a;
    --bg-2: #1a1d24;
    --bg-3: #22262f;
    --bg-4: #2a2f3a;
    --border: rgba(255,255,255,0.07);
    --border-med: rgba(255,255,255,0.12);
    --accent: #2563eb;
    --accent-glow: rgba(37,99,235,0.35);
    --accent-light: #3b82f6;
    --green: #22c55e;
    --green-dim: rgba(34,197,94,0.15);
    --amber: #f59e0b;
    --text-0: #f0f2f5;
    --text-1: #9aa3b4;
    --text-2: #5c6474;
    --mono: 'Noto Sans KR', sans-serif;
    --sans: 'Noto Sans KR', sans-serif;
    --radius: 6px;
    --radius-lg: 10px;
  }

  body { background: var(--bg-0); color: var(--text-0); font-family: var(--sans); }

  /* scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg-4); border-radius: 2px; }

  /* ── LAYOUT ── */
  .app { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

  /* ── NAV ── */
  .nav {
    display: flex; align-items: center; gap: 32px;
    padding: 0 20px; height: 46px;
    background: var(--bg-1);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0; position: relative; z-index: 100;
  }
  .nav-logo { font-family: var(--mono); font-weight: 700; font-size: 13px; letter-spacing: -0.3px; color: var(--text-0); }
  .nav-links { display: flex; gap: 4px; }
  .nav-link {
    font-size: 13px; font-family: var(--sans); color: var(--text-1);
    padding: 5px 12px; border-radius: var(--radius);
    cursor: pointer; transition: all .15s; border: none; background: none;
  }
  .nav-link:hover { color: var(--text-0); background: var(--bg-3); }
  .nav-link.active { color: var(--accent-light); }
  .nav-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .agent-badge {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: var(--radius);
    background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.2);
    font-size: 11px; font-family: var(--mono); color: var(--green);
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green);
    box-shadow: 0 0 6px var(--green); animation: pulse 2s ease-in-out infinite; }
  .dot.red { background: #ef4444; box-shadow: 0 0 6px #ef4444; }
  @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }
  .nav-icon { width: 28px; height: 28px; border-radius: var(--radius); background: var(--bg-3);
    border: 1px solid var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: var(--text-1); font-size: 14px; transition: all .15s; }
  .nav-icon:hover { background: var(--bg-4); color: var(--text-0); }

  /* ── PAGE TRANSITION ── */
  .page { flex: 1; display: flex; overflow: hidden; animation: fadeIn .2s ease; }
  @keyframes fadeIn { from { opacity:0; transform: translateY(4px); } to { opacity:1; transform: none; } }

  /* ════════════════════════════════════════
     MAIN PAGE (PROJECT)
  ════════════════════════════════════════ */
  .main-layout { display: flex; width: 100%; overflow: hidden; }

  /* sidebar */
  .main-sidebar {
    width: 260px; flex-shrink: 0;
    background: var(--bg-1); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; overflow: hidden;
  }
  .sidebar-header { padding: 16px; border-bottom: 1px solid var(--border); }
  .project-name { font-size: 15px; font-weight: 600; color: var(--text-0); }
  .project-path { font-size: 11px; font-family: var(--mono); color: var(--text-2); margin-top: 3px; }
  .media-list { flex: 1; overflow-y: auto; padding: 8px; }
  .media-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 10px; border-radius: var(--radius);
    cursor: pointer; transition: all .15s;
    border: 1px solid transparent;
  }
  .media-item:hover { background: var(--bg-3); }
  .media-item.selected { background: rgba(37,99,235,0.12); border-color: rgba(37,99,235,0.3); }
  .media-icon {
    width: 34px; height: 34px; border-radius: 6px;
    background: var(--bg-3); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .media-item.selected .media-icon { background: rgba(37,99,235,0.2); border-color: rgba(37,99,235,0.4); }
  .media-info { flex: 1; min-width: 0; }
  .media-name { font-size: 12px; font-weight: 500; color: var(--text-0); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .media-size { font-size: 11px; font-family: var(--mono); color: var(--text-2); margin-top: 2px; }
  .sidebar-footer { padding: 12px; border-top: 1px solid var(--border); }
  .btn-import {
    width: 100%; padding: 9px; border-radius: var(--radius);
    background: var(--accent); border: none; color: #fff;
    font-size: 13px; font-family: var(--sans); font-weight: 500;
    cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .btn-import:hover { background: var(--accent-light); box-shadow: 0 0 16px var(--accent-glow); }
  .status-bar {
    padding: 8px 12px; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: var(--text-2); font-family: var(--mono);
  }

  /* center panel */
  .main-center { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg-0); }
  .preview-area { flex: 1; display: flex; flex-direction: column; padding: 20px; overflow: hidden; }
  .video-container {
    flex: 1; position: relative; background: #000;
    border-radius: var(--radius-lg); overflow: hidden;
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    min-height: 0;
  }
  .video-thumb {
    width: 100%; height: 100%; object-fit: cover; display: block;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
  }
  .video-bg {
    width: 100%; height: 100%;
    background: linear-gradient(160deg, #0d1117 0%, #1c2333 30%, #0f2027 60%, #1a1a1a 100%);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .video-bg::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(37,99,235,0.08) 0%, transparent 70%);
  }
  .play-btn-big {
    width: 56px; height: 56px; border-radius: 50%;
    background: rgba(37,99,235,0.85); border: 2px solid rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s; position: relative; z-index: 2;
    backdrop-filter: blur(8px);
  }
  .play-btn-big:hover { transform: scale(1.08); background: var(--accent); box-shadow: 0 0 24px var(--accent-glow); }
  .preview-badge {
    position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
    background: rgba(37,99,235,0.9); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.15);
    padding: 5px 12px; border-radius: 20px;
    font-size: 11px; color: #fff; white-space: nowrap; z-index: 3;
    display: flex; align-items: center; gap: 6px;
  }
  .progress-bar-wrap { padding: 0 0 8px 0; }
  .progress-track {
    height: 3px; background: var(--bg-4); border-radius: 2px;
    margin: 12px 0 6px;
    position: relative; cursor: pointer;
  }
  .progress-fill { height: 100%; background: var(--accent); border-radius: 2px; width: 37%; }
  .progress-labels {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 11px; font-family: var(--mono); color: var(--text-2);
  }
  .progress-filename { color: var(--text-1); font-size: 11px; }

  /* action buttons */
  .action-row { display: flex; gap: 10px; padding: 0 0 16px 0; }
  .btn-action {
    flex: 1; padding: 11px 8px; border-radius: var(--radius);
    border: 1px solid var(--border-med); background: var(--bg-2);
    color: var(--text-1); font-size: 12px; font-family: var(--sans); font-weight: 500;
    cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center; gap: 7px;
  }
  .btn-action:hover { background: var(--bg-3); color: var(--text-0); border-color: var(--border-med); }
  .btn-action.primary {
    background: var(--accent); border-color: var(--accent);
    color: #fff; font-weight: 600;
  }
  .btn-action.primary:hover { background: var(--accent-light); box-shadow: 0 0 20px var(--accent-glow); }

  /* right panel – transfer */
  .transfer-panel {
    width: 240px; flex-shrink: 0;
    background: var(--bg-1); border-left: 1px solid var(--border);
    padding: 20px 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px;
  }
  .panel-title { font-size: 14px; font-weight: 600; color: var(--text-0); margin-bottom: 14px; }
  .stat-group { display: flex; flex-direction: column; gap: 14px; }
  .stat-item { padding-bottom: 14px; border-bottom: 1px solid var(--border); }
  .stat-item:last-child { border-bottom: none; }
  .stat-label { font-size: 11px; color: var(--text-2); font-family: var(--mono); margin-bottom: 4px; text-transform: uppercase; letter-spacing: .5px; }
  .stat-value { font-size: 28px; font-weight: 700; color: var(--text-0); line-height: 1; font-family: var(--mono); }
  .stat-unit { font-size: 14px; font-weight: 400; color: var(--text-1); margin-left: 3px; }
  .node-card {
    padding: 12px; border-radius: var(--radius);
    background: var(--bg-2); border: 1px solid var(--border);
  }
  .node-label { font-size: 11px; color: var(--text-2); font-family: var(--mono); margin-bottom: 8px; text-transform: uppercase; letter-spacing: .5px; }
  .node-info { display: flex; flex-direction: column; gap: 4px; }
  .node-source { font-size: 12px; font-weight: 500; color: var(--text-0); display: flex; align-items: center; gap: 6px; }
  .node-ip { font-size: 11px; font-family: var(--mono); color: var(--text-2); }

  /* ════════════════════════════════════════
     EDITOR PAGE
  ════════════════════════════════════════ */
  .editor-layout { display: flex; width: 100%; overflow: hidden; flex-direction: column; }
  .editor-body { display: flex; flex: 1; overflow: hidden; min-height: 0; }

  /* left toolbar */
  .editor-toolbar {
    width: 60px; flex-shrink: 0;
    background: var(--bg-1); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; align-items: center;
    padding: 10px 0; gap: 4px;
  }
  .tool-btn {
    width: 42px; height: 42px; border-radius: var(--radius);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
    cursor: pointer; transition: all .15s; border: 1px solid transparent;
    background: none;
  }
  .tool-btn:hover { background: var(--bg-3); }
  .tool-btn.active { background: rgba(37,99,235,0.15); border-color: rgba(37,99,235,0.3); }
  .tool-icon { font-size: 17px; }
  .tool-label { font-size: 9px; font-family: var(--mono); color: var(--text-2); }
  .tool-btn.active .tool-label { color: var(--accent-light); }

  /* inspector panel */
  .inspector {
    width: 240px; flex-shrink: 0;
    background: var(--bg-1); border-right: 1px solid var(--border);
    overflow-y: auto; padding: 14px;
    display: flex; flex-direction: column; gap: 18px;
  }
  .inspector-section { display: flex; flex-direction: column; gap: 10px; }
  .inspector-title { font-size: 11px; color: var(--text-2); font-family: var(--mono); text-transform: uppercase; letter-spacing: .5px; }
  .inspector-sub {
    font-size: 12px; color: var(--text-1); display: flex; align-items: center; gap: 6px; margin-bottom: 2px;
  }
  .inspector-sub svg, .inspector-sub span.ico { font-size: 13px; }
  .input-row { display: flex; gap: 8px; }
  .inspector-input {
    flex: 1; padding: 6px 8px; border-radius: var(--radius);
    background: var(--bg-3); border: 1px solid var(--border);
    color: var(--text-1); font-size: 12px; font-family: var(--mono);
    outline: none; transition: border .15s;
  }
  .inspector-input:focus { border-color: var(--accent); color: var(--text-0); }
  .slider-wrap { display: flex; align-items: center; gap: 8px; }
  .inspector-slider {
    flex: 1; -webkit-appearance: none; height: 3px;
    background: var(--bg-4); border-radius: 2px; outline: none; cursor: pointer;
  }
  .inspector-slider::-webkit-slider-thumb {
    -webkit-appearance: none; width: 13px; height: 13px;
    background: var(--accent); border-radius: 50%; cursor: pointer;
    box-shadow: 0 0 6px var(--accent-glow);
  }
  .slider-val {
    width: 44px; padding: 4px 6px; text-align: center;
    background: var(--bg-3); border: 1px solid var(--border);
    border-radius: var(--radius); font-size: 11px; font-family: var(--mono); color: var(--text-1);
  }
  .input-icon {
    display: flex; align-items: center; position: relative;
  }
  .input-icon input { padding-right: 26px; }
  .input-icon .icon-r { position: absolute; right: 7px; font-size: 11px; color: var(--text-2); }
  .btn-ghost {
    width: 100%; padding: 8px; border-radius: var(--radius);
    background: var(--bg-3); border: 1px solid var(--border);
    color: var(--text-1); font-size: 12px; font-family: var(--sans);
    cursor: pointer; transition: all .15s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .btn-ghost:hover { background: var(--bg-4); color: var(--text-0); }
  .divider { height: 1px; background: var(--border); }

  /* editor canvas */
  .canvas-area {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: var(--bg-0); position: relative; overflow: hidden; min-width: 0;
  }
  .canvas-topbar {
    position: absolute; top: 14px; right: 16px;
    display: flex; align-items: center; gap: 8px;
    font-size: 11px; font-family: var(--mono); color: var(--text-2);
    z-index: 10;
  }
  .badge-raw {
    padding: 3px 7px; border-radius: 4px;
    background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3);
    color: var(--amber); font-size: 10px; font-weight: 700;
  }
  .badge-tc {
    padding: 3px 7px; border-radius: 4px;
    background: var(--bg-3); border: 1px solid var(--border);
    color: var(--text-1);
  }
  .video-frame {
    position: relative; border: 1.5px solid rgba(37,99,235,0.5);
    border-radius: 2px; max-width: 82%; max-height: 75%;
    box-shadow: 0 0 0 1px rgba(37,99,235,0.15), 0 8px 40px rgba(0,0,0,0.6);
  }
  .video-frame-inner {
    width: 560px; height: 315px; max-width: 100%;
    background: linear-gradient(160deg, #0a0e1a 0%, #1a2744 35%, #0d1a3a 60%, #060a10 100%);
    display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;
  }
  .desert-gradient {
    position: absolute; inset: 0;
    background: linear-gradient(180deg,
      #2c4a6b 0%, #4a7a9b 15%, #7ab0c8 25%,
      #c8943a 40%, #d4752a 55%, #b85a1a 70%,
      #8a3a0a 85%, #5a2008 100%);
    opacity: 0.7;
  }
  .desert-dune {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 60%;
    background: linear-gradient(180deg, transparent 0%, #c87830 20%, #a05c20 60%, #6a3810 100%);
    clip-path: polygon(0 40%, 30% 20%, 50% 35%, 70% 15%, 85% 30%, 100% 25%, 100% 100%, 0 100%);
  }
  .corner-handle {
    position: absolute; width: 10px; height: 10px;
    background: #fff; border-radius: 50%; border: 2px solid var(--accent);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 6px rgba(0,0,0,0.5);
  }
  .corner-handle.tl { top: 0; left: 0; }
  .corner-handle.tr { top: 0; right: 0; transform: translate(50%, -50%); }
  .corner-handle.bl { bottom: 0; left: 0; transform: translate(-50%, 50%); }
  .corner-handle.br { bottom: 0; right: 0; transform: translate(50%, 50%); }
  .corner-handle.ml { top: 50%; left: 0; }
  .corner-handle.mr { top: 50%; right: 0; transform: translate(50%, -50%); }
  .corner-handle.mt { top: 0; left: 50%; transform: translate(-50%, -50%); }
  .corner-handle.mb { bottom: 0; left: 50%; transform: translate(-50%, 50%); }

  .playback-bar {
    position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 12px;
    background: rgba(13,14,16,0.85); backdrop-filter: blur(12px);
    border: 1px solid var(--border-med); border-radius: 24px;
    padding: 8px 16px;
  }
  .pb-btn { background: none; border: none; color: var(--text-1); font-size: 16px; cursor: pointer; transition: color .15s; padding: 2px; }
  .pb-btn:hover { color: var(--text-0); }
  .pb-btn.play { font-size: 18px; color: var(--text-0); }
  .pb-divider { width: 1px; height: 16px; background: var(--border-med); }
  .pb-label { font-size: 11px; font-family: var(--mono); color: var(--text-1); display: flex; align-items: center; gap: 5px; }
  .pb-label-icon { font-size: 12px; }

  /* timeline */
  .timeline {
    height: 140px; flex-shrink: 0;
    background: var(--bg-1); border-top: 1px solid var(--border);
    display: flex; overflow: hidden;
  }
  .timeline-labels {
    width: 40px; flex-shrink: 0; border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
  }
  .tl-info {
    padding: 6px 8px; border-bottom: 1px solid var(--border);
    font-size: 9px; font-family: var(--mono); color: var(--text-2);
    display: flex; flex-direction: column; gap: 2px;
  }
  .tl-track-label {
    flex: 1; display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-family: var(--mono); color: var(--text-2);
    border-bottom: 1px solid var(--border); padding: 0 4px;
  }
  .tl-track-label:last-child { border-bottom: none; }
  .timeline-body { flex: 1; overflow: hidden; display: flex; flex-direction: column; position: relative; }
  .tl-ruler {
    height: 28px; display: flex; align-items: flex-end; padding: 0 0 4px 0;
    border-bottom: 1px solid var(--border); position: relative;
    background: var(--bg-2);
  }
  .tl-ruler-controls {
    display: flex; align-items: center; gap: 6px;
    padding: 0 10px;
    font-size: 11px; font-family: var(--mono); color: var(--text-1);
  }
  .tl-zoom { font-size: 13px; color: var(--text-2); cursor: pointer; }
  .tl-zoom-track {
    width: 80px; -webkit-appearance: none; height: 2px;
    background: var(--bg-4); border-radius: 1px; outline: none; cursor: pointer;
  }
  .tl-zoom-track::-webkit-slider-thumb {
    -webkit-appearance: none; width: 10px; height: 10px;
    background: var(--text-2); border-radius: 50%;
  }
  .tl-tracks { flex: 1; overflow: hidden; position: relative; }
  .tl-track { height: 50%; border-bottom: 1px solid var(--border); position: relative; }
  .tl-track:last-child { border-bottom: none; }
  .tl-timestamps {
    position: absolute; top: 0; left: 0; right: 0; height: 16px;
    display: flex; align-items: center; padding: 0 8px;
  }
  .tl-ts { font-size: 9px; font-family: var(--mono); color: var(--text-2); position: absolute; }
  .tl-clip {
    position: absolute; top: 18px; height: calc(100% - 24px);
    border-radius: 4px; border: 1px solid rgba(37,99,235,0.4);
    background: linear-gradient(180deg, rgba(37,99,235,0.25) 0%, rgba(37,99,235,0.12) 100%);
    overflow: hidden; cursor: pointer;
  }
  .tl-clip-label { font-size: 10px; font-family: var(--mono); color: var(--text-1); padding: 3px 8px; white-space: nowrap; overflow: hidden; }
  .tl-waveform { position: absolute; bottom: 4px; left: 0; right: 0; height: 20px; opacity: 0.5; }
  .tl-segments { position: absolute; bottom: 0; left: 0; height: 8px; display: flex; gap: 2px; padding: 0 2px; }
  .tl-seg { height: 100%; border-radius: 1px; background: rgba(37,99,235,0.5); }
  .tl-playhead {
    position: absolute; top: 0; bottom: 0; width: 1.5px;
    background: var(--accent-light); z-index: 10; pointer-events: none;
    left: 36%;
  }
  .tl-playhead::before {
    content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
    width: 0; height: 0;
    border-left: 5px solid transparent; border-right: 5px solid transparent;
    border-top: 6px solid var(--accent-light);
  }
  .tl-audio { height: 100%; display: flex; align-items: center; padding: 0 8px; }
  .tl-audio-bar { flex: 1; height: 100%; display: flex; align-items: center; gap: 1px; }
  .tl-audio-tick { flex: 1; background: var(--bg-4); border-radius: 1px; }
`;

/* ─────────────────────────────────────────────
   ICONS (inline SVG strings as components)
───────────────────────────────────────────── */
const Icon = {
  move: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2v12M2 8h12M5 5l-3 3 3 3M11 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  text: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 4h10M8 4v9M5 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  fx: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 13l4-4m0 0l2-5 2 5m-4 0h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  media: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M6 6l4 2.5L6 11V6z" fill="currentColor"/></svg>,
  play: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 3l9 5-9 5V3z"/></svg>,
  prev: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2h1.5v10H3V2zm2 5L11 2v10L5 7z"/></svg>,
  next: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M11 2h-1.5v10H11V2zm-2 5L3 2v10l6-5z"/></svg>,
  export: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2v7M4 7l2.5 2.5L9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 10h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  location: () => <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="5.5" cy="4.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 1C3.567 1 2 2.567 2 4.5c0 2.5 3.5 5.5 3.5 5.5s3.5-3 3.5-5.5C9 2.567 7.433 1 5.5 1z" stroke="currentColor" strokeWidth="1.2"/></svg>,
  film: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 5h12M2 11h12M5 2v3M8 2v3M11 2v3M5 11v3M8 11v3M11 11v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  file: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 2h5l3 3v9H4V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
  bell: () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5a4.5 4.5 0 014.5 4.5c0 2.5.5 3.5 1 4H2c.5-.5 1-1.5 1-4A4.5 4.5 0 017.5 1.5z" stroke="currentColor" strokeWidth="1.3"/><path d="M6.5 13a1 1 0 002 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  user: () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 13.5c0-2.485 2.239-4.5 5-4.5s5 2.015 5 4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  mount: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10L5 5l2.5 3.5L9 6l3 4H2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="10" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>,
  shield: () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L2 3.5v4c0 3 2.5 5 5 5.5 2.5-.5 5-2.5 5-5.5v-4L7 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4.5 7l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  zoomin: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 6h3M6 4.5v3M9.5 9.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  zoomout: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M4.5 6h3M9.5 9.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  refresh: () => <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M10 6A4 4 0 112.1 4M2 2v2h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  bg: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1.5" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 9l2.5-3L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="5" r="1" fill="currentColor"/></svg>,
  chroma: () => <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 6.5h9" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 4a4.5 4.5 0 000 5" stroke="currentColor" strokeWidth="1.2"/></svg>,
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const mediaFiles = [
  { id: 1, name: "Scene_01_RAW.mov", size: "128 GB", icon: "🎬" },
  { id: 2, name: "Interviews_04.r3d", size: "256 GB", icon: "📄" },
  { id: 3, name: "B-Roll_Footage_B.mp4", size: "94 GB", icon: "▶️" },
];

const tlSegs = [8, 14, 12, 10, 14, 9, 12, 11, 14, 13, 10, 12];
const audioTicks = Array.from({ length: 44 }, () => ({
  h: Math.max(20, Math.random() * 100),
}));

/* ─────────────────────────────────────────────
   NAV COMPONENT
───────────────────────────────────────────── */
interface NavProps {
  page: string;
  setPage: (page: string) => void;
}

function Nav({ page, setPage }: NavProps) {
  const tabs = [
    { id: "main", label: "프로젝트" },
    { id: "editor", label: "편집" },
    { id: "team", label: "팀" },
    { id: "settings", label: "설정" },
  ];
  return (
    <nav className="nav">
      <span className="nav-logo">다이렉트 P2P</span>
      <div className="nav-links">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`nav-link ${page === t.id ? "active" : ""}`}
            onClick={() => (t.id === "main" || t.id === "editor") && setPage(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="nav-right">
        {page === "editor" ? (
          <div className="agent-badge">
            <span className="dot red" />
            프로젝트명 편집중
          </div>
        ) : (
          <div className="agent-badge">
            <span className="dot" />
            로컬 에이전트 연결됨
          </div>
        )}
        <div className="nav-icon"><Icon.bell /></div>
        <div className="nav-icon"><Icon.user /></div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
interface MainPageProps {
  goToEditor: () => void;
}

function MainPage({ goToEditor }: MainPageProps) {
  const [selected, setSelected] = useState(1);
  const [speed, setSpeed] = useState(1.2);
  const [latency] = useState(15);
  const [remaining] = useState(18);

  // Simulate speed fluctuation
  useEffect(() => {
    const t = setInterval(() => {
      setSpeed(s => parseFloat((s + (Math.random() - 0.5) * 0.1).toFixed(1)));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className="main-sidebar">
        <div className="sidebar-header">
          <div className="project-name">프로젝트명</div>
          <div className="project-path">/production/commercial_v1</div>
        </div>

        <div className="media-list">
          {mediaFiles.map(f => (
            <div
              key={f.id}
              className={`media-item ${selected === f.id ? "selected" : ""}`}
              onClick={() => setSelected(f.id)}
            >
              <div className="media-icon">
                {f.id === 1 ? <Icon.film /> : f.id === 2 ? <Icon.file /> : <Icon.media />}
              </div>
              <div className="media-info">
                <div className="media-name">{f.name}</div>
                <div className="media-size">{f.size}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="btn-import">
            <span>＋</span> 미디어 가져오기
          </button>
        </div>

        <div className="status-bar">
          <span className="dot" style={{ width: 5, height: 5 }} />
          시스템: 정상 작동 중&nbsp;&nbsp;에이전트 v1.0.1
        </div>
      </aside>

      {/* Center */}
      <main className="main-center">
        <div className="preview-area">
          {/* Video preview */}
          <div className="video-container" style={{ borderRadius: "8px", marginBottom: 0 }}>
            <div className="video-bg">
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(160deg, #0d1117 0%, #1c2333 30%, #0f2027 60%, #1a1a1a 100%)"
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
                background: "linear-gradient(180deg, transparent, #c87830 30%, #a05c20 70%, #6a3810 100%)",
                clipPath: "polygon(0 40%, 30% 20%, 50% 35%, 70% 15%, 85% 30%, 100% 25%, 100% 100%, 0 100%)"
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(200,140,60,0.15) 0%, transparent 60%)"
              }} />
              <button className="play-btn-big">
                <Icon.play />
              </button>
            </div>

            <div className="preview-badge">
              <span style={{ color: "#60a5fa", fontSize: 8 }}>●</span>
              현재 컷 편집 및 프리뷰 가능
            </div>
          </div>

          {/* Progress */}
          <div className="progress-bar-wrap">
            <div className="progress-track">
              <div className="progress-fill" />
            </div>
            <div className="progress-labels">
              <span>00:00:00:00</span>
              <span className="progress-filename">SCENE_01_RAW.MOV</span>
              <span>00:14:22:08</span>
            </div>
          </div>

          {/* Actions */}
          <div className="action-row">
            <button className="btn-action">
              <Icon.mount /> 가상 드라이브로 마운트
            </button>
            <button className="btn-action primary" onClick={goToEditor}>
              <Icon.film /> 영상 편집
            </button>
            <button className="btn-action">
              <Icon.shield /> 무결성 검증
            </button>
          </div>
        </div>
      </main>

      {/* Transfer panel */}
      <aside className="transfer-panel">
        <div>
          <div className="panel-title">전송 상태</div>
          <div className="stat-group">
            <div className="stat-item">
              <div className="stat-label">현재 속도</div>
              <div className="stat-value">
                {speed.toFixed(1)}
                <span className="stat-unit">Gbps</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">지연 시간</div>
              <div className="stat-value">
                {latency}
                <span className="stat-unit">ms</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">남은 시간</div>
              <div className="stat-value">
                {remaining}
                <span className="stat-unit">분</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="node-label">노드 정보</div>
          <div className="node-card">
            <div className="node-info">
              <div className="node-source">
                <Icon.location /> 송신처: 촬영 현장 A
              </div>
              <div className="node-ip">IP: 211.232.xx.xx</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EDITOR PAGE
───────────────────────────────────────────── */
function EditorPage() {
  const [activeTool, setActiveTool] = useState("move");
  const [posX, setPosX] = useState(1920);
  const [posY, setPosY] = useState(1080);
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);

  const tools = [
    { id: "move", icon: <Icon.move />, label: "편집" },
    { id: "text", icon: <Icon.text />, label: "텍스트" },
    { id: "fx", icon: <Icon.fx />, label: "효과" },
    { id: "media", icon: <Icon.media />, label: "미디어" },
  ];

  return (
    <div className="editor-layout">
      <div className="editor-body">
        {/* Toolbar */}
        <div className="editor-toolbar">
          {tools.map(t => (
            <button
              key={t.id}
              className={`tool-btn ${activeTool === t.id ? "active" : ""}`}
              onClick={() => setActiveTool(t.id)}
              title={t.label}
            >
              <span className="tool-icon">{t.icon}</span>
              <span className="tool-label">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Inspector */}
        <div className="inspector">
          <div className="inspector-title">변형 옵션</div>

          {/* Position */}
          <div className="inspector-section">
            <div className="inspector-sub">
              <Icon.move /> 위치 (Position)
            </div>
            <div className="input-row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "var(--text-2)", fontFamily: "var(--mono)", marginBottom: 3 }}>X</div>
                <input
                  className="inspector-input"
                  value={posX}
                  onChange={e => setPosX(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: "var(--text-2)", fontFamily: "var(--mono)", marginBottom: 3 }}>Y</div>
                <input
                  className="inspector-input"
                  value={posY}
                  onChange={e => setPosY(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          <div className="divider" />

          {/* Scale */}
          <div className="inspector-section">
            <div className="inspector-sub">
              <Icon.zoomin /> 크기 (Scale)
            </div>
            <div className="slider-wrap">
              <input
                type="range" min={10} max={200} value={scale}
                onChange={e => setScale(Number(e.target.value))}
                className="inspector-slider"
              />
              <div className="slider-val">{scale}%</div>
            </div>
          </div>

          <div className="divider" />

          {/* Rotation */}
          <div className="inspector-section">
            <div className="inspector-sub">
              <Icon.refresh /> 회전 (Rotation)
            </div>
            <div className="input-icon" style={{ position: "relative" }}>
              <input
                className="inspector-input"
                value={`${rotation}°`}
                onChange={e => setRotation(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", paddingRight: 26 }}
              />
              <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "var(--text-2)" }}>
                <Icon.refresh />
              </span>
            </div>
          </div>

          <div className="divider" />

          {/* Opacity */}
          <div className="inspector-section">
            <div className="inspector-sub">
              <Icon.shield /> 불투명도 (Opacity)
            </div>
            <div className="slider-wrap">
              <input
                type="range" min={0} max={100} value={opacity}
                onChange={e => setOpacity(Number(e.target.value))}
                className="inspector-slider"
              />
              <div className="slider-val">{opacity}%</div>
            </div>
          </div>

          <div className="divider" />

          {/* Background */}
          <div className="inspector-section">
            <div className="inspector-sub" style={{ marginBottom: 6 }}>
              <Icon.bg /> 배경 설정 (Background)
            </div>
            <button className="btn-ghost" style={{ marginBottom: 6 }}>
              <Icon.user /> 배경 제거
            </button>
            <button className="btn-ghost">
              <Icon.chroma /> 크로마키
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="canvas-area">
          <div className="canvas-topbar">
            <span className="badge-raw">8K RAW</span>
            <span className="badge-tc">08:14:22:04</span>
          </div>

          <div className="video-frame">
            <div className="video-frame-inner">
              <div className="desert-gradient" />
              <div className="desert-dune" />
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse 50% 40% at 50% 20%, rgba(255,200,80,0.25) 0%, transparent 60%)"
              }} />
            </div>
            {/* corner handles */}
            {["tl","tr","bl","br","ml","mr","mt","mb"].map(p => (
              <div key={p} className={`corner-handle ${p}`} />
            ))}
          </div>

          {/* Playback */}
          <div className="playback-bar">
            <button className="pb-btn" title="처음으로"><Icon.prev /></button>
            <button className="pb-btn play" onClick={() => setIsPlaying(p => !p)}>
              {isPlaying
                ? <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><rect x="4" y="3" width="3.5" height="12"/><rect x="10.5" y="3" width="3.5" height="12"/></svg>
                : <Icon.play />}
            </button>
            <button className="pb-btn" title="끝으로"><Icon.next /></button>
            <div className="pb-divider" />
            <div className="pb-label">
              <span className="pb-label-icon"><Icon.export /></span>
              선명도 조정
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="timeline">
        <div className="timeline-labels">
          <div className="tl-info">
            <span style={{ fontWeight: 600, color: "var(--text-1)", fontSize: 9 }}>Timeline_V1</span>
            <span style={{ color: "var(--accent-light)" }}>00:00:14:22</span>
            <span>/ 00:05:00:00</span>
          </div>
          <div className="tl-track-label">V1</div>
          <div className="tl-track-label">A1</div>
        </div>

        <div className="timeline-body">
          {/* Ruler */}
          <div className="tl-ruler">
            <div className="tl-ruler-controls">
              <span className="tl-zoom"><Icon.zoomout /></span>
              <input type="range" className="tl-zoom-track" min={1} max={10} defaultValue={5} />
              <span className="tl-zoom"><Icon.zoomin /></span>
            </div>
            {/* timestamps */}
            {["00:00:00","00:00:10","00:00:20","00:00:30"].map((ts, i) => (
              <span key={i} className="tl-ts" style={{ left: 120 + i * 190 }}>
                {ts}
              </span>
            ))}
          </div>

          {/* Tracks */}
          <div className="tl-tracks">
            {/* playhead */}
            <div className="tl-playhead" />

            {/* V1 */}
            <div className="tl-track">
              <div className="tl-clip" style={{ left: 8, right: 30, top: 10, bottom: 4 }}>
                <div className="tl-clip-label">Scene_01_RAW.mov</div>
                <div className="tl-segments">
                  {tlSegs.map((w, i) => (
                    <div key={i} className="tl-seg" style={{ width: w }} />
                  ))}
                </div>
              </div>
            </div>

            {/* A1 */}
            <div className="tl-track">
              <div className="tl-clip" style={{ left: 8, right: 30, top: 10, bottom: 4, borderColor: "rgba(34,197,94,0.3)", background: "linear-gradient(180deg,rgba(34,197,94,0.15),rgba(34,197,94,0.06))" }}>
                <div className="tl-audio-bar" style={{ height: "100%", display: "flex", alignItems: "center", padding: "0 6px", gap: 1.5 }}>
                  {audioTicks.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${t.h}%`,
                        background: "rgba(34,197,94,0.4)",
                        borderRadius: 1,
                        minWidth: 1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ROOT APP
───────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("main");

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <Nav page={page} setPage={setPage} />
        <div className="page" key={page}>
          {page === "main"
            ? <MainPage goToEditor={() => setPage("editor")} />
            : <EditorPage />}
        </div>
      </div>
    </>
  );
}
