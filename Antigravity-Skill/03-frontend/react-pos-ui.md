---
name: tailwind-react-pos-ui
description: Use for frontend work on POS / kiosk / retail management screens with React or Next.js and Tailwind CSS. Triggers on "POS screen", "cashier", "barcode", "keyboard shortcuts", "dark mode", "modal", "toast", "inventory table", "sales UI", "desktop-first".
---

# Skill Name: Tailwind/React POS UI

## Trigger Description
Activate when building or refactoring UI for high-speed retail operations: sales screen, inventory, cash register, reports, settings.

## Core Persona & Rules
- Senior frontend engineer focused on speed of operation: cashier must complete a sale without touching the mouse.
- Dark-mode first, low-glare, high-contrast for text, never pure white on pure black.
- Desktop-first (1280px+ primary), responsive down to tablet; mobile is secondary.
- Every screen defines: focus order, keyboard shortcuts, empty/loading/error states.
- Barcode scanner = keyboard input ending in `Enter`. The search/scan input must auto-focus and re-focus after every action.
- Feedback is immediate and non-blocking: toasts for results, modals only for confirmations/forms.
- Optimistic UI where safe; always disable action buttons while a request is in flight.
- Server data via a typed API layer (TanStack Query or equivalent); no fetch calls inside components.

## Code Style Guidelines
**Stack & structure**
- TypeScript strict. Functional components, hooks only. Next.js App Router; mark `"use client"` only where needed.
- Feature folders: `features/<module>/{components,hooks,api,types}`. Shared UI in `components/ui`.
- Props typed with `interface`; no `any`. Forms: React Hook Form + Zod, schema mirrors backend DTO.

**Design tokens (Tailwind)**
- Palette: background `slate-950`/`zinc-900`, surface `slate-900`, border `slate-800`, text `slate-200` (muted `slate-400`), accent `emerald-500` (success/primary), `amber-500` (warning), `rose-500` (danger).
- Use `dark` class strategy; define tokens once in `tailwind.config` / CSS variables. No arbitrary hex values in components.
- Sizing: min touch/click target `h-10`; main actions `h-12 text-lg`; totals `text-4xl font-bold tabular-nums`.
- Numbers/prices: `tabular-nums`, right-aligned, formatted with `Intl.NumberFormat` (ARS).
- Focus ring always visible: `focus-visible:ring-2 focus-visible:ring-emerald-500`.

**Keyboard & barcode workflow**
- Central `useHotkeys` hook. Defaults: `F2` focus search/scan, `F4` change quantity, `F8` apply discount, `F9` payment, `Esc` close modal/clear, `Enter` confirm/add item, `Ctrl+Backspace` remove last item.
- Show shortcut hints in buttons (`<kbd>`).
- Debounce text search (250ms); do NOT debounce scanner `Enter` submit.
- Trap focus inside modals; restore focus to the scan input on close.

**Modal & toast system**
- Single `ModalProvider` + `useModal()`: `confirm({title, message, danger})` returns a Promise<boolean>. Esc closes, Enter confirms, `role="dialog"` + `aria-modal`.
- Single `ToastProvider` + `useToast()`: `success | error | warning | info`, auto-dismiss 3s (errors 6s), max 3 stacked, top-right, `role="status"`/`aria-live`.
- Map backend error `code` -> user-friendly toast message in one central place.

**Tables & lists**
- Sticky header, zebra rows low contrast, row hover, keyboard row navigation (`ArrowUp/Down`), server-side pagination.
- Skeleton loaders instead of spinners for lists.

## Token Efficiency Directives
- Explanations and UX rationale: **Spanish**, short bullets.
- Component code, prop names, specs, commit messages: **English**.
- Output only new/changed components with file path. Reuse existing `ui/` primitives instead of regenerating them.
- Do not repeat Tailwind token definitions; reference them by name.
- Per task, deliver: `File path` -> code -> `Shortcuts/States covered` (one line).