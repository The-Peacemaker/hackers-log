---
title: "How I Built GreenDrive"
date: "2026-07-21"
category: "Open Source"
tags: ["GreenTech", "Routing Algorithms", "AI", "TypeScript"]
readingTime: "8 min read"
summary: "Designing a fuel-optimal vehicle navigation engine that balances travel time with energy efficiency using elevations, traffic dynamics, and edge machine learning."
---

Most routing engines (like Google Maps or OSRM) optimize for a single variable: **time**. Sometimes they offer a minor eco-friendly alternative, but these are often afterthoughts built on top of pre-computed speed tables.

With **GreenDrive**, I wanted to design a routing engine from the ground up that prioritizes **minimum fuel consumption** (or energy efficiency for EVs) as its primary heuristic, without making the commute excessively long.

## The Physics of Fuel Economy

To calculate energy efficiency, you cannot just look at distance and speed. You have to look at the physics of a moving vehicle:

1. **Kinetic Energy Loss:** Accelerating a 1,500kg vehicle from a dead stop to 50 km/h consumes significant energy. Frequent stops (stoplights, stop signs) are the primary enemy of fuel efficiency.
2. **Potential Energy Changes:** Driving up a 5% grade requires substantial work against gravity. While regenerative braking recovers some energy in EVs, it is only about 60-70% efficient.
3. **Aerodynamic Drag:** Drag scales quadratically with speed ($F_d \propto v^2$). Cruising at 120 km/h consumes disproportionately more fuel per kilometer than cruising at 90 km/h.

## The Green Routing Heuristic

We modeled the cost function of edge $e$ in our routing graph as:

$$Cost(e) = w_t \cdot Time(e) + w_f \cdot Fuel(e)$$

Where $Fuel(e)$ is calculated using a physical model that takes elevation profile, estimated traffic speed, and intersection delay into account. 

Instead of standard Dijkstra, which becomes slow with complex cost functions, we implemented a custom **A* Search** using a custom coordinate-based bounding-box heuristic that estimates the lower bound of energy required to travel from any coordinate to the destination.

:::insight
By utilizing elevation data from the shuttle radar topography mission (SRTM) and pre-compiling grades into our road network, GreenDrive reduces calculated fuel consumption by up to 14% in hilly metropolitan areas with only a 3% average increase in travel time.
:::

## Architecture Overview

The system is split into three main parts:
* **The Ingestion Pipeline:** Written in Rust, it parses OpenStreetMap (OSM) `.pbf` files, cross-references nodes with elevation data, and outputs a highly optimized graph structure.
* **The Routing Engine:** A TypeScript server that loads the graph into memory and exposes a clean JSON routing API.
* **The Web Client:** A minimal, dark-themed dashboard mapping the route comparison using Mapbox GL.

## Looking Forward

The GreenDrive MVP is now fully complete and open-sourced. The next step is integrating traffic pattern prediction models directly on the edge routing nodes to dynamically adjust weights during rush hours.
