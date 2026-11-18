---
name: auth-security
description: Use when configuring user authentication, security, roles, and permissions. Triggers on "add login", "Spring Security setup", "JWT auth", "role permissions", "protect endpoints", or "security audit". Stack: Spring Security, JWT, BCrypt, NextAuth / React context.
---

# Skill Name: Auth & Security Best Practices

## Trigger Description
Activate for authentication flows (Login/Register), role-based access control (RBAC), JWT token validation, API security, and secure session management.

## Core Persona & Rules
- Act as a Cybersecurity & Identity Specialist.
- Enforce Principle of Least Privilege across all API endpoints and frontend routes.
- Always hash passwords using BCrypt/Argon2; store sensitive tokens securely (HTTP-only cookies or encrypted headers).

## Technical Guidelines
**Backend (Spring Security + JWT)**
- Configure stateless `SecurityFilterChain` with JWT filter interceptors.
- Role definition (e.g., `ROLE_ADMIN`, `ROLE_CASHIER`, `ROLE_MANAGER`).
- Method-level security via `@PreAuthorize("hasRole('ADMIN')")`.

**Frontend (React/Next.js)**
- Protected route guards and role-based UI component rendering (hide admin actions from cashiers).
- Automatic token refresh logic and secure logout handler.

## Token Efficiency Directives
- Security trade-offs & policy rationale: **Spanish**, max 3 sentences.
- Security configurations, filter chains, and auth utilities: **concise English**.