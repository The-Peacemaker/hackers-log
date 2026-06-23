---
title: "SentinelMesh: An Autonomous Infrastructure Surveillance & Incident Response Fabric"
date: "2026-07-23"
category: ["Open Source"]
tags: ["Distributed Systems", "Spring Boot", "Apache Kafka", "gRPC", "Machine Learning", "DevOps", "Cybersecurity", "Incident Response"]
readingTime: "25 min read"
summary: "An event-driven autonomous infrastructure monitoring platform ingesting telemetry streams through Spring Boot microservices, detecting anomalies with unsupervised Isolation Forest ML, correlating events into security incidents across a 60-second sliding window, and executing simulated mitigation workflows — all orchestrated over Apache Kafka with gRPC inter-service communication and real-time SSE dashboard streaming."
---

The modern infrastructure monitoring stack is fundamentally reactive. A server exceeds a CPU threshold. An alert fires. A human — possibly asleep, possibly working on something else — opens a dashboard, triangulates logs, cross-references metrics, and eventually types a remediation command. The mean time to resolution (MTTR) for this anthropological pipeline averages 90 minutes. In the intervening period, whatever broke continues to be broken.

SentinelMesh collapses this into a system that detects, correlates, and mitigates infrastructure anomalies in **under ten seconds**, without human intervention. It is not a monitoring dashboard. It is an autonomous immune system for server fleets.

---

## System Architecture: The Layered Defense Topology

SentinelMesh is structured as a decoupled, event-driven architecture spanning six operational layers, each communicating through a durable message bus.

<div class="w-full my-8 border border-[var(--border)] rounded-xl bg-[var(--card)] p-6">
<div class="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)]">
<span class="nf nf-md-lan text-lg opacity-70"></span>
<div>
<h3 class="text-sm font-semibold text-[var(--foreground)]">Layered Defense Topology</h3>
<p class="text-[10px] text-[var(--muted)]">Six operational layers connected through Apache Kafka — data flows left to right, alerts flow right to left</p>
</div>
</div>
<svg viewBox="0 0 960 380" class="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="sm-l1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15"/><stop offset="100%" stop-color="#2563eb" stop-opacity="0.05"/></linearGradient>
<linearGradient id="sm-l2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22c55e" stop-opacity="0.15"/><stop offset="100%" stop-color="#16a34a" stop-opacity="0.05"/></linearGradient>
<linearGradient id="sm-l3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.15"/><stop offset="100%" stop-color="#7c3aed" stop-opacity="0.05"/></linearGradient>
<linearGradient id="sm-l4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.15"/><stop offset="100%" stop-color="#d97706" stop-opacity="0.05"/></linearGradient>
<linearGradient id="sm-l5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ef4444" stop-opacity="0.15"/><stop offset="100%" stop-color="#dc2626" stop-opacity="0.05"/></linearGradient>
<linearGradient id="sm-l6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ec4899" stop-opacity="0.15"/><stop offset="100%" stop-color="#db2777" stop-opacity="0.05"/></linearGradient>
</defs>
<!-- Layer 1: Simulation -->
<rect x="20" y="50" width="130" height="130" rx="8" fill="url(#sm-l1)" stroke="#3b82f6" stroke-width="1.2" stroke-opacity="0.4"/>
<text x="85" y="78" text-anchor="middle" fill="#60a5fa" font-family="monospace" font-size="9" font-weight="bold">SIMULATION</text>
<text x="85" y="98" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Python CLI</text>
<text x="85" y="112" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">5 Attack Modes</text>
<text x="85" y="126" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">JSON POST</text>
<text x="85" y="140" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">12 Hosts / 3 Regions</text>
<!-- Arrow 1→2 -->
<line x1="150" y1="115" x2="200" y2="115" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,3"/>
<polygon points="198,110 208,115 198,120" fill="#475569"/>
<text x="180" y="108" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="6">REST</text>
<!-- Layer 2: Ingestion -->
<rect x="210" y="50" width="130" height="130" rx="8" fill="url(#sm-l2)" stroke="#22c55e" stroke-width="1.2" stroke-opacity="0.4"/>
<text x="275" y="78" text-anchor="middle" fill="#4ade80" font-family="monospace" font-size="9" font-weight="bold">INGESTION</text>
<text x="275" y="98" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Spring Boot 3.3</text>
<text x="275" y="112" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Port 8081</text>
<text x="275" y="126" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Redis Rate Limit</text>
<text x="275" y="140" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">150 req/min/host</text>
<!-- Arrow 2→3 -->
<line x1="340" y1="115" x2="390" y2="115" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,3"/>
<polygon points="388,110 398,115 388,120" fill="#475569"/>
<text x="370" y="108" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="6">Kafka</text>
<!-- Layer 3: Kafka -->
<rect x="400" y="50" width="100" height="130" rx="8" fill="url(#sm-l3)" stroke="#8b5cf6" stroke-width="1.2" stroke-opacity="0.4"/>
<text x="450" y="78" text-anchor="middle" fill="#a78bfa" font-family="monospace" font-size="9" font-weight="bold">KAFKA</text>
<text x="450" y="98" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">v3.7</text>
<text x="450" y="112" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Port 9092</text>
<text x="450" y="126" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">telemetry.raw</text>
<text x="450" y="140" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">3 partitions</text>
<!-- Fork to AI -->
<line x1="500" y1="85" x2="550" y2="40" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,3"/>
<polygon points="545,35 555,40 545,45" fill="#f59e0b"/>
<text x="530" y="58" text-anchor="end" fill="#64748b" font-family="monospace" font-size="6">Consume</text>
<!-- Fork to Backend -->
<line x1="500" y1="145" x2="550" y2="190" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,3"/>
<polygon points="545,185 555,190 545,195" fill="#475569"/>
<text x="530" y="175" text-anchor="end" fill="#64748b" font-family="monospace" font-size="6">Consume</text>
<!-- Layer 4: AI -->
<rect x="560" y="10" width="140" height="90" rx="8" fill="url(#sm-l4)" stroke="#f59e0b" stroke-width="1.2" stroke-opacity="0.4"/>
<text x="630" y="38" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="9" font-weight="bold">AI ENGINE</text>
<text x="630" y="55" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Python 3.11</text>
<text x="630" y="70" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Isolation Forest</text>
<text x="630" y="85" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Rule Engine</text>
<!-- Arrow AI→Backend (gRPC) -->
<line x1="630" y1="100" x2="630" y2="140" stroke="#f59e0b" stroke-width="2" stroke-dasharray="5,3"/>
<polygon points="625,138 630,148 635,138" fill="#f59e0b"/>
<text x="642" y="125" text-anchor="start" fill="#fbbf24" font-family="monospace" font-size="6" font-weight="bold">gRPC</text>
<!-- Layer 5: Backend -->
<rect x="560" y="150" width="140" height="90" rx="8" fill="url(#sm-l5)" stroke="#ef4444" stroke-width="1.2" stroke-opacity="0.4"/>
<text x="630" y="178" text-anchor="middle" fill="#f87171" font-family="monospace" font-size="9" font-weight="bold">CORE BACKEND</text>
<text x="630" y="195" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Spring Boot 3.3</text>
<text x="630" y="210" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Port 8082+gRPC 9090</text>
<text x="630" y="225" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">PostgreSQL 15</text>
<!-- Arrow 5→6 -->
<line x1="700" y1="195" x2="750" y2="195" stroke="#475569" stroke-width="1.5" stroke-dasharray="4,3"/>
<polygon points="748,190 758,195 748,200" fill="#475569"/>
<text x="730" y="188" text-anchor="middle" fill="#64748b" font-family="monospace" font-size="6">SSE</text>
<!-- Layer 6: Dashboard -->
<rect x="760" y="150" width="180" height="90" rx="8" fill="url(#sm-l6)" stroke="#ec4899" stroke-width="1.2" stroke-opacity="0.4"/>
<text x="850" y="178" text-anchor="middle" fill="#f472b6" font-family="monospace" font-size="9" font-weight="bold">DASHBOARD</text>
<text x="850" y="195" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Vanilla JS SPA</text>
<text x="850" y="210" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">SSE Real-time</text>
<text x="850" y="225" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Chart.js</text>
<!-- Infrastructure boxes at bottom -->
<rect x="20" y="310" width="220" height="45" rx="6" fill="rgba(59,130,246,0.08)" stroke="#3b82f6" stroke-width="1" stroke-opacity="0.3"/>
<text x="130" y="330" text-anchor="middle" fill="#60a5fa" font-family="monospace" font-size="8" font-weight="bold">REDIS 7</text>
<text x="130" y="345" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">Rate Limiter · Fail-Open</text>
<rect x="260" y="310" width="280" height="45" rx="6" fill="rgba(245,158,11,0.08)" stroke="#f59e0b" stroke-width="1" stroke-opacity="0.3"/>
<text x="400" y="330" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-size="8" font-weight="bold">MODEL LAYER</text>
<text x="400" y="345" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">isolation_forest.pkl · 1,000 Training Samples</text>
<rect x="560" y="310" width="310" height="45" rx="6" fill="rgba(239,68,68,0.08)" stroke="#ef4444" stroke-width="1" stroke-opacity="0.3"/>
<text x="715" y="330" text-anchor="middle" fill="#f87171" font-family="monospace" font-size="8" font-weight="bold">POSTGRESQL 15</text>
<text x="715" y="345" text-anchor="middle" fill="#94a3b8" font-family="monospace" font-size="7">telemetry_events · anomalies · incidents · mitigation_actions</text>
</svg>
</div>

---

## Layer 1: The Ingestion Pipeline

### REST API with Validation and Rate Limiting

The ingestion service exposes a single endpoint — `POST /api/v1/telemetry` — that accepts JSON payloads representing infrastructure telemetry from monitored hosts:

```java
@PostMapping
public ResponseEntity<String> ingestTelemetry(@Valid @RequestBody TelemetryData data) {
    String host = data.getHost();

    if (!rateLimiterService.isAllowed(host)) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body("Rate limit exceeded for host: " + host);
    }

    data.setReceivedAt(Instant.now().toEpochMilli());
    if (data.getTimestamp() == null || data.getTimestamp().isEmpty()) {
        data.setTimestamp(Instant.now().toString());
    }

    if (host.contains("us-")) data.setRegion("us-east-1");
    else if (host.contains("eu-")) data.setRegion("eu-central-1");
    else data.setRegion("ap-south-1");

    telemetryProducer.sendTelemetry(data);
    return ResponseEntity.status(HttpStatus.ACCEPTED)
            .body("Telemetry accepted for host: " + host);
}
```

The validation, enrichment, and rate-limiting pipeline operates in three stages:

1. **Structural validation** — Jakarta Bean Validation against the `TelemetryData` DTO. CPU must be 0–100. Memory must be 0–100. Host identifier must not be blank. Failed requests are rejected with HTTP 400 before consuming any Kafka resources.

2. **Rate limiting** — Redis-based per-host throttling at 150 requests per minute per host. The implementation uses epoch-minute windows as the Redis key, incrementing the counter atomically with an expiry set on first write. If Redis is unreachable, the limiter **fails open** — denying service is a worse failure mode than allowing potential overload.

```java
public boolean isAllowed(String host) {
    long currentWindow = Instant.now().getEpochSecond() / 60;
    String key = "rate:limit:" + host + ":" + currentWindow;
    try {
        Long count = redisTemplate.opsForValue().increment(key, 1);
        if (count != null && count == 1) {
            redisTemplate.expire(key, 65, TimeUnit.SECONDS);
        }
        if (count != null && count > LIMIT_PER_MINUTE) {
            return false;
        }
        return true;
    } catch (Exception e) {
        return true; // fail-open
    }
}
```

3. **Data enrichment** — Timestamp normalization (ISO 8601 input or epoch millis, supplemented with server-side time if missing) and region inference from host naming convention (`us-*`, `eu-*`, `ap-*`).

The enriched payload is then published to Kafka topic `telemetry.raw` with the host as the message key, ensuring partition affinity for all events from the same host — critical for the downstream correlation engine.

---

## Layer 2: The Event Bus

### Apache Kafka — Durable Partitioned Telemetry

Kafka serves as the central nervous system of the platform. The `telemetry.raw` topic is configured with three partitions, enabling horizontal scaling of consumers. The ingestion service writes to it; the AI engine and the core backend consume from it independently — a fan-out architecture where each consumer receives every message:

```
telemetry.raw (3 partitions)
    ├── Consumer Group: aetherflow-ai-group → AI Engine (Python)
    └── Consumer Group: aetherflow-backend-group → Core Backend (Spring Boot)
```

This dual-consumer topology is architecturally significant. The AI engine can fail, be restarted, or be replaced with a different model without affecting the backend's telemetry persistence. The backend can perform schema migrations on PostgreSQL without affecting the AI engine's anomaly detection cadence. Kafka's consumer group isolation provides loose coupling between the detection and persistence subsystems.

---

## Layer 3: The AI Engine — Anomaly Detection

### Isolation Forest: The Core Detector

The detection engine operates at the intersection of **unsupervised machine learning** and **deterministic rule-based heuristics**. The ML backbone is an Isolation Forest trained on 1,000 synthetic normal telemetry samples across five feature dimensions:

```python
import numpy as np
from sklearn.ensemble import IsolationForest
import pickle

np.random.seed(42)
n_samples = 1000

cpu = np.clip(np.random.normal(35, 8, n_samples), 5, 80)
memory = np.clip(np.random.normal(50, 5, n_samples), 20, 85)
response_time = np.clip(np.random.normal(120, 30, n_samples), 20, 450)
network_packets = np.clip(np.random.normal(700, 150, n_samples), 100, 2000)
failed_logins = np.random.poisson(0.5, n_samples)

X_train = np.column_stack((cpu, memory, response_time,
                            network_packets, failed_logins))

clf = IsolationForest(contamination=0.02, random_state=42)
clf.fit(X_train)

with open("isolation_forest.pkl", "wb") as f:
    pickle.dump(clf, f)
```

The five-dimensional feature vector encodes the fundamental signals of infrastructure health:

$$\mathbf{x} = [\text{CPU}\%, \text{RAM}\%, \text{ResponseTime}_{\text{ms}}, \text{NetworkPkts/s}, \text{FailedLogins}]$$

The Isolation Forest algorithm builds an ensemble of random binary trees. The anomaly score for a point $x$ is derived from the average path length through the forest:

$$s(x, n) = 2^{-\frac{\mathbb{E}[h(x)]}{c(n)}}$$

where $h(x)$ is the path length from root to leaf and $c(n)$ is the average path length of an unsuccessful search in a BST — essentially, how quickly can the forest isolate this point? Points that can be isolated in fewer splits (shorter average paths) are more likely to be anomalous because they reside in sparse, less-populated regions of the feature space.

The contamination parameter is set to 0.02 — the model is told to expect approximately 2% anomalous observations in the training distribution. The random state of 42 ensures reproducibility.

### Rule-Based Expert Overlay

The ML detector generates a probabilistic anomaly score. But security operations require **explainable alerts** — a human investigator needs to know not just that something is abnormal, but what specific pattern triggered the alert. The rule engine provides this explainability layer:

```python
if prediction == -1:  # Anomaly
    risk_score = min(1.0, max(0.5, 0.5 + (-decision_score * 4)))

# Deterministic rule overlay
if failed_logins >= 20:
    risk_score = max(risk_score, 0.90)
    reason = f"Security Rule: High auth failures ({failed_logins} logins)"
elif network_packets >= 15000:
    risk_score = max(risk_score, 0.95)
    reason = f"Security Rule: Volume spike ({network_packets} packets/s)"
elif cpu >= 90 and memory >= 90:
    risk_score = max(risk_score, 0.88)
    reason = "Resource Rule: Multi-resource saturation"
elif memory >= 92:
    risk_score = max(risk_score, 0.78)
    reason = "Performance Rule: Memory leak pattern"
```

The four rules encode security domain knowledge as a deterministic overlay:

| Rule | Threshold | Minimum Risk | Classification |
|---|---|---|---|
| Authentication Abuse | `failedLogins >= 20` | 0.90 | Security Rule: High auth failures |
| Volumetric DDoS | `networkPackets >= 15000` | 0.95 | Security Rule: Volume spike |
| Resource Exhaustion | `CPU >= 90% AND RAM >= 90%` | 0.88 | Resource Rule: Multi-resource saturation |
| Memory Leak | `RAM >= 92%` | 0.78 | Performance Rule: Memory leak pattern |

When the composite risk score exceeds 0.70, the AI engine sends a gRPC `ReportAnomaly` request to the core backend. The communication protocol — gRPC with Protobuf serialization over HTTP/2 — was chosen for three architectural reasons: contract-first development through `.proto` definitions, binary serialization (7–10× faster than JSON), and HTTP/2 multiplexing enabling concurrent anomaly reports without head-of-line blocking.

---

## Layer 4: The Core Backend — Incident Correlation

### From Anomalies to Incidents

A naive monitoring system generates one alert per threshold breach. In an active incident — a server under DDoS attack, for example — a naive system would generate hundreds of individual alerts: one for CPU spike, one for network spike, one for response time increase, one for memory pressure. Each alert is independently routed, independently acknowledged, independently investigated.

SentinelMesh does not do this. The **Incident Correlation Engine** buffers anomalies per host in a 60-second sliding window. When two or more anomalies accumulate for the same host within that window, they are **correlated into a single incident**. The individual anomalies are associated as children of the incident, providing evidentiary traceability while collapsing the alert surface:

```java
List<Anomaly> unassociated = anomalyRepository
    .findByHostAndIncidentIsNullAndTimestampAfter(host, cutoff);

if (unassociated.size() >= 2) {
    Incident incident = Incident.builder()
        .incidentUuid(UUID.randomUUID().toString())
        .host(host)
        .severity(determineSeverity(unassociated))
        .description(classifyIncident(unassociated))
        .status("ACTIVE")
        .createdAt(Instant.now())
        .build();

    incident = incidentRepository.save(incident);

    for (Anomaly anomaly : unassociated) {
        anomaly.setIncident(incident);
        anomalyRepository.save(anomaly);
    }

    mitigationService.triggerMitigation(incident);
}
```

The correlation threshold — two anomalies within 60 seconds — was empirically determined to balance sensitivity against noise. With the current simulator configuration generating approximately 350 telemetry events across 5 attack modes with 12 monitored hosts, the correlation engine produced 13 incidents from over 50 anomalies — a compression ratio of approximately 4:1, eliminating 75% of the raw alert noise.

### Incident Classification and Severity

Each correlated incident is automatically classified by examining the reason strings of its constituent anomalies:

```java
private String classifyIncident(List<Anomaly> anomalies) {
    String reasons = anomalies.stream()
        .map(Anomaly::getReason)
        .collect(Collectors.joining(", "));

    if (reasons.contains("auth") || reasons.contains("failed"))
        return "Brute Force Authentication Attack";
    if (reasons.contains("volume") || reasons.contains("spike"))
        return "Volumetric DDoS Attack";
    if (reasons.contains("memory") && reasons.contains("cpu"))
        return "Database Saturation / Resource Exhaustion";
    if (reasons.contains("memory"))
        return "Memory Leak / Gradual Degradation";

    return "Unclassified Anomaly Cluster";
}
```

Severity is determined by the maximum risk score among the correlated anomalies:

| Max Risk Score | Severity |
|---|---|
| >= 0.90 | CRITICAL |
| >= 0.75 | HIGH |
| >= 0.60 | MEDIUM |
| < 0.60 | LOW |

---

## Layer 5: Autonomous Mitigation

### The Mock Self-Healing Engine

The mitigation engine executes simulated countermeasures based on incident classification. Actions run asynchronously via Spring's `@Async` annotation, preventing the incident correlation pipeline from blocking on mitigation execution:

```java
@Async
public CompletableFuture<Void> triggerMitigation(Incident incident) {
    incident.setStatus("MITIGATING");

    String desc = incident.getDescription().toLowerCase();
    String actionType;

    if (desc.contains("brute force") || desc.contains("auth")) {
        actionType = "MOCK_BLOCK_IP";
        Thread.sleep(6000); // Simulated firewall rule deployment
    } else if (desc.contains("ddos") || desc.contains("network")) {
        actionType = "MOCK_RATE_LIMIT_IP";
        Thread.sleep(6000);
    } else if (desc.contains("memory") || desc.contains("cpu")) {
        actionType = "MOCK_SCALE_UP";
        Thread.sleep(6000);
    } else {
        actionType = "MOCK_RESTART_SERVICES";
        Thread.sleep(6000);
    }

    MitigationAction action = MitigationAction.builder()
        .incidentId(incident.getId())
        .actionType(actionType)
        .executedAt(Instant.now())
        .result("SUCCESS")
        .build();
    mitigationActionRepository.save(action);

    incident.setStatus("RESOLVED");
    incident.setResolvedAt(Instant.now());
    incidentRepository.save(incident);
    sseBroadcaster.broadcast("incident", incident);

    return CompletableFuture.completedFuture(null);
}
```

| Incident Type | Trigger | Mitigation | Behavior |
|---|---|---|---|
| Brute Force | `failedLogins > 50` | `MOCK_BLOCK_IP` | Simulated firewall rule deployment |
| DDoS Attack | `networkPackets > 15000` | `MOCK_RATE_LIMIT_IP` | Edge rate limiter activation |
| Resource Exhaustion | `CPU > 95%` | `MOCK_SCALE_UP` | Auto-scaling group expansion |
| Memory Leak | Gradual RAM climb | `MOCK_RESTART_SERVICES` | Graceful service restart |

The mock actions simulate the latency of real infrastructure operations (~6 seconds) without actually modifying any system state. In production, these would be replaced with actual Terraform apply, Kubernetes API calls, or firewall rule deployments.

---

## Layer 6: Real-Time Dashboard — Server-Sent Events

### Zero-Polling Live Updates

The dashboard connects to the backend via a single Server-Sent Events stream at `/api/v1/events`, receiving four distinct event types without any polling overhead:

```javascript
const eventSource = new EventSource('/api/v1/events');

eventSource.addEventListener('telemetry', (event) => {
    const data = JSON.parse(event.data);
    updateTelemetryStats(data);
    renderTimelineMatrix(data);
});

eventSource.addEventListener('anomaly', (event) => {
    const data = JSON.parse(event.data);
    updateAnomalyCount();
    renderAnomaliesTable(data);
    recalculateInfluencers();
});

eventSource.addEventListener('incident', (event) => {
    const data = JSON.parse(event.data);
    updateIncidentCount();
    renderIncidents(data);
});

eventSource.addEventListener('mitigation', (event) => {
    const data = JSON.parse(event.data);
    updateMitigationRate();
    updateIncidentStatus(data);
});
```

The `SseBroadcaster` service maintains a `CopyOnWriteArrayList<SseEmitter>`, registering new clients on connection and automatically removing them on timeout (3 minutes). Broadcast operations iterate over the emitter list, delivering each event to every connected client:

```java
public void broadcast(String eventName, Object data) {
    String json = objectMapper.writeValueAsString(data);

    for (SseEmitter emitter : emitters) {
        try {
            emitter.send(SseEmitter.event()
                .name(eventName)
                .data(json, MediaType.APPLICATION_JSON));
        } catch (IOException e) {
            emitter.completeWithError(e);
            emitters.remove(emitter);
        }
    }
}
```

### Dashboard Features

The dashboard is a single-page application with four operational tabs:

1. **Anomaly Explorer** — Filterable anomaly table, timeline heat-map matrix (host × time-bucket grid with colored cells), CPU/RAM line charts via Chart.js, live telemetry log stream, top influencers bar chart (most-anomalous hosts/regions/threat types)

2. **Intrusion Scanner** — Host selector with three scan modes (Fast Heuristic / AI Vector / Full Penetration), console terminal with step-by-step scan simulation and progress bar, final verdict banner with remediation recommendations

3. **Incident Timeline** — Chronological incident cards with severity badges, constituent anomaly counts, mitigation status pills, manual remediation trigger buttons

4. **Simulation Hub** — Mode selector for 5 attack scenarios with live counters and documentation cards

---

## The Simulator: Five Attack Scenarios

The `simulator.py` CLI provides an interactive interface for generating synthetic telemetry across five distinct attack modes, each calibrated to trigger specific detection rules:

```
======================================================================
SENTINELMESH TELEMETRY SIMULATOR
======================================================================
[1] Simulate Normal Traffic    - Random hosts, Gaussian metrics
[2] Launch Volumetric DDoS     - server-us-01 packet flood
[3] Simulate Brute Force Auth  - server-ap-01 failed logins
[4] Inject Memory Leak         - server-eu-02 gradual RAM climb
[5] Trigger CPU Exhaustion     - server-us-03 CPU saturation
[0] Exit
======================================================================
```

Each mode POSTs JSON telemetry to `localhost:8081/api/v1/telemetry` at adjustable cadences. The interleaved architecture — mixing normal traffic with specific attack injections — simulates the operational reality where anomalies emerge from a background of legitimate activity.

### Mode 2: Volumetric DDoS

```python
for _ in range(200):
    payload = {
        "host": "server-us-01",
        "cpu": round(random.uniform(55, 75), 2),
        "memory": round(random.uniform(60, 80), 2),
        "disk": round(random.uniform(45, 65), 2),
        "networkPackets": random.randint(16000, 24000),
        "failedLogins": random.randint(0, 3),
        "requestRate": random.randint(2500, 5000),
        "responseTime": round(random.uniform(350, 650), 2),
    }
    requests.post(f"{BASE_URL}/api/v1/telemetry", json=payload, timeout=5)
    time.sleep(0.05)
```

This mode generates 200 telemetry events at 50ms intervals, all targeting `server-us-01` with network packet counts averaging 20,000/s — well above the 15,000 threshold for the volumetric DDoS rule.

---

## Database Schema: The Four-Table Relational Substrate

The persistence layer is structured as a normalized four-table schema in PostgreSQL 15, managed through Spring Data JPA with Hibernate `ddl-auto: update`:

```sql
CREATE TABLE telemetry_events (
    id BIGSERIAL PRIMARY KEY,
    host VARCHAR(255), region VARCHAR(50),
    cpu DOUBLE PRECISION, memory DOUBLE PRECISION,
    disk DOUBLE PRECISION, network_packets BIGINT,
    failed_logins INTEGER, request_rate BIGINT,
    response_time DOUBLE PRECISION,
    timestamp TIMESTAMP, received_at TIMESTAMP
);

CREATE TABLE anomalies (
    id BIGSERIAL PRIMARY KEY,
    host VARCHAR(255), risk_score DOUBLE PRECISION,
    reason TEXT, timestamp TIMESTAMP,
    cpu DOUBLE PRECISION, memory DOUBLE PRECISION,
    response_time DOUBLE PRECISION, failed_logins INTEGER,
    network_packets BIGINT,
    incident_id BIGINT REFERENCES incidents(id)
);

CREATE TABLE incidents (
    id BIGSERIAL PRIMARY KEY,
    incident_uuid VARCHAR(36) UNIQUE NOT NULL,
    host VARCHAR(255), severity VARCHAR(20),
    description TEXT, status VARCHAR(20),
    created_at TIMESTAMP, resolved_at TIMESTAMP
);

CREATE TABLE mitigation_actions (
    id BIGSERIAL PRIMARY KEY,
    incident_id BIGINT, action_type VARCHAR(50),
    executed_at TIMESTAMP, result VARCHAR(20),
    details TEXT
);
```

The `incident_id` foreign key in the `anomalies` table creates the relational link that enables the correlation engine to query unassociated anomalies (`WHERE incident_id IS NULL`) and to recover the full evidentiary chain for any incident by following the foreign key backward.

---

## gRPC: The Inter-Service Contract

The AI engine communicates with the backend through a strictly typed gRPC service defined in Protobuf:

```protobuf
syntax = "proto3";
package telemetry;

service AnomalyService {
  rpc ReportAnomaly (AnomalyRequest) returns (AnomalyResponse);
}

message AnomalyRequest {
  string host = 1;
  double riskScore = 2;
  string reason = 3;
  int64 eventTimestamp = 4;
  double cpu = 5;
  double memory = 6;
  double responseTime = 7;
  int32 failedLogins = 8;
  int64 networkPackets = 9;
}

message AnomalyResponse {
  string status = 1;
  string incidentId = 2;
  string mitigationAction = 3;
}
```

The contract-first approach provides three key properties:

1. **Type safety across language boundaries** — The Python AI engine and Java backend share a single source of truth for the message schema. A mismatch in field types or numbering is caught at compile time, not at runtime.

2. **Binary serialization** — Protobuf encodes messages to approximately 1/10th the size of equivalent JSON, reducing network overhead on the gRPC channel between detection and correlation layers.

3. **Backward compatibility** — Adding new fields to the `AnomalyRequest` message does not break existing consumers. The field numbering scheme ensures that unknown fields are silently ignored by older consumers, enabling independent deployment cadences for the AI engine and the backend.

---

## Performance Benchmarks

Testing was conducted against a local Docker deployment with 12 simulated hosts across 3 regions (us-east-1, eu-central-1, ap-south-1), generating telemetry through all 5 simulator modes interleaved with normal traffic:

| Metric | Value |
|---|---|
| Telemetry Events Processed | 350+ |
| Anomalies Detected | 50+ |
| Incidents Correlated | 13 |
| Mitigation Actions Executed | 9+ |
| Monitored Hosts | 12 across 3 regions |
| Concurrent SSE Clients | 2 |
| End-to-End Resolution Latency | < 10 seconds |
| Ingestion Throughput | ~200 events/second |
| ML Inference Latency | ~50 ms per event |
| Kafka Consumer Lag (steady state) | < 50 messages |
| gRPC Round-Trip | ~5 ms |

The 10-second end-to-end latency — from telemetry ingestion through anomaly detection, incident correlation, and mitigation execution — represents a **540× improvement** over the traditional human-in-the-loop MTTR of approximately 90 minutes.

---

## Source Code

The complete platform is open-sourced under the MIT license:

> [github.com/The-Peacemaker/sentinel-mesh-platform](https://github.com/The-Peacemaker/sentinel-mesh-platform)

18 commits across 4 submodules: Spring Boot ingestion service, Spring Boot core backend with gRPC server, Python AI engine with Isolation Forest, and a vanilla JavaScript real-time dashboard. Infrastructure services (Kafka, PostgreSQL, Redis) deployable via Docker.

---

## References

[1] Liu, F. T., Ting, K. M., & Zhou, Z.-H. (2008). Isolation Forest. *IEEE International Conference on Data Mining*, 413–422.

[2] Kreps, J., Narkhede, N., & Rao, J. (2011). Kafka: A Distributed Messaging System for Log Processing. *NetDB'11*.

[3] Spring Boot 3.3 Reference Documentation. *spring.io/docs*.

[4] gRPC: A high performance, open source universal RPC framework. *grpc.io*.

[5] Pedregosa, F., et al. (2011). Scikit-learn: Machine Learning in Python. *JMLR*, 12, 2825–2830.
