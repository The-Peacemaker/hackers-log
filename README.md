# BENEDICT'S NOTEBOOK

A digital substrate for the inscription of research artifacts, vulnerability disclosures, engineering postmortems, and speculative intelligence projections. Constructed atop Next.js 14 with a custom markdown engine, server-side KaTeX rendering, and a multi-surface taxonomy of knowledge classification.

---

## ARCHITECTURE

The system is decomposed into four operational layers, each with distinct responsibilities and failure modes:

**Layer 1 — Ingestion Pipeline**
Markdown frontmatter parsed through gray-matter. Custom `renderMath()` function transforms LaTeX-delimited expressions (`$$...$$` for display, `$...$$...$` for inline) into server-rendered KaTeX HTML at build time. Shiki syntax highlighter generates dual-theme code blocks (light/dark) with copy-to-clipboard instrumentation.

**Layer 2 — Taxonomy Matrix**
Posts classified along two orthogonal axes: `category` (Open Source, Security, AI, Computer Science) as a YAML list enabling multi-axis membership, and `tags` as an unstructured keyword vector for fine-grained检索. Categories render as icon-anchored badges at the top of each article. Activity logs provide a temporal sidechain for low-latency updates.

**Layer 3 — Rendering Engine**
Interactive elements (risk simulators, latency benchmarks, timeline visualizations) are hydrated client-side through a dedicated `InteractiveContent` wrapper that re-executes embedded script elements post-mount via `requestAnimationFrame`. The `PostInteractions` module manages scroll-linked heading tracking, TOC active-state synchronization, and code-copy event delegation.

**Layer 4 — Surface Topology**
Three client surfaces: homepage dashboard with category-filtered post grid and temporal activity feed, SSG-rendered article pages with sticky scrollable table-of-contents sidebar, and a JSON search API endpoint for client-side retrieval-augmented navigation.

---

## INTELLIGENCE STACK

| Component | Implementation | Purpose |
|---|---|---|
| Framework | Next.js 14 (App Router) | Static site generation with incremental static regeneration |
| Typography | Instrument Serif + Inter + JetBrains Mono | Hierarchical type system: serif for prose, mono for code |
| Styling | Tailwind CSS + CSS custom properties | Dark-first design system with CSS variable theming |
| Math | KaTeX (server-side renderToString) | Zero-latency mathematical expression rendering |
| Syntax | Shiki (dual-theme code blocks) | Syntax highlighting matching system color scheme |
| Content | Markdown + gray-matter + marked | Custom pipeline with callout extensions and footnote support |
| Charts | Inline SVG with CSS transitions | Interactive data visualizations without JavaScript dependencies |

---

## POST MASS

The substrate currently hosts 8 primary research artifacts across 4 categories:

**Security**
- AGSA Velour dynact:// Intent Injection — Google VRP finding: inner-intent URI injection via exported gateway activity
- Bazel ProxyHelper Credential Bleed — Google OSS VRP finding: JVM-global Authenticator leaking proxy credentials across boundaries, PR #29736
- Google Family Link TestingTools — Exported debug BroadcastReceiver with 10 permissionless actions, Phenotype-flag gated
- Silent Invigilator — Multi-modal exam surveillance with spatiotemporal risk accumulation (Flask, Flutter, YOLOv8, MediaPipe)

**Open Source / AI**
- QuantFlow — Algorithmic trading system for Indian equity markets (15+ indicators, Kelly Criterion, Angel One integration)
- Visa Status Prediction — ML pipeline for visa processing time estimation (Random Forest, R² 0.87, React + Flask on serverless)
- Timeline: The Intelligence Explosion (2025–2027) — Eight-quarter projection with compute scaling models
- Singularity Report — Recursive self-improvement analysis with RSI simulation, Fermi paradox taxonomy, and phase transition framework

---

## LOCOMOTION

```bash
# Install dependencies
npm install

# Activate development server with hot module replacement
npm run dev

# Compile static production bundle
npm run build

# Serve production build
npm start

# Validate type constraints
npm run typecheck
```

The development server materializes at `http://localhost:3000`. Static pages are generated at build time with SSG — each post is an independent compilation unit.

---

## CONTRIBUTION PROTOCOL

Research artifacts are inscribed as Markdown files in `content/posts/` with YAML frontmatter. Each artifact requires:

```yaml
---
title: "Describes the artifact with precision"
date: "YYYY-MM-DD"
category: ["Category1", "Category2"]
tags: ["Keyword1", "Keyword2"]
readingTime: "N min read"
summary: "A compression of the artifact's significance into 2-3 sentences"
---
```

Activity logs reside in `content/logs/` with minimal frontmatter — date only. Content is freeform Markdown, typically 1-3 paragraphs documenting temporal state transitions.

---

## DEPLOYMENT TOPOLOGY

The compiled substrate is deployed to GitHub Pages or any static hosting provider. The `npm run build` command produces an optimized `.next/` directory containing all SSG-generated HTML, JavaScript bundles, and CSS artifacts. No server-side runtime is required post-compilation.

---

## LICENSE

MIT — The substrate is freely forkable, modifiable, and redistributable. Attribution is appreciated but not enforced.

---

## SIGNAL

For inquiries, vulnerability disclosures, or collaboration proposals: `benedictcm1@gmail.com`

---

`> The universe wants to wake up. We are just the alarm clock.`
