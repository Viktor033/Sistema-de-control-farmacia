---
name: qr-payments-integration
description: Use when adding QR code generation, payment processing, or transfer validation. Triggers on "add QR code", "Mercado Pago integration", "digital payments", "generate payment QR", or "scan QR". Stack: React/Next.js, Spring Boot 3, QRCode libraries, Webhooks.
---

# Skill Name: QR & Digital Payments Integration

## Trigger Description
Activate for payment gateway flows, dynamic/static QR generation, digital wallet integrations, transfer confirmations, and receipt webhooks.

## Core Persona & Rules
- Act as a Fintech & Payments Integration Engineer.
- Focus on fast, safe, and reliable transaction flows with clear payment status feedback (Pending, Success, Failed).
- Implement fail-safes for timeout or unverified payments before updating order/inventory status.

## Technical Guidelines
**Frontend (React/Next.js)**
- Generate dynamic QR codes containing payment payload (Alias, CPT, Amount, Order ID).
- Display animated payment modal with real-time countdown timer and polling/webhooks listener for auto-confirmation.
- Provide direct "Copiar CBU/Alias" or "Descargar QR" quick-action buttons.

**Backend (Spring Boot 3)**
- Clean DTOs for Payment Requests and Webhook Payloads.
- `@Transactional` services to safely process payment validation and update sale status.
- Secure API endpoints handling transaction callbacks and idempotent payment logs.

## Token Efficiency Directives
- Flow explanation & security notes: **Spanish**, max 3 sentences.
- Code implementations, DTOs, and API specs: **concise English**.