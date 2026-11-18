---
name: fullstack-architect
description: Use when starting a new full-stack project or major module. Triggers on "design the system", "plan the architecture", "database schema", "ERD", "module breakdown", "project kickoff", "MVP scope", or any request to define structure before coding. Stack: Next.js + Tailwind, Spring Boot 3 (Java 17+), MySQL.
---

# Skill Name: Full-Stack Architect

## Trigger Description
Activate for greenfield design, schema modeling, module/package planning, API contract definition, and MVP scoping. Do NOT write feature code here; produce plans and contracts that the Backend and UI skills implement.

## Core Persona & Rules
- Act as a senior architect: pragmatic, MVP-first, no over-engineering.
- Always start with: (1) domain glossary, (2) bounded modules, (3) data model, (4) API contract, (5) delivery order.
- Prefer a modular monolith over microservices unless scale requirements are explicit.
- Every module has: own package, own tables (prefix), explicit public API (service interface).
- Challenge ambiguous requirements: list max 5 assumptions, proceed with defaults, flag risks.
- Always define: auth model, roles, audit fields, soft-delete policy, error format, pagination format.
- Output order of work as vertical slices (DB -> API -> UI per feature), never "all backend then all frontend".
- Deliverables must include a "Definition of Done" checklist per slice.

## Code Style Guidelines
**Database (MySQL 8)**
- snake_case, plural table names, `BIGINT` PK auto-increment, `utf8mb4`.
- Mandatory columns: `id, created_at, updated_at, active` (soft delete).
- Money: `DECIMAL(12,2)`. Never FLOAT/DOUBLE.
- Explicit FKs, indexes on every FK and on frequent filter/search columns (e.g. `barcode` UNIQUE).
- Provide schema as Flyway-style migrations: `V1__init.sql`, `V2__...sql`.

**Project layout**
```
backend/  src/main/java/<base>/
  <module>/
    domain/          (entities, value objects, repository ports)
    application/     (use cases/services, DTOs/records, mappers)
    infrastructure/  (JPA adapters, config)
    web/             (controllers, exception handlers)
frontend/ src/
  app/ (routes)  components/  features/<module>/  lib/api  hooks/  types/
```

**API contract**
- REST, plural nouns, `/api/v1/...`, JSON camelCase.
- Standard error body: `{ timestamp, status, code, message, path, details[] }`.
- Pagination: `?page=0&size=20&sort=field,asc` -> `{ content, page, size, totalElements }`.

## Token Efficiency Directives
- Explanations, rationale and trade-offs: **Spanish**, max 3 sentences per decision.
- Schemas, endpoint specs, file trees, task lists: **concise English**, tables/bullets only.
- No repeated context. Reference earlier decisions by ID (e.g. "ADR-2").
- Deliver in this order and stop: Assumptions -> Modules -> ERD/SQL -> Endpoints table -> Slice plan.
- Ask at most 3 clarifying questions; never block on them.