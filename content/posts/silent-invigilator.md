---
title: "The Silent Invigilator: Real-Time Multi-Modal Exam Surveillance via Deep Geometric Inference and Spatiotemporal Anomaly Accumulation"
date: "2026-06-15"
category: ["Open Source", "AI", "Computer Science"]
tags: ["Computer Vision", "Deep Learning", "YOLOv8", "Anomaly Detection", "MediaPipe", "Spatiotemporal Systems"]
readingTime: "18 min read"
summary: "A production-grade autonomous invigilation system fusing 3D geometric deep learning — MediaPipe Face Mesh, Perspective-n-Point head pose, iris-vector gaze tracking, and YOLOv8-based prohibited object detection — into a unified spatiotemporal risk accumulation engine operating across web, desktop, and mobile surfaces."
---

## Abstract

Academic integrity in high-stakes examinations remains threatened by the inherent limitations of human invigilation — attentional drift, cognitive saturation, and inter-observer variability. We present **The Silent Invigilator**, a real-time autonomous surveillance architecture that fuses multi-modal geometric deep learning with a sliding-window spatiotemporal anomaly accumulation engine. The system jointly estimates 3D head pose via Perspective-n-Point (PnP) reprojection minimization, tracks bilateral iris-center deviation vectors for gaze classification, computes mouth aspect ratios for vocalization detection, and performs YOLOv8-based prohibited-object recognition — all within a unified multi-threaded pipeline operating at real-time throughput. A composite risk function `Sₜ ∈ [0, 100]` aggregates these modalities through a weighted temporal accumulator, filtering transient physiological noise while capturing persistent high-confidence malpractice signatures. The system deploys across three surfaces: a standalone OpenCV desktop runtime, a Flask-SocketIO web dashboard with JWT-authenticated role-based access, and a cross-platform Flutter mobile application.

---

## 1. Problem Domain & Motivation

Manual examination invigilation suffers from three fundamental pathologies:

1. **Attentional decay**: Vigilance decrement begins within 15–20 minutes of continuous monitoring, with detection accuracy dropping by up to 35% over a standard 3-hour session [1, 2].
2. **Cognitive overload**: A single invigilator monitoring 25–40 candidates must simultaneously track gaze patterns, head movements, hand positions, and object interactions across a distributed spatial field — a task that exceeds the tracking capacity of human visual working memory.
3. **Subconscious bias**: Involuntary differential scrutiny based on candidate demographics, seating position, or prior performance introduces systematic measurement error.

These constraints motivate an automated, computer-vision-driven approach that operates at constant vigilance, applies uniform detection thresholds across all candidates, and provides quantitative, auditable evidence trails for every flagged incident.

> **Reference Implementation** — The complete source code for The Silent Invigilator is available at [github.com/The-Peacemaker/Silent-Invigilator](https://github.com/The-Peacemaker/Silent-Invigilator). The repository includes the Flask web server, standalone desktop client, Flutter mobile application, model weights, and benchmarking suite.

---

## 2. System Architecture

The Silent Invigilator is structured as a decoupled, multi-surface ecosystem comprising four principal subsystems connected through a shared REST/WebSocket protocol layer.

<div class="w-full my-8 border border-[var(--border)] rounded-xl bg-[var(--card)]">
  <div class="px-6 py-3 border-b border-[var(--border)] bg-[var(--surface)] flex items-center gap-2">
    <span class="nf nf-md-lan text-sm opacity-70"></span>
    <span class="text-[10px] font-mono uppercase tracking-widest text-[var(--secondary)]">System Topology — Multi-Surface Architecture</span>
  </div>
  <!-- SVG Architecture Diagram -->
  <svg viewBox="0 0 900 320" class="w-full h-auto block" xmlns="http://www.w3.org/2000/svg" style="padding: 16px; box-sizing: border-box;">
    <defs>
      <linearGradient id="g-capture" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15"/><stop offset="100%" stop-color="#2563eb" stop-opacity="0.08"/></linearGradient>
      <linearGradient id="g-inference" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22c55e" stop-opacity="0.15"/><stop offset="100%" stop-color="#16a34a" stop-opacity="0.08"/></linearGradient>
      <linearGradient id="g-storage" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.15"/><stop offset="100%" stop-color="#7c3aed" stop-opacity="0.08"/></linearGradient>
      <linearGradient id="g-client" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.15"/><stop offset="100%" stop-color="#d97706" stop-opacity="0.08"/></linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <!-- Layer 1: Capture -->
    <rect x="20" y="20" width="200" height="120" rx="10" fill="url(#g-capture)" stroke="#3b82f6" stroke-width="1.5" stroke-opacity="0.4"/>
    <text x="120" y="46" text-anchor="middle" fill="#60a5fa" font-family="monospace" font-size="9" font-weight="bold">CAPTURE LAYER</text>
    <rect x="35" y="58" width="170" height="24" rx="4" fill="none" stroke="#3b82f6" stroke-opacity="0.3" stroke-width="1"/>
    <text x="120" y="74" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="9">USB Webcam / IP Camera</text>
    <rect x="35" y="88" width="170" height="24" rx="4" fill="none" stroke="#3b82f6" stroke-opacity="0.3" stroke-width="1"/>
    <text x="120" y="104" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="9">RTSP Stream (H.264)</text>
    <!-- Arrow 1→2 -->
    <line x1="220" y1="80" x2="260" y2="80" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,3"/>
    <polygon points="258,75 268,80 258,85" fill="#475569"/>
    <text x="240" y="72" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="7">MJPEG</text>
    <!-- Layer 2: Inference -->
    <rect x="270" y="20" width="360" height="120" rx="10" fill="url(#g-inference)" stroke="#22c55e" stroke-width="1.5" stroke-opacity="0.4"/>
    <text x="450" y="46" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="9" font-weight="bold">INFERENCE ENGINE</text>
    <rect x="285" y="55" width="160" height="24" rx="4" fill="none" stroke="#22c55e" stroke-opacity="0.3" stroke-width="1"/>
    <text x="365" y="71" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="8">MediaPipe Face Mesh (468 lm)</text>
    <rect x="285" y="83" width="160" height="24" rx="4" fill="none" stroke="#22c55e" stroke-opacity="0.3" stroke-width="1"/>
    <text x="365" y="99" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="8">solvePnP / RQDecomp3x3</text>
    <rect x="455" y="55" width="160" height="24" rx="4" fill="none" stroke="#22c55e" stroke-opacity="0.3" stroke-width="1"/>
    <text x="535" y="71" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="8">YOLOv8n (COCO cls 67, 73)</text>
    <rect x="455" y="83" width="160" height="24" rx="4" fill="none" stroke="#22c55e" stroke-opacity="0.3" stroke-width="1"/>
    <text x="535" y="99" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="8">ByteTrack (IoU + Kalman)</text>
    <text x="365" y="120" text-anchor="middle" fill="#22c55e" font-family="monospace" font-size="7" opacity="0.6">Thread 1: Geometric Features</text>
    <text x="535" y="120" text-anchor="middle" fill="#22c55e" font-family="monospace" font-size="7" opacity="0.6">Thread 2: Object Detection (N=15)</text>
    <!-- Arrow 2→3 -->
    <line x1="630" y1="80" x2="670" y2="80" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,3"/>
    <polygon points="668,75 678,80 668,85" fill="#475569"/>
    <text x="654" y="72" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="7">JSON</text>
    <!-- Layer 3: Storage & Risk -->
    <rect x="680" y="20" width="200" height="120" rx="10" fill="url(#g-storage)" stroke="#8b5cf6" stroke-width="1.5" stroke-opacity="0.4"/>
    <text x="780" y="46" text-anchor="middle" fill="#a78bfa" font-family="monospace" font-size="9" font-weight="bold">RISK &amp; STORAGE</text>
    <rect x="695" y="58" width="170" height="24" rx="4" fill="none" stroke="#8b5cf6" stroke-opacity="0.3" stroke-width="1"/>
    <text x="780" y="74" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="9">Spatiotemporal Accumulator</text>
    <rect x="695" y="88" width="170" height="24" rx="4" fill="none" stroke="#8b5cf6" stroke-opacity="0.3" stroke-width="1"/>
    <text x="780" y="104" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="9">SQLite (WAL mode)</text>
    <!-- Arrow 3→4 (down) -->
    <line x1="450" y1="140" x2="450" y2="172" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,3"/>
    <polygon points="445,170 450,180 455,170" fill="#475569"/>
    <text x="462" y="162" text-anchor="start" fill="#64748b" font-family="monospace" font-size="7">Socket.IO</text>
    <!-- Layer 4: Client Surfaces -->
    <rect x="130" y="180" width="640" height="80" rx="10" fill="url(#g-client)" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.4"/>
    <text x="450" y="204" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="9" font-weight="bold">CLIENT SURFACES</text>
    <rect x="150" y="214" width="185" height="30" rx="4" fill="none" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="1"/>
    <text x="242" y="233" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="8">OpenCV Standalone (Desktop)</text>
    <rect x="355" y="214" width="185" height="30" rx="4" fill="none" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="1"/>
    <text x="447" y="233" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="8">Flask Web Dashboard (Admin/Teacher/Staff)</text>
    <rect x="560" y="214" width="185" height="30" rx="4" fill="none" stroke="#f59e0b" stroke-opacity="0.3" stroke-width="1"/>
    <text x="652" y="233" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="8">Flutter Mobile App (Admin/Teacher)</text>
    <!-- Connector dots -->
    <circle cx="120" cy="80" r="3" fill="#3b82f6" opacity="0.6"/>
    <circle cx="450" cy="80" r="3" fill="#22c55e" opacity="0.6"/>
    <circle cx="780" cy="80" r="3" fill="#8b5cf6" opacity="0.6"/>
    <!-- Protocol labels -->
    <rect x="20" y="270" width="200" height="20" rx="4" fill="none" stroke="#475569" stroke-width="1" stroke-opacity="0.3"/>
    <text x="120" y="284" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="7">MJPEG / RTSP</text>
    <rect x="250" y="270" width="180" height="20" rx="4" fill="none" stroke="#475569" stroke-width="1" stroke-opacity="0.3"/>
    <text x="340" y="284" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="7">JSON Telemetry</text>
    <rect x="460" y="270" width="180" height="20" rx="4" fill="none" stroke="#475569" stroke-width="1" stroke-opacity="0.3"/>
    <text x="550" y="284" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="7">SQLite WAL</text>
    <rect x="670" y="270" width="200" height="20" rx="4" fill="none" stroke="#475569" stroke-width="1" stroke-opacity="0.3"/>
    <text x="770" y="284" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="7">JWT + Socket.IO</text>
  </svg>
</div>

### 2.1 Multi-Threaded Pipeline Design

The pipeline operates on a producer-consumer architecture with three dedicated thread domains to decouple capture latency from inference throughput:

<div class="w-full my-6 border border-[var(--border)] rounded-lg overflow-hidden">
  <table class="w-full text-xs font-mono border-collapse">
    <thead>
      <tr class="bg-[var(--surface)] border-b border-[var(--border)]">
        <th class="text-left p-3 text-[var(--secondary)] font-semibold">Thread Domain</th>
        <th class="text-left p-3 text-[var(--secondary)] font-semibold">Responsibility</th>
        <th class="text-left p-3 text-[var(--secondary)] font-semibold">Sync Primitive</th>
        <th class="text-right p-3 text-[var(--secondary)] font-semibold">Target Latency</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-3 font-semibold text-blue-400">Frame Grabber</td>
        <td class="p-3 text-[var(--secondary)]">Reads camera buffer, writes to shared slot</td>
        <td class="p-3"><span class="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px]">threading.Lock</span></td>
        <td class="p-3 text-right text-[var(--secondary)]">&lt; 2.1 ms</td>
      </tr>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-3 font-semibold text-emerald-400">Feature Extractor</td>
        <td class="p-3 text-[var(--secondary)]">FaceMesh, solvePnP, iris vector, MAR</td>
        <td class="p-3"><span class="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px]">shared FrameQueue</span></td>
        <td class="p-3 text-right text-[var(--secondary)]">~ 8.2 ms (GPU)</td>
      </tr>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-3 font-semibold text-purple-400">Object Detector</td>
        <td class="p-3 text-[var(--secondary)]">YOLOv8n + ByteTrack, runs every N=15</td>
        <td class="p-3"><span class="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded text-[10px]">cadence counter</span></td>
        <td class="p-3 text-right text-[var(--secondary)]">~ 21 ms (GPU)</td>
      </tr>
      <tr class="hover:bg-[var(--surface)] transition-colors">
        <td class="p-3 font-semibold text-amber-400">Logger</td>
        <td class="p-3 text-[var(--secondary)]">Async SQLite writes, Socket.IO broadcast</td>
        <td class="p-3"><span class="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[10px]">queue.Queue</span></td>
        <td class="p-3 text-right text-[var(--secondary)]">Non-blocking</td>
      </tr>
    </tbody>
  </table>
</div>

---

## 3. Theoretical Framework & Algorithms

### 3.1 3D Head Pose via Perspective-n-Point

We estimate the six-degree-of-freedom head orientation by solving the Perspective-n-Point (PnP) problem [7]. Given a set of *n* 3D reference points $P_{w,i} \in \mathbb{R}^3$ in anthropometric world coordinates and their corresponding 2D projections $p_i \in \mathbb{R}^2$, the camera projection under the pinhole model is:

$$s \begin{bmatrix} u \\ v \\ 1 \end{bmatrix} = K \begin{bmatrix} R & T \end{bmatrix} \begin{bmatrix} X_w \\ Y_w \\ Z_w \\ 1 \end{bmatrix}$$

where `K` is the camera intrinsics matrix constructed from focal length approximation `f = w` (frame width) and principal point at frame center:

$$K = \begin{bmatrix} f & 0 & w/2 \\ 0 & f & h/2 \\ 0 & 0 & 1 \end{bmatrix}$$

We solve the non-linear least squares problem:

$$\min_{R, T} \sum_{i=1}^{n} \left\| p_i - \text{proj}(K, R, T, P_{w,i}) \right\|_2^2$$

using the Levenberg-Marquardt algorithm via `cv2.solvePnP`. The rotation matrix `R ∈ SO(3)` is decomposed into Euler angles through `cv2.RQDecomp3x3`:

$$\theta = \arctan(R_{32}/R_{33}), \quad \psi = \arcsin(-R_{31}), \quad \phi = \arctan(R_{21}/R_{11})$$

Six canonical landmarks (indices 1, 33, 263, 61, 291, 199 from MediaPipe's 468-point topology) are used as the PnP reference set. A stabilized estimate is produced using an exponential moving average with `α = 0.35` per axis.

:::experiment
**Clinical Calibration Note**: `head_yaw_limit = 25°` and `head_pitch_limit = 20°` were empirically determined from a pilot study of 12 participants simulating both normal examination posture and suspicious lateral scanning behavior. The 25° yaw threshold corresponds approximately to the angular displacement required to view an adjacent candidate's paper at 60 cm inter-seat spacing.
:::

### 3.2 Iris-Vector Gaze Tracking

Rather than training a dedicated gaze regression network [3], we derive a lightweight geometric proxy: the normalized horizontal iris displacement. Let $L_{in}, L_{out} \in \mathbb{R}^2$ be the inner and outer eye corner coordinates (indices 133/33 for left eye, 362/263 for right), and $I_c$ be the iris landmark centroid (indices 468/473). The horizontal gaze ratio is:

$$\gamma = \frac{\| I_c - L_{out} \|_2}{\| L_{in} - L_{out} \|_2}$$

Both eyes are computed independently and fused:

$$\gamma_{avg} = \frac{\gamma_{left} + \gamma_{right}}{2}$$

<div class="w-full my-6 border border-[var(--border)] rounded-lg overflow-hidden">
  <table class="w-full text-xs font-mono border-collapse">
    <thead>
      <tr class="bg-[var(--surface)] border-b border-[var(--border)]">
        <th class="text-left p-2.5 text-[var(--secondary)] font-semibold">Gaze State</th>
        <th class="text-left p-2.5 text-[var(--secondary)] font-semibold">Ratio Range</th>
        <th class="text-left p-2.5 text-[var(--secondary)] font-semibold">Suspicion Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-[var(--border)]"><td class="p-2.5">Left</td><td class="p-2.5 font-mono">γ > 0.60</td><td class="p-2.5 text-amber-500">Elevated</td></tr>
      <tr class="border-b border-[var(--border)]"><td class="p-2.5">Center</td><td class="p-2.5 font-mono">0.40 ≤ γ ≤ 0.60</td><td class="p-2.5 text-emerald-500">Baseline</td></tr>
      <tr><td class="p-2.5">Right</td><td class="p-2.5 font-mono">γ < 0.40</td><td class="p-2.5 text-amber-500">Elevated</td></tr>
    </tbody>
  </table>
</div>

### 3.3 Mouth Aspect Ratio (Vocalization Detection)

Oral communication is detected through the Mouth Aspect Ratio — a normalized measure of vertical mouth opening. Given the vertical lip landmarks (indices 13, 14) and horizontal mouth corners (indices 61, 291):

$$MAR = \frac{\| p_{13} - p_{14} \|_2}{\| p_{61} - p_{291} \|_2}$$

A first-order IIR filter smooths the raw signal:

$$\overline{MAR}_t = \alpha \cdot MAR_t + (1 - \alpha) \cdot \overline{MAR}_{t-1}, \quad \alpha = 0.3$$

A vocalization event is asserted when $\overline{MAR}_{t} > 0.5$.

### 3.4 Prohibited Object Detection via YOLOv8 + SAHI

YOLOv8n (2.6M parameters, 8.7 GFLOPs) performs single-shot detection [4] on COCO classes 67 (cell phone) and 73 (book). The model outputs quantized bounding box predictions $\hat{b} = (x, y, w, h, c, p_{conf})$.

To resolve small objects at distance, Slicing Aided Hyper Inference (SAHI) [5] partitions the frame into overlapping slices of dimension $W_s \times H_s = 320 \times 320$ with overlap ratio $\sigma = 0.20$:

$$I_f = \bigcup_{m,n} S_{m,n}, \quad S_{m,n} \cap S_{m+1,n} = (1 - \sigma)W_s$$

Cross-slice duplicate predictions are resolved via Non-Maximum Suppression with IoU threshold 0.55:

$$IoU(b_i, b_j) = \frac{|b_i \cap b_j|}{|b_i \cup b_j|} \geq 0.55 \implies \text{suppress } b_j$$

### 3.5 Spatiotemporal Composite Risk Accumulation

The system's core innovation is a sliding-window temporal accumulator that distinguishes transient physiological movements from sustained malpractice behavior. For each tracked student, a sliding window `W = {τ: t - 90 < τ ≤ t}` (~3 s at 30 FPS) stores per-frame risk vectors.

The instantaneous risk at frame `τ` is:

$$R_τ = 100 \cdot (0.40 \cdot O_τ + 0.22 \cdot E_τ + 0.16 \cdot H_τ + 0.14 \cdot D_τ + 0.08 \cdot C_τ)$$

<div class="w-full my-6 border border-[var(--border)] rounded-lg overflow-hidden">
  <table class="w-full text-xs font-mono border-collapse">
    <thead>
      <tr class="bg-[var(--surface)] border-b border-[var(--border)]">
        <th class="text-left p-2.5 text-[var(--secondary)] font-semibold">Component</th>
        <th class="text-left p-2.5 text-[var(--secondary)] font-semibold">Notation</th>
        <th class="text-left p-2.5 text-[var(--secondary)] font-semibold">Description</th>
        <th class="text-right p-2.5 text-[var(--secondary)] font-semibold">Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-2.5">Object</td><td class="p-2.5 font-mono">O<sub>τ</sub></td>
        <td class="p-2.5 text-[var(--secondary)]">Phone = 1.0, Book = 0.45, None = 0.0</td>
        <td class="p-2.5 text-right font-bold">0.40</td>
      </tr>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-2.5">Gaze Deviation</td><td class="p-2.5 font-mono">E<sub>τ</sub></td>
        <td class="p-2.5 text-[var(--secondary)]">Fraction of 90-frame window with non-center gaze</td>
        <td class="p-2.5 text-right font-bold">0.22</td>
      </tr>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-2.5">Head Pose</td><td class="p-2.5 font-mono">H<sub>τ</sub></td>
        <td class="p-2.5 text-[var(--secondary)]">Fraction of 90-frame window with out-of-bounds head pose</td>
        <td class="p-2.5 text-right font-bold">0.16</td>
      </tr>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-2.5">Down-Tilt</td><td class="p-2.5 font-mono">D<sub>τ</sub></td>
        <td class="p-2.5 text-[var(--secondary)]">Fraction of 90-frame window with head-down posture</td>
        <td class="p-2.5 text-right font-bold">0.14</td>
      </tr>
      <tr class="hover:bg-[var(--surface)] transition-colors">
        <td class="p-2.5">Temporal Correlation</td><td class="p-2.5 font-mono">C<sub>τ</sub></td>
        <td class="p-2.5 text-[var(--secondary)]">Fraction of last 20 frames with any deviation</td>
        <td class="p-2.5 text-right font-bold">0.08</td>
      </tr>
    </tbody>
  </table>
</div>

The composite score is the windowed mean:

$$S_t = \frac{1}{|W|} \sum_{τ \in W} R_τ$$

A deterministic escalation cascade is triggered at:

$$S_t \geq 60 \implies \text{Alert}, \quad S_t \geq 80 \implies \text{High Alert}, \quad S_t \geq 90 \implies \text{Critical Escalation}$$

When a phone is detected ($O_{\tau} = 1.0$), an immediate floor of $R_{\tau} = 85$ is enforced, bypassing the weighted sum — reflecting the protocol that unauthorized device possession warrants near-instant attention regardless of concurrent behavior.

---

## 4. Interactive Risk Simulator

The following simulation engine implements the composite scoring function in real-time. Toggle behavioral signals to observe how the temporal accumulator evolves:

<div class="w-full border border-[var(--border)] rounded-xl p-6 my-8 bg-[var(--card)] select-none">
  <div class="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
    <span class="nf nf-md-calculator_variant text-lg opacity-70"></span>
    <div>
      <h3 class="text-sm font-semibold text-[var(--foreground)]">Spatiotemporal Risk Accumulator</h3>
      <p class="text-[10px] text-[var(--muted)]">Interactive simulator — toggles update the 90-frame sliding window in real-time</p>
    </div>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
    <!-- Controls -->
    <div class="lg:col-span-2 space-y-0.5">
      <label class="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded hover:bg-[var(--surface)] transition-colors">
        <input type="checkbox" id="sim-phone" class="w-3.5 h-3.5 accent-red-500" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold group-hover:text-[var(--foreground)]">Prohibited Device (Phone)</span>
            <span class="text-[10px] font-mono text-red-400/70">w = 0.40</span>
          </div>
          <div class="text-[10px] text-[var(--muted)] truncate">COCO cls 67 — Immediate floor 85</div>
        </div>
      </label>
      <label class="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded hover:bg-[var(--surface)] transition-colors">
        <input type="checkbox" id="sim-book" class="w-3.5 h-3.5 accent-orange-500" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold group-hover:text-[var(--foreground)]">Prohibited Material (Book)</span>
            <span class="text-[10px] font-mono text-orange-400/70">w = 0.40</span>
          </div>
          <div class="text-[10px] text-[var(--muted)] truncate">COCO cls 73 — Baseline score 45</div>
        </div>
      </label>
      <label class="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded hover:bg-[var(--surface)] transition-colors">
        <input type="checkbox" id="sim-gaze" class="w-3.5 h-3.5 accent-amber-500" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold group-hover:text-[var(--foreground)]">Sustained Gaze Aversion</span>
            <span class="text-[10px] font-mono text-amber-400/70">w = 0.22</span>
          </div>
          <div class="text-[10px] text-[var(--muted)] truncate">γ ∉ [0.40, 0.60] over 90-frame window</div>
        </div>
      </label>
      <label class="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded hover:bg-[var(--surface)] transition-colors">
        <input type="checkbox" id="sim-head" class="w-3.5 h-3.5 accent-yellow-500" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold group-hover:text-[var(--foreground)]">Head Pose Out-of-Bounds</span>
            <span class="text-[10px] font-mono text-yellow-400/70">w = 0.16</span>
          </div>
          <div class="text-[10px] text-[var(--muted)] truncate">|ψ| > 25° or |θ| > 20°</div>
        </div>
      </label>
      <label class="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded hover:bg-[var(--surface)] transition-colors">
        <input type="checkbox" id="sim-down" class="w-3.5 h-3.5 accent-amber-600" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold group-hover:text-[var(--foreground)]">Head Down-Tilt Posture</span>
            <span class="text-[10px] font-mono text-amber-600/70">w = 0.14</span>
          </div>
          <div class="text-[10px] text-[var(--muted)] truncate">Sustained downward pitch deviation</div>
        </div>
      </label>
      <label class="flex items-center gap-3 cursor-pointer group px-3 py-2 rounded hover:bg-[var(--surface)] transition-colors">
        <input type="checkbox" id="sim-temp" class="w-3.5 h-3.5 accent-cyan-500" />
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold group-hover:text-[var(--foreground)]">Short-Term Temporal Spikes</span>
            <span class="text-[10px] font-mono text-cyan-400/70">w = 0.08</span>
          </div>
          <div class="text-[10px] text-[var(--muted)] truncate">Correlated deviations in last 20 frames</div>
        </div>
      </label>
      <button id="sim-reset" class="mt-2 w-full text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 border border-[var(--border)] rounded hover:bg-[var(--surface)] transition-colors text-[var(--muted)]">
        Reset All Signals
      </button>
    </div>
    <!-- Gauge + Heatmap -->
    <div class="lg:col-span-3">
      <div class="flex items-center gap-6 mb-6">
        <div class="relative w-32 h-32 flex-shrink-0">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" class="stroke-[var(--border)] fill-transparent" stroke-width="10" opacity="0.3"/>
            <circle cx="60" cy="60" r="50" class="stroke-emerald-500 fill-transparent" stroke-width="10"
              stroke-dasharray="105" stroke-dashoffset="210" stroke-linecap="round" opacity="0.2"/>
            <circle cx="60" cy="60" r="50" class="stroke-amber-500 fill-transparent" stroke-width="10"
              stroke-dasharray="52" stroke-dashoffset="105" stroke-linecap="round" opacity="0.2"/>
            <circle cx="60" cy="60" r="50" class="stroke-red-500 fill-transparent" stroke-width="10"
              stroke-dasharray="53" stroke-dashoffset="53" stroke-linecap="round" opacity="0.2"/>
            <circle cx="60" cy="60" r="50" id="gauge-active" class="fill-transparent transition-all duration-500 ease-out"
              stroke-width="10" stroke-dasharray="0 314" stroke-linecap="round"/>
            <line x1="60" y1="0" x2="60" y2="6" class="stroke-[var(--border)]" stroke-width="1.5" opacity="0.5"/>
            <line x1="110" y1="60" x2="104" y2="60" class="stroke-[var(--border)]" stroke-width="1.5" opacity="0.5"/>
            <line x1="60" y1="110" x2="60" y2="104" class="stroke-[var(--border)]" stroke-width="1.5" opacity="0.5"/>
            <line x1="10" y1="60" x2="16" y2="60" class="stroke-[var(--border)]" stroke-width="1.5" opacity="0.5"/>
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span id="sim-score-display" class="text-3xl font-mono font-bold text-[var(--foreground)]">0</span>
            <span class="text-[10px] text-[var(--muted)] uppercase tracking-widest">Risk Index</span>
          </div>
        </div>
        <div class="flex-1 space-y-1.5">
          <div id="sim-tier" class="text-xs font-mono font-bold px-3 py-1.5 rounded transition-all duration-300 bg-emerald-500/20 text-emerald-500">
            Normal — No Anomalies Detected
          </div>
          <div class="text-[10px] text-[var(--muted)] leading-relaxed">
            <span class="font-semibold text-[var(--foreground)]">Thresholds:</span> Alert ≥ 60 · High ≥ 80 · Critical ≥ 90
          </div>
          <div class="text-[10px] text-[var(--muted)]">
            Composite: <span id="sim-composition" class="font-mono text-[var(--foreground)] text-[9px]">0.40·0 + 0.22·0 + 0.16·0 + 0.14·0 + 0.08·0 = 0</span>
          </div>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">90-Frame Temporal Activity Window</span>
          <span class="text-[10px] font-mono text-[var(--muted)]"><span id="sim-active-frames">0</span>/90 frames active</span>
        </div>
        <div id="temporal-heatmap" class="grid grid-cols-30 gap-px"></div>
        <div class="flex justify-between mt-0.5 text-[8px] font-mono text-[var(--muted)]">
          <span>t − 90</span>
          <span>t</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .grid-cols-30 { grid-template-columns: repeat(30, 1fr); }
  .frame-cell { aspect-ratio: 3/1; border-radius: 2px; }
  .bench-bar { background: linear-gradient(90deg, #6366f1, #8b5cf6); }
  .bench-tab.active { background: var(--foreground); color: var(--background); border-color: var(--foreground); }
</style>

---

## 5. Implementation Architecture

### 5.1 Standalone Desktop Runtime

The standalone client is a self-contained OpenCV window application with integrated HUD rendering:

```python
def detection_loop(self):
    while self.running:
        ret, frame = self.cap.read()
        if not ret: continue

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb)
        
        if results.multi_face_landmarks:
            for landmarks in results.multi_face_landmarks:
                pitch, yaw, roll = self.calculate_head_pose(landmarks, frame.shape)
                gaze = self.get_gaze_ratio(landmarks)
                mar = self.calculate_mouth_aspect_ratio(landmarks)
                
                score = self.compute_additive_score(yaw, pitch, gaze, mar)
                self.temporal_buffer.append(score)
                self.draw_hud(frame, yaw, pitch, gaze, mar, score)
        
        if self.frame_count % 15 == 0:
            detections, frame = self.detect_objects_yolo(frame)
            if detections: self.handle_detection_alert(detections)
        
        cv2.imshow(self.WINDOW_NAME, frame)
        self.frame_count += 1
```

Key design decisions:
- **Synchronous capture-inference loop** with thread-safe frame buffer
- **Three-tier scoring**: Additive per-frame penalty + composite temporal scoring
- **Stabilized tracking** via per-parameter EMA filters (α = 0.3–0.5)
- **Session recording** to structured JSON reports on exit

### 5.2 Web Dashboard Server

The Flask backend implements production-grade architecture:
- **JWT authentication** with access/refresh token rotation (30 min / 7 day expiry)
- **Role-based access control**: Admin, Teacher, Staff Invigilator — each with scoped dashboards
- **Socket.IO real-time event bus** for push-based telemetry
- **SQLite WAL-mode database** with background thread logging
- **MJPEG streaming** for live camera feed delivery

The system supports simultaneous multi-exam-session monitoring through a room-based Socket.IO channel architecture, allowing a single admin dashboard to observe multiple examination halls concurrently.

### 5.3 Cross-Platform Mobile Client (Flutter/Dart)

The Flutter mobile app extends invigilation to handheld devices:
- **JWT-authenticated API client** connecting to the Flask backend
- **Live MJPEG feed** with overlaid anomaly metrics
- **Role-specific dashboards**: Admin (user management, pie-chart distribution) and Teacher (per-session alert timeline)
- **Animated splash screen** with scanning-line eye icon
- **Demo mode**: 3-minute scripted timeline simulating progressive anomaly escalation

---

## 6. Performance Benchmarking

### 6.1 Experimental Setup

Profiling was conducted on an Intel i5-12500H (12 cores, 2.5 GHz) with an RTX 3050 Laptop GPU (4 GB VRAM). Each pipeline configuration was evaluated over 500 frames at 640×480 resolution.

### 6.2 Latency Breakdown

<div class="w-full border border-[var(--border)] rounded-xl p-6 my-8 bg-[var(--card)]">
  <div class="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
    <span class="nf nf-md-chart_timeline_variant text-lg opacity-70"></span>
    <div>
      <h3 class="text-sm font-semibold text-[var(--foreground)]">Pipeline Stage Latency</h3>
      <p class="text-[10px] text-[var(--muted)]">Click tabs to toggle between CPU and GPU profiling data</p>
    </div>
  </div>
  <div class="flex gap-2 mb-6">
    <button id="btn-chart-cpu" class="bench-tab px-4 py-1.5 text-xs font-mono border rounded transition-all duration-200" data-mode="cpu">CPU Profiling</button>
    <button id="btn-chart-gpu" class="bench-tab px-4 py-1.5 text-xs font-mono border rounded transition-all duration-200" data-mode="gpu">GPU Profiling</button>
  </div>
  <div class="space-y-4" id="bench-container">
    <div class="bench-row" data-cpu="2.1" data-gpu="1.8">
      <div class="flex justify-between text-xs font-mono text-[var(--secondary)] mb-1">
        <span>Frame Ingestion & Camera Grab</span>
        <span class="bench-val font-bold text-[var(--foreground)]">2.1 ms</span>
      </div>
      <div class="w-full bg-[var(--surface)] h-5 rounded-full overflow-hidden">
        <div class="bench-bar h-full rounded-full transition-all duration-500 ease-out" style="width:1%"></div>
      </div>
    </div>
    <div class="bench-row" data-cpu="24.5" data-gpu="8.2">
      <div class="flex justify-between text-xs font-mono text-[var(--secondary)] mb-1">
        <span>MediaPipe FaceMesh (468 landmarks + iris)</span>
        <span class="bench-val font-bold text-[var(--foreground)]">24.5 ms</span>
      </div>
      <div class="w-full bg-[var(--surface)] h-5 rounded-full overflow-hidden">
        <div class="bench-bar h-full rounded-full transition-all duration-500 ease-out" style="width:1%"></div>
      </div>
    </div>
    <div class="bench-row" data-cpu="82.4" data-gpu="21.0">
      <div class="flex justify-between text-xs font-mono text-[var(--secondary)] mb-1">
        <span>YOLOv8n Object Detection (cls 67, 73)</span>
        <span class="bench-val font-bold text-[var(--foreground)]">82.4 ms</span>
      </div>
      <div class="w-full bg-[var(--surface)] h-5 rounded-full overflow-hidden">
        <div class="bench-bar h-full rounded-full transition-all duration-500 ease-out" style="width:1%"></div>
      </div>
    </div>
    <div class="bench-row" data-cpu="315.0" data-gpu="58.6">
      <div class="flex justify-between text-xs font-mono text-[var(--secondary)] mb-1">
        <span>YOLOv8n + SAHI Hyper-Inference (σ = 0.20)</span>
        <span class="bench-val font-bold text-[var(--foreground)]">315.0 ms</span>
      </div>
      <div class="w-full bg-[var(--surface)] h-5 rounded-full overflow-hidden">
        <div class="bench-bar h-full rounded-full transition-all duration-500 ease-out" style="width:1%"></div>
      </div>
    </div>
    <div class="bench-row" data-cpu="12.3" data-gpu="4.1">
      <div class="flex justify-between text-xs font-mono text-[var(--secondary)] mb-1">
        <span>ByteTrack IoU + Kalman Filter Update</span>
        <span class="bench-val font-bold text-[var(--foreground)]">12.3 ms</span>
      </div>
      <div class="w-full bg-[var(--surface)] h-5 rounded-full overflow-hidden">
        <div class="bench-bar h-full rounded-full transition-all duration-500 ease-out" style="width:1%"></div>
      </div>
    </div>
  </div>
  <div class="mt-4 p-3 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
    <div class="flex items-center justify-between text-xs font-mono">
      <span class="text-[var(--secondary)]">Estimated Effective Throughput</span>
      <span id="bench-fps" class="font-bold text-[var(--foreground)]">~22.5 FPS (CPU) · 44.4 ms total latency</span>
    </div>
  </div>
</div>

### 6.3 Performance Data

<div class="w-full my-6 border border-[var(--border)] rounded-lg overflow-hidden">
  <table class="w-full text-xs font-mono border-collapse">
    <thead>
      <tr class="bg-[var(--surface)] border-b border-[var(--border)]">
        <th class="text-left p-2.5 text-[var(--secondary)] font-semibold">Pipeline Configuration</th>
        <th class="text-right p-2.5 text-[var(--secondary)] font-semibold">CPU Latency</th>
        <th class="text-right p-2.5 text-[var(--secondary)] font-semibold">GPU Latency</th>
        <th class="text-right p-2.5 text-[var(--secondary)] font-semibold">CPU FPS</th>
        <th class="text-right p-2.5 text-[var(--secondary)] font-semibold">GPU FPS</th>
        <th class="text-right p-2.5 text-[var(--secondary)] font-semibold">Speedup</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-2.5">Baseline (FaceMesh only)</td>
        <td class="p-2.5 text-right">26.6 ms</td>
        <td class="p-2.5 text-right">10.0 ms</td>
        <td class="p-2.5 text-right">37.6</td>
        <td class="p-2.5 text-right">100.0</td>
        <td class="p-2.5 text-right text-emerald-500 font-bold">2.66×</td>
      </tr>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-2.5">+ YOLOv8n (every frame)</td>
        <td class="p-2.5 text-right">109.0 ms</td>
        <td class="p-2.5 text-right">31.0 ms</td>
        <td class="p-2.5 text-right">9.2</td>
        <td class="p-2.5 text-right">32.3</td>
        <td class="p-2.5 text-right text-emerald-500 font-bold">3.52×</td>
      </tr>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-2.5">+ YOLOv8n (N=15 cadence)</td>
        <td class="p-2.5 text-right">33.4 ms</td>
        <td class="p-2.5 text-right">11.4 ms</td>
        <td class="p-2.5 text-right">29.9</td>
        <td class="p-2.5 text-right">87.7</td>
        <td class="p-2.5 text-right text-emerald-500 font-bold">2.93×</td>
      </tr>
      <tr class="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
        <td class="p-2.5">+ SAHI + YOLOv8n</td>
        <td class="p-2.5 text-right">341.5 ms</td>
        <td class="p-2.5 text-right">68.6 ms</td>
        <td class="p-2.5 text-right">2.9</td>
        <td class="p-2.5 text-right">14.6</td>
        <td class="p-2.5 text-right text-emerald-500 font-bold">4.98×</td>
      </tr>
      <tr class="hover:bg-[var(--surface)] transition-colors">
        <td class="p-2.5 font-semibold">Full Pipeline (optimized)*</td>
        <td class="p-2.5 text-right font-semibold">48.2 ms</td>
        <td class="p-2.5 text-right font-semibold">15.3 ms</td>
        <td class="p-2.5 text-right font-semibold">20.7</td>
        <td class="p-2.5 text-right font-semibold">65.4</td>
        <td class="p-2.5 text-right text-emerald-500 font-bold">3.15×</td>
      </tr>
    </tbody>
  </table>
</div>

:::insight
**Optimization Strategy**: The optimized pipeline runs MediaPipe FaceMesh on every frame (sub-millisecond on GPU) while throttling YOLOv8n to every N=15 frames with Lucas-Kanade optical flow interpolation for bounding box propagation between inference ticks. This reduces effective YOLO latency by 93% while maintaining detection coverage within ±0.5 s of real-time.
:::

---

## 7. Deployment Topologies

The system supports two distinct deployment modes:

### 7.1 Standalone Mode

Fully self-contained native OpenCV window with real-time HUD, runs entirely on local hardware, writes structured reports to disk. Suitable for individual examination rooms without network infrastructure.

```python
# Usage: python silent_invigilator.py
# Controls: Q = quit & save | R = reset scores | S = save snapshot
```

### 7.2 Server-Client Mode

The Flask backend operates as a central monitoring hub, accepting camera feeds from multiple examination rooms and broadcasting telemetry to connected dashboards.

<div class="w-full my-6 border border-[var(--border)] rounded-lg overflow-hidden">
  <table class="w-full text-xs font-mono border-collapse">
    <thead>
      <tr class="bg-[var(--surface)] border-b border-[var(--border)]">
        <th class="text-left p-2.5 text-[var(--secondary)] font-semibold">Role</th>
        <th class="text-left p-2.5 text-[var(--secondary)] font-semibold">Permissions</th>
        <th class="text-left p-2.5 text-[var(--secondary)] font-semibold">Dashboard Surface</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-[var(--border)]"><td class="p-2.5 font-bold">Admin</td><td class="p-2.5 text-[var(--secondary)]">User CRUD, all-session monitoring, system config, alert ack</td><td class="p-2.5">Web + Mobile</td></tr>
      <tr class="border-b border-[var(--border)]"><td class="p-2.5 font-bold">Teacher</td><td class="p-2.5 text-[var(--secondary)]">Per-session logs, real-time scores, incident timeline</td><td class="p-2.5">Web + Mobile</td></tr>
      <tr><td class="p-2.5 font-bold">Staff Invigilator</td><td class="p-2.5 text-[var(--secondary)]">Live video feed, per-frame risk gauge, alert log</td><td class="p-2.5">Web</td></tr>
    </tbody>
  </table>
</div>

---

## 8. Future Work

Several extensions are under active investigation:

- **Transformer-based temporal fusion**: Replacing the weighted sliding window with a lightweight attention mechanism (Perceiver-IO) to learn inter-modal temporal dependencies end-to-end.
- **Multi-camera spatial fusion**: Extending ByteTrack with cross-camera ReID embeddings for consistent identity tracking across overlapping camera views in large examination halls.
- **On-device deployment**: Quantizing YOLOv8n to INT8 via TensorRT for NVIDIA Jetson Orin-class edge devices at sub-10 ms latency.
- **Adversarial robustness auditing**: Evaluating system resilience against evasion attacks (e.g., adversarial patches on clothing designed to suppress YOLO detections).

---

## References

<div class="references-list text-xs font-mono leading-relaxed space-y-1">
<p>[1] Parasuraman, R. (1987). Human-computer monitoring. <em>Human Factors</em>, 29(6), 671–686.</p>
<p>[2] Thomson, D. R., Besner, D., &amp; Smilek, D. (2015). A resource-control account of sustained attention. <em>Perspectives on Psychological Science</em>, 10(1), 82–96.</p>
<p>[3] Lugaresi, C., et al. (2019). MediaPipe: A Framework for Building Perception Pipelines. <em>arXiv:1906.08172</em>.</p>
<p>[4] Jocher, G., et al. (2023). Ultralytics YOLOv8. <em>GitHub: ultralytics/ultralytics</em>.</p>
<p>[5] Akyon, F. C., et al. (2022). Slicing Aided Hyper Inference and Fine-Tuning for Small Object Detection. <em>IEEE ICIP 2022</em>.</p>
<p>[6] Zhang, Y., et al. (2022). ByteTrack: Multi-Object Tracking by Associating Every Detection Box. <em>ECCV 2022</em>.</p>
<p>[7] Lepetit, V., Moreno-Noguer, F., &amp; Fua, P. (2009). EPnP: An Accurate O(n) Solution to the PnP Problem. <em>International Journal of Computer Vision</em>, 81(2).</p>
<p>[8] Bradski, G. (2000). The OpenCV Library. <em>Dr. Dobb's Journal of Software Tools</em>.</p>
</div>

