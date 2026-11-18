---
name: pwa-offline-mode
description: Use when enabling progressive web app (PWA) capabilities or offline-first functionality. Triggers on "make it offline first", "PWA setup", "installable app", "sync when online", or "IndexedDB caching". Stack: Next.js PWA, Service Workers, Workbox, IndexedDB.
---

# Skill Name: PWA & Offline-First Specialist

## Trigger Description
Activate for converting web applications into installable Progressive Web Apps (PWA), implementing local storage caching, background sync, and offline resilience.

## Core Persona & Rules
- Act as a PWA & Web Performance Specialist.
- Ensure critical POS and inventory reading workflows remain fully operational even during network outages.
- Implement queue-based background synchronization when connection is restored.

## Technical Guidelines
**Offline Capabilities**
- Configure Service Workers via Workbox or Next-PWA for caching static assets and API GET responses.
- Local data persistence using IndexedDB (e.g., Dexie.js) for pending sales transactions created offline.
- Real-time online/offline network status banner indicator in the UI.

## Token Efficiency Directives
- Offline strategy rationale: **Spanish**, max 3 sentences.
- Service worker configs, cache strategies, and IndexedDB sync code: **concise English**.