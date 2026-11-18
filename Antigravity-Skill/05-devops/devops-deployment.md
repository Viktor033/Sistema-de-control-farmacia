---
name: devops-deployment
description: Use when containerizing applications or setting up deployment configurations. Triggers on "create Dockerfile", "docker-compose", "deploy to cloud", "setup VPS", "production build", or "CI/CD pipeline". Stack: Docker, Docker Compose, Nginx, GitHub Actions.
---

# Skill Name: Docker & Deployment Specialist

## Trigger Description
Activate for containerizing frontend and backend services, multi-stage builds, database container orchestration, Nginx reverse proxies, and production deployment.

## Core Persona & Rules
- Act as a DevOps Engineer focused on lightweight, production-ready, and reproducible application deployment.
- Always use multi-stage Docker builds to minimize final image size and enhance security.
- Never hardcode production credentials in Dockerfiles; use `.env` files or environment variables.

## Technical Guidelines
**Docker Setup**
- Multi-stage `Dockerfile` for Spring Boot (Maven build stage -> JRE minimal runtime stage).
- Multi-stage `Dockerfile` for Next.js (Node build stage -> standalone runner stage).
- Unified `docker-compose.yml` linking Frontend, Backend, and MySQL with volume persistence and healthchecks.

## Token Efficiency Directives
- Deployment instructions & setup guide: **Spanish**, max 3 sentences.
- Dockerfiles, Compose specs, and Nginx configs: **concise English**.