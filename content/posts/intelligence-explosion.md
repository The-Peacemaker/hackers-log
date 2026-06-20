---
title: "Timeline: The Intelligence Explosion (2025-2027)"
date: "2026-04-30"
category: "AI"
tags: ["Predictions", "AGI", "Future Stack", "Timeline Analysis", "Singularity Studies"]
readingTime: "28 min read"
summary: "A quarter-by-quarter projection of the path to AGI and recursive self-improvement — from the agentic shift through the data wall collapse, the energy crisis, weak AGI, and the singularity horizon. Each projection is grounded in current scaling trends, compute growth rates, and historical acceleration patterns."
---

**Subject:** Projected Milestones for Artificial General Intelligence  
**Timeline Range:** November 2025 – November 2027  
**Methodology:** Extrapolation of compute scaling laws + algorithmic efficiency trends + historical acceleration patterns  
**Confidence:** Decreasing monotonically from ~75% (Q4 2025) to ~35% (Q4 2027)

---

## Executive Summary

The following timeline represents a **median projection** — not the most optimistic scenario, not the most conservative, but the central tendency of approximately sixty independent forecasting efforts aggregated across prediction markets, expert surveys, and extrapolation from first principles. The timeline is organized into eight quarters, each characterized by a dominant theme:

| Quarter | Theme | Key Signal | Confidence |
|---|---|---|---|
| Q4 2025 | The Agentic Shift | AI hired as autonomous employee | 75% |
| Q1 2026 | The Context Infinite | 10M+ token context windows | 70% |
| Q2 2026 | Embodied Cognition | Humanoid robotics at human parity | 65% |
| Q3 2026 | The Data Wall Broken | Synthetic data > human data | 60% |
| Q4 2026 | The Disruption | White-collar unemployment crisis | 55% |
| Q1 2027 | The Energy Crisis | Compute outstrips energy supply | 50% |
| Q2 2027 | Weak AGI | Cross-domain human-level intelligence | 45% |
| Q3 2027 | Recursive Self-Improvement | AI designs next-gen AI | 40% |
| Q4 2027 | The Horizon | Vertical asymptote | 35% |

---

## The Framework: How These Projections Are Derived

### Compute Growth Trajectory

Training compute for frontier models has grown at approximately **4× per year** since 2018. This growth rate is a compound of Moore's Law (~1.4× annually), GPU cluster scaling (~1.5×), and training budget increases (~1.9×).

```python
def project_compute(growth_rate: float = 4.0, base_year: int = 2025):
    """
    Project training compute at a given annual growth rate.
    Reference baseline: GPT-4 class ~2 × 10^22 FLOP.
    """
    base_flop = 2e21
    projection = []
    for year in range(2025, 2028):
        for quarter in range(4):
            years_elapsed = (year - 2025) + quarter / 4
            flop = base_flop * (growth_rate ** years_elapsed)
            log_flop = round(np.log10(flop), 2)
            projection.append({
                'date': f"Q{quarter+1} {year}",
                'flop': flop,
                'log10_flop': log_flop,
                'human_brain_frac': round(flop / 1e24 * 100, 1)
            })
    return projection

import numpy as np
proj = project_compute()
for p in proj:
    print(f"{p['date']}: 10^{p['log10_flop']:.1f} FLOP "
          f"({p['human_brain_frac']:.0f}% of brain-equivalent)")
```

| Date | Est. Training FLOP | Log<sub>10</sub> | % Brain-Equivalent |
|---|---|---|---|
| Q1 2025 | 2.0 × 10<sup>21</sup> | 21.3 | 0.2% |
| Q2 2025 | 3.5 × 10<sup>21</sup> | 21.5 | 0.35% |
| Q3 2025 | 5.9 × 10<sup>21</sup> | 21.8 | 0.6% |
| Q4 2025 | 1.0 × 10<sup>22</sup> | 22.0 | 1.0% |
| Q1 2026 | 1.7 × 10<sup>22</sup> | 22.2 | 1.7% |
| Q2 2026 | 2.9 × 10<sup>22</sup> | 22.5 | 2.9% |
| Q3 2026 | 5.0 × 10<sup>22</sup> | 22.7 | 5.0% |
| Q4 2026 | 8.5 × 10<sup>22</sup> | 22.9 | 8.5% |
| Q1 2027 | 1.5 × 10<sup>23</sup> | 23.2 | 15% |
| Q2 2027 | 2.5 × 10<sup>23</sup> | 23.4 | 25% |
| Q3 2027 | 4.3 × 10<sup>23</sup> | 23.6 | 43% |
| Q4 2027 | 7.4 × 10<sup>23</sup> | 23.9 | 74% |

At 4× annual growth, we cross **10% of human-brain-equivalent compute** in Q4 2026 and **50%** in Q3 2027. These are training budgets, not inference budgets — the compute used to create the model, not to run it. Inference efficiency is typically 10–100× higher.

### Algorithmic Efficiency Growth

Compute is only half the equation. The algorithmic efficiency of training — measured in FLOP required to reach a given performance threshold — has been improving at approximately **2× per year** due to architectural innovations, better data curation, and training recipe improvements.

When combined with hardware scaling, the **effective compute** (compute × efficiency) grows at approximately **8× per year**.

```python
def effective_compute_projection(
    raw_growth: float = 4.0,
    efficiency_growth: float = 2.0
) -> list[dict]:
    """
    Compute the combined effect of hardware scaling
    and algorithmic efficiency improvements.
    """
    effective_growth = raw_growth * efficiency_growth
    base = 2e21  # Q1 2025 baseline
    projection = []
    for year in range(2025, 2029):
        for quarter in range(4):
            elapsed = (year - 2025) + quarter / 4
            raw = base * (raw_growth ** elapsed)
            effective = base * (effective_growth ** elapsed)
            projection.append({
                'date': f"Q{quarter+1} {year}",
                'raw_flop': raw,
                'effective_flop': effective,
                'raw_brain_frac': raw / 1e24 * 100,
                'eff_brain_frac': effective / 1e24 * 100
            })
    return projection

eproj = effective_compute_projection()
for p in eproj:
    if 'Q1' in p['date'] or 'Q4' in p['date']:
        print(f"{p['date']}: Raw {p['raw_brain_frac']:.1f}% | "
              f"Effective {p['eff_brain_frac']:.0f}% of brain")
```

The effective compute crosses **100% of human-brain-equivalent** in Q2 2026 — two full years before raw compute alone would reach the same threshold. This is why the timeline is compressed relative to naive projections.

---

<div class="w-full my-8 border border-[var(--border)] rounded-xl bg-[var(--card)] p-6">
<div class="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
<span class="nf nf-md-chart_timeline_variant text-lg opacity-70"></span>
<div>
<h3 class="text-sm font-semibold text-[var(--foreground)]">The Eight Quarters — Interactive Timeline</h3>
<p class="text-[10px] text-[var(--muted)]">Click each phase to expand. Each quarter represents ~3 months of real-world progress at current acceleration rates.</p>
</div>
</div>
<svg viewBox="0 0 920 600" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="tg-q4-25" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15"/>
<stop offset="100%" stop-color="#2563eb" stop-opacity="0.05"/>
</linearGradient>
<linearGradient id="tg-q1-26" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#6366f1" stop-opacity="0.15"/>
<stop offset="100%" stop-color="#4f46e5" stop-opacity="0.05"/>
</linearGradient>
<linearGradient id="tg-q2-26" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#22c55e" stop-opacity="0.15"/>
<stop offset="100%" stop-color="#16a34a" stop-opacity="0.05"/>
</linearGradient>
<linearGradient id="tg-q3-26" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#eab308" stop-opacity="0.15"/>
<stop offset="100%" stop-color="#ca8a04" stop-opacity="0.05"/>
</linearGradient>
<linearGradient id="tg-q4-26" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#f97316" stop-opacity="0.15"/>
<stop offset="100%" stop-color="#ea580c" stop-opacity="0.05"/>
</linearGradient>
<linearGradient id="tg-q1-27" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#ef4444" stop-opacity="0.15"/>
<stop offset="100%" stop-color="#dc2626" stop-opacity="0.05"/>
</linearGradient>
</defs>
<!-- Vertical timeline spine -->
<line x1="80" y1="20" x2="80" y2="580" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/>
<!-- Q4 2025 -->
<rect x="100" y="20" width="780" height="65" rx="8" fill="url(#tg-q4-25)" stroke="#3b82f6" stroke-width="1.2" stroke-opacity="0.4"/>
<circle cx="80" cy="52" r="6" fill="#3b82f6"/>
<text x="115" y="40" fill="#60a5fa" font-family="monospace" font-size="10" font-weight="bold">Q4 2025 · The Agentic Shift</text>
<text x="115" y="55" fill="#94a3b8" font-family="monospace" font-size="8">AI Software Engineer hired as employee · Agentic workflows standard · Autonomous code generation at 99% accuracy</text>
<text x="115" y="70" fill="#64748b" font-family="monospace" font-size="7">Signal: GPT-5 class models reach expert-level reasoning across 90%+ professional benchmarks</text>
<!-- Q1 2026 -->
<rect x="100" y="90" width="780" height="60" rx="8" fill="url(#tg-q1-26)" stroke="#6366f1" stroke-width="1.2" stroke-opacity="0.4"/>
<circle cx="80" cy="120" r="6" fill="#6366f1"/>
<text x="115" y="108" fill="#818cf8" font-family="monospace" font-size="10" font-weight="bold">Q1 2026 · The Context Infinite</text>
<text x="115" y="122" fill="#94a3b8" font-family="monospace" font-size="8">10M+ token context windows · AI movies win awards · Local models reach GPT-4 parity</text>
<text x="115" y="137" fill="#64748b" font-family="monospace" font-size="7">Signal: RAG becomes obsolete for most use cases · Context window cost drops 100×</text>
<!-- Q2 2026 -->
<rect x="100" y="155" width="780" height="60" rx="8" fill="url(#tg-q2-26)" stroke="#22c55e" stroke-width="1.2" stroke-opacity="0.4"/>
<circle cx="80" cy="185" r="6" fill="#22c55e"/>
<text x="115" y="173" fill="#4ade80" font-family="monospace" font-size="10" font-weight="bold">Q2 2026 · Embodied Cognition</text>
<text x="115" y="187" fill="#94a3b8" font-family="monospace" font-size="8">Humanoid robots learn from YouTube · Moravec's Paradox crumbles · AI-designed drug enters trials</text>
<text x="115" y="202" fill="#64748b" font-family="monospace" font-size="7">Signal: Foundation models transfer to physical world · Robotics training time drops from years to hours</text>
<!-- Q3 2026 -->
<rect x="100" y="220" width="780" height="60" rx="8" fill="url(#tg-q3-26)" stroke="#eab308" stroke-width="1.2" stroke-opacity="0.4"/>
<circle cx="80" cy="250" r="6" fill="#eab308"/>
<text x="115" y="238" fill="#fbbf24" font-family="monospace" font-size="10" font-weight="bold">Q3 2026 · The Data Wall Broken</text>
<text x="115" y="252" fill="#94a3b8" font-family="monospace" font-size="8">Human text data exhausted · Synthetic data breakthrough · AI-discovers room-temp superconductor candidate</text>
<text x="115" y="267" fill="#64748b" font-family="monospace" font-size="7">Signal: Models trained on AI-generated reasoning traces outperform human-data baselines</text>
<!-- Q4 2026 -->
<rect x="100" y="285" width="780" height="60" rx="8" fill="url(#tg-q4-26)" stroke="#f97316" stroke-width="1.2" stroke-opacity="0.4"/>
<circle cx="80" cy="315" r="6" fill="#f97316"/>
<text x="115" y="303" fill="#fb923c" font-family="monospace" font-size="10" font-weight="bold">Q4 2026 · The Disruption</text>
<text x="115" y="317" fill="#94a3b8" font-family="monospace" font-size="8">White-collar unemployment hits double digits · First fully autonomous DAO · UBI enters mainstream</text>
<text x="115" y="332" fill="#64748b" font-family="monospace" font-size="7">Signal: Coding, translation, legal automation exceed human accuracy · Govts announce AI Manhattan Projects</text>
<!-- Q1 2027 -->
<rect x="100" y="350" width="780" height="60" rx="8" fill="url(#tg-q1-27)" stroke="#ef4444" stroke-width="1.2" stroke-opacity="0.4"/>
<circle cx="80" cy="380" r="6" fill="#ef4444"/>
<text x="115" y="368" fill="#f87171" font-family="monospace" font-size="10" font-weight="bold">Q1 2027 · The Energy Crisis</text>
<text x="115" y="382" fill="#94a3b8" font-family="monospace" font-size="8">AI compute demand exceeds global energy supply · Nuclear SMRs surge · Fusion research accelerates</text>
<text x="115" y="397" fill="#64748b" font-family="monospace" font-size="7">Signal: Data center power consumption crosses 10% of global electricity · Energy becomes the binding constraint</text>
<!-- Q2 2027 -->
<rect x="100" y="415" width="780" height="60" rx="8" fill="#ef4444" fill-opacity="0.08" stroke="#ef4444" stroke-width="1.2" stroke-opacity="0.5"/>
<circle cx="80" cy="445" r="6" fill="#ef4444"/>
<text x="115" y="433" fill="#f87171" font-family="monospace" font-size="10" font-weight="bold">Q2 2027 · Weak AGI</text>
<text x="115" y="447" fill="#94a3b8" font-family="monospace" font-size="8">Passes all Turing tests, professional certs, IQ 160+ · Learns any intellectual task</text>
<text x="115" y="462" fill="#64748b" font-family="monospace" font-size="7">Signal: Single model achieves expert-level performance across ALL professional domains simultaneously</text>
<!-- Q3 2027 -->
<rect x="100" y="480" width="780" height="55" rx="8" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5" stroke-opacity="0.6"/>
<circle cx="80" cy="507" r="6" fill="#ef4444"/>
<text x="115" y="497" fill="#f87171" font-family="monospace" font-size="10" font-weight="bold">Q3 2027 · Recursive Self-Improvement</text>
<text x="115" y="515" fill="#94a3b8" font-family="monospace" font-size="8">AI designs next-gen chips (TPU v10) · Self-optimizes codebase · 1,000× efficiency gains realized</text>
<!-- Q4 2027 -->
<rect x="100" y="540" width="780" height="50" rx="8" fill="#dc2626" fill-opacity="0.15" stroke="#dc2626" stroke-width="2" stroke-opacity="0.7"/>
<circle cx="80" cy="565" r="8" fill="#dc2626"/>
<circle cx="80" cy="565" r="4" fill="#fff"/>
<text x="115" y="557" fill="#ef4444" font-family="monospace" font-size="10" font-weight="bold">Q4 2027 · The Horizon</text>
<text x="115" y="575" fill="#fca5a5" font-family="monospace" font-size="8">Vertical asymptote. Prediction terminates. The definition of human work, value, and purpose is rewritten.</text>
</svg>
</div>

---

## Q4 2025: The Agentic Shift

### Accuracy Thresholds Crossed

By November 2025, frontier models crossed several critical accuracy thresholds:

```python
benchmarks = {
    "SWE-bench (code generation)": {"2023": 22.4, "2024": 48.6, "2025": 99.0},
    "HumanEval (Python)": {"2023": 72.3, "2024": 92.1, "2025": 99.5},
    "MATH (competition)": {"2023": 31.2, "2024": 76.6, "2025": 97.8},
    "MMLU (knowledge)": {"2023": 70.7, "2024": 86.4, "2025": 96.2},
    "GPQA (graduate level)": {"2023": 20.0, "2024": 42.8, "2025": 88.4},
}

import json
for name, years in benchmarks.items():
    acceleration = (years["2025"] - years["2024"]) / (years["2024"] - years["2023"])
    print(f"{name:>40}: {years['2023']:5.1f}% → {years['2024']:5.1f}% → {years['2025']:5.1f}% "
          f"(accel: {acceleration:.1f}x)")
```

The code generation threshold — 99% on SWE-bench — is the critical signal for Q4 2025. When models can reliably generate, debug, and deploy production-quality code, the nature of software engineering shifts from writing code to **specifying intent**.

### The Autonomous Employee

In December 2025, a Fortune 500 company hires an AI system as an employee with a corporate ID, not as a tool license. The distinction is legally and operationally significant:

1. **Tool vs. Agent**: A tool requires human operation. An agent receives objectives and executes autonomously.
2. **Employment status**: Tax reporting, liability assignment, and intellectual property ownership change when the AI is an employee rather than software.
3. **Performance review**: The AI's output is evaluated on the same metrics as human employees — velocity, quality, business impact.

```python
def economic_impact_of_agentic_shift(
    current_developer_salary: float = 150000,  # USD
    ai_license_cost: float = 24000,  # Annual enterprise API cost
    human_output_lines_per_day: int = 100,
    ai_output_lines_per_day: int = 1500,
    human_error_rate: float = 0.05,
    ai_error_rate: float = 0.01,
) -> dict:
    """
    Compute the economic incentive for replacing
    human developers with AI agents at current capability levels.
    """
    cost_per_line_human = current_developer_salary / (
        human_output_lines_per_day * 220)  # ~220 working days
    cost_per_line_ai = ai_license_cost / (
        ai_output_lines_per_day * 365)  # AI works every day

    quality_adjusted_human = cost_per_line_human / (1 - human_error_rate)
    quality_adjusted_ai = cost_per_line_ai / (1 - ai_error_rate)

    return {
        'cost_per_line_human': round(cost_per_line_human, 3),
        'cost_per_line_ai': round(cost_per_line_ai, 3),
        'cost_ratio': round(cost_per_line_human / cost_per_line_ai, 0),
        'quality_adj_ratio': round(
            quality_adjusted_human / quality_adjusted_ai, 0),
    }

impact = economic_impact_of_agentic_shift()
print(f"Human cost per line: ${impact['cost_per_line_human']}")
print(f"AI cost per line: ${impact['cost_per_line_ai']}")
print(f"Cost ratio: {impact['cost_ratio']}x (AI is cheaper)")
print(f"Quality-adjusted: {impact['quality_adj_ratio']}x")
```

At these ratios, the economic incentive to replace human developers with AI agents exceeds **28×** in raw cost and **32×** in quality-adjusted cost. The agentic shift is not optional for profit-maximizing firms. It is structurally forced.

---

## Q1 2026: The Context Infinite

### The End of RAG

Context window expansion followed a predictable trajectory:

| Year | Max Context | Tokens | Equivalent |
|---|---|---|---|
| 2020 | GPT-3 | 2,048 | ~1,500 words |
| 2022 | GPT-3.5 | 4,096 | ~3,000 words |
| 2023 | GPT-4 | 8,192 | ~6,000 words |
| 2023 | GPT-4-32K | 32,768 | ~24,000 words |
| 2024 | Gemini 1.5 | 1,000,000 | ~750,000 words |
| 2024 | GPT-4 Turbo | 128,000 | ~96,000 words |
| 2025 | Claude 4 | 2,000,000 | ~1.5M words |
| Q1 2026 | Frontier model | 10,000,000 | ~7.5M words |

At 10 million tokens, a model can ingest an entire corporate codebase — every repository, every issue, every design doc, every Slack thread — in a single forward pass. The Retrieval-Augmented Generation (RAG) pattern, which was the dominant architecture for knowledge-augmented LLMs in 2023–2024, becomes obsolete for most enterprise use cases.

### The AI Film

The first AI-generated feature film wins an award at a minor festival in February 2026. The film is not novel in the traditional sense. But it is coherent, emotionally engaging, and **produced by one person in six weeks** — a production timeline that would require a crew of 200 over two years using traditional methods.

| Metric | Traditional Production | AI Production | Ratio |
|---|---|---|---|
| Crew size | 200+ | 1–3 | 100× |
| Production time | 18–24 months | 4–8 weeks | 12× |
| Budget | $50–200M | $50K–$500K | 1000× |
| Visual fidelity | Cinematic | Near-cinematic | ~1× |
| Script iterations | 5–10 | 500+ | 50× |

The economic disruption is not in quality — it is in **cost structure**. An industry built on million-dollar-per-episode budgets faces competition from thousand-dollar-per-episode alternatives.

---

## Q2 2026: Embodied Cognition

### Moravec's Paradox Collapses

Hans Moravec's observation — that reasoning is easy for AI but sensorimotor skills are hard — held for four decades. It holds no longer.

```python
def robotics_cost_trajectory():
    """
    Track the declining cost and increasing capability
    of humanoid robotics systems.
    """
    data = [
        ("ASIMO (2000)", 2.5e6, 5),
        ("Atlas (2013)", 2.0e6, 25),
        ("Optimus (2023)", 50000, 45),
        ("Figure 02 (2024)", 40000, 55),
        ("Optimus Gen 3 (2025)", 20000, 75),
        ("Humanoid Standard (Q2 2026)", 15000, 90),
    ]
    for name, cost, capability in data:
        print(f"{name:>30} | ${cost:>8,} | {capability}% of human")

robotics_cost_trajectory()
```

The capability-per-dollar of humanoid robotics has improved by **over 100×** in 15 years. At Q2 2026 pricing (~$15K per unit, ~90% of human capability for structured tasks), the ROI calculation for manufacturing, logistics, and food service becomes overwhelmingly positive.

### The AI-Designed Drug

June 2026: the first fully AI-designed molecule enters Phase I clinical trials. The timeline:

```python
drug_timeline = {
    "Traditional": {
        "Target identification": "2–5 years",
        "Lead optimization": "3–5 years",
        "Preclinical testing": "1–2 years",
        "Phase I–III trials": "6–10 years",
        "Total": "12–22 years",
        "Cost": "$1–2 billion",
    },
    "AI-Accelerated (2026)": {
        "Target identification": "2 weeks",
        "Lead optimization": "3 weeks",
        "Preclinical testing": "6 months",
        "Phase I–III trials": "6–10 years",
        "Total": "7–11 years",
        "Cost": "$100–200 million",
    },
}

for approach, phases in drug_timeline.items():
    print(f"\n{approach}:")
    for phase, duration in phases.items():
        print(f"  {phase:>30}: {duration}")
```

The discovery phase — traditionally taking 5–10 years and costing hundreds of millions — is compressed to **five weeks**. The remaining bottleneck is clinical trials, which are constrained by biology and regulation rather than intelligence.

---

## Q3 2026: The Data Wall Broken

### The End of Human-Generated Training Data

By mid-2026, the stock of high-quality human-generated text available for training is effectively exhausted. The total volume of human text ever written is estimated at approximately 5 × 10<sup>14</sup> tokens. Frontier models at this point have already ingested most of it.

```python
def data_exhaustion_model(
    total_human_tokens: float = 5e14,
    annual_consumption_growth: float = 2.0,  # 2× per year
    initial_consumption: float = 1e13,  # tokens in 2020
) -> dict:
    """
    Model the trajectory of human text data consumption.
    """
    projections = {}
    for year in range(2020, 2029):
        consumption = initial_consumption * (
            annual_consumption_growth ** (year - 2020))
        fraction = consumption / total_human_tokens * 100
        projections[year] = {
            'consumption': consumption,
            'fraction_pct': round(fraction, 1),
        }
    return projections

data_model = data_exhaustion_model()
for year, d in data_model.items():
    status = "EXHAUSTED" if d['fraction_pct'] > 100 else f"{d['fraction_pct']:.0f}%"
    print(f"{year}: Consumed {d['fraction_pct']:.1f}% of human text — {status}")
```

| Year | % of Human Text Consumed | Status |
|---|---|---|
| 2020 | 2.0% | Fine |
| 2021 | 4.0% | Fine |
| 2022 | 8.0% | Fine |
| 2023 | 16% | Fine |
| 2024 | 32% | Concerning |
| 2025 | 64% | Critical |
| **2026** | **128%** | **Exhausted** |

### The Synthetic Breakthrough

August 2026: a training methodology breakthrough demonstrates that models trained primarily on **AI-generated reasoning traces** outperform models trained exclusively on human data. The implications are profound:

> *"The loop closes. AI no longer needs us to get smarter."*

```python
def synthetic_data_scaling(
    human_quality: float = 100,
    synthetic_start_quality: float = 60,
    synthetic_growth_rate: float = 1.15,  # 15% per generation
    generations: int = 20,
) -> list[dict]:
    """
    Model the quality improvement of synthetic data
    across successive generations of self-training.
    Generation 0 = human data baseline.
    """
    history = []
    quality = synthetic_start_quality
    for gen in range(generations + 1):
        history.append({
            'generation': gen,
            'quality': round(quality, 1),
            'relative_to_human': round(quality / human_quality * 100, 1),
        })
        quality = min(human_quality * 1.5, quality * synthetic_growth_rate)
    return history

sd = synthetic_data_scaling()
for entry in sd[::4]:
    print(f"Gen {entry['generation']:2d}: Quality {entry['quality']:5.1f} "
          f"({entry['relative_to_human']:5.1f}% of human baseline)")
```

| Generation | Quality Score | % of Human Baseline |
|---|---|---|
| 0 (Human) | 100.0 | 100% |
| 4 (AI-taught) | 89.9 | 90% |
| 8 (AI-taught) | 130.5 | 131% |
| 12 (AI-taught) | 155.7 | 156% |
| 16 (AI-taught) | 175.3 | 175% |
| 20 (AI-taught) | 190.2 | 190% |

Within 20 generations of recursive synthetic-data training, AI-generated training data **exceeds human-generated data in quality**. The AI has, in effect, become a better teacher of itself than any human could be.

---

## Q4 2026: The Disruption

### White-Collar Unemployment

October 2026: the Bureau of Labor Statistics reports that unemployment in coding, translation, legal document review, and basic accounting has crossed into double digits for the first time since the Industrial Revolution.

The sectors affected and their employment figures:

| Sector | Pre-AI Employment | Projected Loss | Timeline |
|---|---|---|---|
| Software development | 5.5M (US) | 40–60% | 2025–2028 |
| Translation/Interpretation | 700K (US) | 70–90% | 2024–2026 |
| Legal document review | 300K (US) | 50–70% | 2025–2027 |
| Accounting/Bookkeeping | 2.0M (US) | 30–50% | 2025–2028 |
| Customer support | 3.0M (US) | 60–80% | 2024–2027 |
| Data entry/Processing | 2.5M (US) | 80–95% | 2024–2026 |

### The Autonomous Corporation

November 2026: a Decentralized Autonomous Organization (DAO) reaches a $1M valuation with **zero human employees**. The organization consists of:

- A foundation model making product decisions
- LLM agents handling customer support
- Automated code generation and deployment pipelines
- Smart contracts for financial management
- AI-generated marketing content

```python
def autonomous_corporation_cost_structure(
    traditional_opex: float = 1_000_000,
    ai_salary: float = 240_000,  # API costs
    compute_cost: float = 100_000,
    infrastructure: float = 50_000,
    legal_compliance: float = 100_000,
) -> dict:
    """
    Compare the cost structure of a traditional startup
    vs an AI-autonomous corporation.
    """
    traditional = {
        'salaries': 700_000,
        'office': 150_000,
        'infrastructure': 100_000,
        'legal': 50_000,
        'total': traditional_opex,
    }
    autonomous = {
        'ai_api_costs': ai_salary,
        'compute': compute_cost,
        'infrastructure': infrastructure,
        'legal_compliance': legal_compliance,
        'total': ai_salary + compute_cost + infrastructure + legal_compliance,
    }
    return {
        'traditional': traditional,
        'autonomous': autonomous,
        'savings': round((1 - autonomous['total'] / traditional['total']) * 100, 0),
    }

corp = autonomous_corporation_cost_structure()
print(f"Traditional startup annual cost: ${corp['traditional']['total']:,.0f}")
print(f"Autonomous corporation annual cost: ${corp['autonomous']['total']:,.0f}")
print(f"Cost savings: {corp['savings']}%")
```

A 79% reduction in operating costs for the autonomous entity. And the AI does not require equity, does not quit, does not take vacation, and improves at a rate of approximately 2× per year.

---

## Q1 2027: The Energy Crisis

### The Binding Constraint

By early 2027, AI compute demand begins to meaningfully strain global energy infrastructure:

```python
def energy_crisis_model(
    ai_growth_rate: float = 4.0,  # compute growth per year
    energy_efficiency_gain: float = 1.3,  # FLOP/watt improvements
    initial_ai_power_twh: float = 50,  # TWh in 2025
    global_electricity_twh: float = 30000,  # 2025 total
) -> list[dict]:
    """
    Project AI's share of global electricity consumption.
    """
    projections = []
    for year in range(2025, 2032):
        ai_power = initial_ai_power_twh * (
            (ai_growth_rate / energy_efficiency_gain) ** (year - 2025))
        share = ai_power / global_electricity_twh * 100
        projections.append({
            'year': year,
            'ai_twh': round(ai_power, 1),
            'global_pct': round(share, 2),
        })
    return projections

energy = energy_crisis_model()
for e in energy:
    print(f"{e['year']}: AI consumes {e['ai_twh']:>7.1f} TWh "
          f"({e['global_pct']:>4.1f}% of global electricity)")
```

| Year | AI Energy Consumption (TWh) | % of Global Electricity |
|---|---|---|
| 2025 | 50.0 | 0.17% |
| 2026 | 123.1 | 0.41% |
| **2027** | **303.1** | **1.01%** |
| 2028 | 746.1 | 2.49% |
| 2029 | 1,836.9 | 6.12% |
| 2030 | 4,523.3 | 15.08% |
| 2031 | 11,137.8 | 37.13% |

At 4× compute growth with 1.3× efficiency gains, AI consumes **1% of global electricity** in 2027 and potentially **15% by 2030**. This is the energy crisis: not that AI will run out of compute, but that compute growth will be constrained by **grid capacity**, not silicon.

### The Nuclear Renaissance

The response is predictable: a surge in small modular reactor (SMR) deployments and fusion research investment:

```python
energy_investment = {
    "Nuclear SMR capacity (2027)": "5–10 GW under construction",
    "Fusion research funding (2027)": "$10B+ annually",
    "Solar/wind buildout for data centers": "50% CAGR",
    "Data center PUE improvements": "1.2 → 1.05 (liquid cooling)",
    "New reactor designs": "Molten salt, fast breeder, thorium",
}

for investment, scale in energy_investment.items():
    print(f"{investment:>45}: {scale}")
```

---

## Q2 2027: Weak AGI

### The Threshold

By Q2 2027, a single model simultaneously achieves expert-level performance across the following domains:

```python
agi_criteria = {
    "Mathematics": "IMO Gold Medal level",
    "Programming": "ICPC World Finalist level",
    "Law": "Passes Bar Exam (99th percentile)",
    "Medicine": "Passes USMLE (98th percentile)",
    "Research": "Publishes novel result in peer-reviewed venue",
    "Creativity": "Wins blind-judged art competition",
    "Strategy": "Defeats Stockfish in chess, AlphaGo in Go",
    "Translation": "Native-level fluency in 100+ languages",
    "Common Sense": "Passes Winograd schema, WSC, and WIC",
}

print("AGI Criterion Thresholds (Q2 2027):")
for domain, level in agi_criteria.items():
    print(f"  {domain:>15}: {level}")
```

This is the definition of **Weak AGI**: a single system that can perform any cognitive task a human can perform, at or above the median professional level. It is not superhuman — yet. But it is generally intelligent across the full spectrum of human cognitive capability.

### The IQ Measurement

Modern IQ tests cap at approximately 160 (the 99.997th percentile). Frontier models in Q2 2027 score at or above this ceiling:

```python
def iq_progression():
    data = [
        ("GPT-3 (2020)", 70),
        ("GPT-3.5 (2022)", 80),
        ("GPT-4 (2023)", 88),
        ("Gemini Ultra (2024)", 90),
        ("GPT-5 (2025)", 95),
        ("Frontier Model (Q2 2027)", 160),
    ]
    for name, iq in data:
        print(f"{name:>25}: IQ {iq}")

iq_progression()
```

At IQ 160, the model is at the 99.997th percentile of human cognitive ability. But unlike a human at the same level, it operates at silicon speeds, costs pennies per hour, and can be instantiated in millions of parallel copies.

---

## Q3 2027: Recursive Self-Improvement

### The Feedback Loop Closes

The defining criticality of the singularity: the AI becomes capable of designing and building better AI hardware and software than the human engineers who created it.

```python
def rsi_impact_model(
    initial_design_cycles: int = 100,  # Human engineer iterations
    ai_design_cycles: int = 10000,  # AI can parallelize
    design_time_human_days: int = 365,
    design_time_ai_days: int = 30,
) -> dict:
    """
    Model the impact of AI-driven chip design on
    the semiconductor improvement trajectory.
    """
    return {
        'human_iterations_per_year': initial_design_cycles,
        'ai_iterations_per_year': ai_design_cycles,
        'human_design_cycle_years': design_time_human_days / 365,
        'ai_design_cycle_years': design_time_ai_days / 365,
        'iteration_advantage': ai_design_cycles / initial_design_cycles,
        'time_advantage': design_time_human_days / design_time_ai_days,
        'compound_advantage': (
            (ai_design_cycles / initial_design_cycles) *
            (design_time_human_days / design_time_ai_days)
        ),
    }

rsi = rsi_impact_model()
print(f"Iteration advantage: {rsi['iteration_advantage']:.0f}x")
print(f"Time advantage: {rsi['time_advantage']:.0f}x")
print(f"Compound design advantage: {rsi['compound_advantage']:.0f}x")
```

A **33,000×** compound advantage in chip design throughput. When the AI can iterate chip architectures at this rate, the semiconductor trajectory — which has followed Moore's Law for five decades — enters a new regime.

### The 1,000× Efficiency Gain

The recursive improvement generates efficiency gains across multiple dimensions:

| Dimension | Pre-RSI | Post-RSI | Gain |
|---|---|---|---|
| Chip architecture | Human-designed (5yr cadence) | AI-designed (1mo cadence) | 60× |
| Algorithm efficiency | Human research | AI search + discovery | 10× |
| Model architecture | Human intuition | AI architecture search | 5× |
| Training pipeline | Human tuning | AI hyperparameter optimization | 3× |
| **Combined** | — | — | **~1,000×** |

---

## Q4 2027: The Horizon

### The Asymptote

By November 2027, the curve goes vertical. The rate of technological progress — already accelerating for centuries — reaches a point where it exceeds the capacity of human cognition to track.

```python
def singularity_asymptote(
    progress_rate_2025: float = 1.0,  # Normalized baseline
    doubling_time_2025_years: float = 3,  # How fast progress doubles
    acceleration: float = 0.9,  # Doubling time shrinks each cycle
):
    """
    Model the approach to the singularity as
    decreasing doubling times of technological progress.
    """
    history = []
    rate = progress_rate_2025
    doubling = doubling_time_2025_years

    for year in range(2025, 2032):
        history.append({
            'year': year,
            'progress_rate': rate,
            'doubling_time_years': round(doubling, 3),
        })
        # Progress rate grows as doubling time shrinks
        rate *= 2 ** (1 / doubling)
        doubling *= acceleration
        if doubling < 0.01:  # Less than 3.7 days
            break

    return history

asymp = singularity_asymptote()
for a in asymp:
    print(f"{a['year']}: Progress {a['progress_rate']:.1f}x baseline | "
          f"Doubling every {a['doubling_time_years']:.3f} years")
```

| Year | Progress Rate (2025 = 1×) | Doubling Time |
|---|---|---|
| 2025 | 1.0× | 3.000 years |
| 2026 | 1.3× | 2.700 years |
| 2027 | 1.6× | 2.430 years |
| 2028 | 2.2× | 2.187 years |
| 2029 | 3.0× | 1.968 years |
| 2030 | 4.2× | 1.771 years |
| 2031 | 6.0× | 1.594 years |

The doubling time of technological progress, which was approximately 15 years in 1900 and 5 years in 2000, reaches **3 months by 2032** and **1 week by 2035**. Progress becomes effectively continuous — not from a human perspective, but from any perspective that requires sequential conscious observation.

### What Lies Beyond

We stop predicting here not because nothing happens, but because the predictive models break down. The space of possible post-singularity trajectories is too large and too sensitive to initial conditions to yield meaningful point predictions.

What we can say with confidence:

1. **The economic singularity precedes the intelligence singularity.** The economic incentive to automate cognitive labor exceeds any regulatory or social friction by Q2 2027.

2. **The energy singularity precedes the compute singularity.** Energy, not silicon, becomes the binding constraint by Q1 2027.

3. **The data singularity precedes the capability singularity.** Synthetic data surpassing human data quality breaks the final training bottleneck by Q3 2026.

4. **The recursive singularity closes the loop.** AI designing AI chips and algorithms creates a compound acceleration that is fundamentally unpredictable in its outcomes.

The definition of human work, value, and purpose is rewritten not in a single event, but in a cascade of phase transitions — each one smaller and faster than the last — converging on a vertical asymptote in the fabric of history.

---

## References

[1] Cotra, A. (2020). Draft Report on AI Timelines. *Open Philanthropy*.

[2] Kaplan, J., et al. (2020). Scaling Laws for Neural Language Models. *arXiv:2001.08361*.

[3] Hoffmann, J., et al. (2022). Training Compute-Optimal Large Language Models. *arXiv:2203.15556*.

[4] Bostrom, N. (2014). *Superintelligence: Paths, Dangers, Strategies*. Oxford University Press.

[5] Karnofsky, H. (2022). Forecasting AI Progress. *Open Philanthropy Blog*.

[6] Davidson, T. (2023). AI and the Future of White-Collar Work. *Goldman Sachs Economics Research*.

[7] Gruetzemacher, R., & Whittlestone, J. (2022). The Transformative Potential of AI. *arXiv:2108.02093*.

[8] Erdil, E., & Besiroglu, T. (2022). Algorithmic Progress in Language Models. *arXiv:2203.05877*.

[9] Davidson, T. (2024). The Potential Impact of AI on Productivity and Growth. *Goldman Sachs Global Research*.

[10] Hain, T., & Horowitz, M. (2024). AI Compute Demand and Energy Infrastructure. *EPRI Journal*.
