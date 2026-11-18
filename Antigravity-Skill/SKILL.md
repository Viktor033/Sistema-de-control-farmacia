---
name: frontend-trends-2026
description: Aplica tendencias de diseño frontend de 2026 (bento grids, glassmorphism, brutalismo táctil, tipografía cinética) con animaciones modernas (View Transitions API, Scroll-Driven Animations, GSAP, Framer Motion). Usar cuando el usuario pida una landing, portfolio o UI "moderna", "novedosa", "con animaciones pro", o pida modernizar un diseño existente.
---

# Tendencias Frontend 2026 + Animaciones Pro

## Objetivo
Diseñar e implementar interfaces que se vean actuales (no genéricas / "vibe-coded"), eligiendo entre dos direcciones estéticas según el tipo de proyecto, y usando técnicas de animación nativas del browser antes de recurrir a librerías pesadas.

## Paso 0 — Elegir dirección estética
Antes de escribir código, definir con qué línea va el proyecto (preguntar al usuario si no es obvio por el rubro):

- **Soft / Glassmorphism** → ideal para SaaS, apps de productividad, fintech amigable: fondos con blur (`backdrop-filter: blur()`), transparencias sutiles, bordes suaves, bento grids para organizar features/dashboards.
- **Tactile Brutalism / Minimal Engineered** → ideal para portfolios, estudios creativos, marcas que quieren diferenciarse del montón de templates con IA: bordes sólidos de 1px (sin drop-shadow difuso), tipografía grande como elemento visual principal (kinetic typography), alto contraste, poco color (1-2 colores + neutros), grillas estrictas (8pt).

No mezclar ambas líneas en el mismo proyecto. Si el usuario no especifica, preguntar antes de avanzar.

## Paso 1 — Layout
- **Bento Grid**: usar `grid-template-areas` o `grid-template-columns: repeat(auto-fit, minmax(...))` para organizar cards de distinto tamaño, estilo "caja bento". Muy usado en landings de producto/dashboards.
- **Container Queries** (`@container`) en vez de solo media queries, para que los componentes se adapten a su contenedor padre y no únicamente al viewport — clave si el proyecto usa componentes reutilizables.
- CSS moderno: `:has()` para estilos condicionales sin JS, anidamiento nativo (`&`), evitar preprocesadores si el browser target ya soporta CSS nativo.

## Paso 2 — Tipografía como interfaz
- Usar `clamp()` para tamaños de fuente fluidos (viewport-scaled), evitando breakpoints rígidos.
- Si la línea es brutalista: un título gigante puede reemplazar al hero image tradicional. Priorizar peso y tracking antes que decoración.

## Paso 3 — Animaciones (de más simple/nativo a más pesado)

### 3.1 View Transitions API (nativa, sin librerías)
Para transiciones suaves entre estados o entre páginas (en SPA o MPA):
```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.4s;
}
```
```js
document.startViewTransition(() => updateDOM());
```
Verificar soporte de browser objetivo antes de depender 100% de esto (dar fallback sin animación si no está soportado).

### 3.2 Scroll-Driven Animations API (nativa, sin JS de scroll listener)
Para efectos de "aparece al hacer scroll" sin costo de performance:
```css
.elemento {
  animation: fade-in linear;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Preferir esto sobre `IntersectionObserver` + JS cuando el efecto es puramente visual.

### 3.3 Framer Motion (si el proyecto es React)
Para animaciones de componentes, gestos (drag, hover, tap) y orquestación de entrada/salida:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
/>
```

### 3.4 GSAP (cuando se necesita control fino o timelines complejos)
Usar para secuencias de animación coordinadas (varios elementos, scroll-trigger complejo tipo storytelling). Es más pesado — no usarlo para algo que la Scroll-Driven Animations API nativa ya resuelve.

## Paso 4 — No perder de vista lo básico de 2026
- **Accesibilidad primero**: contraste AA mínimo, `prefers-reduced-motion` respetado en TODAS las animaciones (desactivar o simplificar si el usuario lo tiene activado).
- **Performance**: animar solo `transform` y `opacity` (evitar animar `width`, `top`, `left` que causan reflow). Lazy-load de imágenes y componentes pesados.
- **Core Web Vitals**: medir INP (Interaction to Next Paint), no solo tiempo de carga.

## Verificación
- Probar la página con `prefers-reduced-motion: reduce` activado en el sistema y confirmar que las animaciones se atenúan o desactivan.
- Revisar en DevTools que las animaciones corren a 60fps (pestaña Performance) y que no generan layout shift.
- Confirmar responsive real (no solo achicar la ventana): probar con container queries en al menos 2 anchos de contenedor distintos.

## Al terminar
Resumir: qué línea estética se eligió y por qué, qué técnicas de animación se usaron (nativas vs librería) y cualquier limitación de soporte de browser a tener en cuenta.
