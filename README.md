# FarmaciaControl - Sistema de Gestión Farmacéutica & POS Integral

![version](https://img.shields.io/badge/version-1.0.0-0284c7)
![Stack](https://img.shields.io/badge/HTML5%20%7C%20JS-Tailwind%20CSS-0d9488)
![Normativa](https://img.shields.io/badge/Trazabilidad-FEFO%20%2F%20ANMAT-d97706)
![status](https://img.shields.io/badge/status-active-22c55e)

**FarmaciaControl** es una solución web robusta y moderna diseñada para optimizar la administración, el control de inventario sanitario y el flujo de dispensación en mostrador de farmacias. Combina una interfaz intuitiva y responsiva con un potente motor operativo para gestionar el vademécum de medicamentos, la trazabilidad de lotes y vencimientos bajo normativa **FEFO** (*First Expired, First Out*), liquidación de descuentos por Obras Sociales y emisión de tickets térmicos fiscales con arqueo de caja en tiempo real.

---

## 🚀 Características Principales

### 🛒 Punto de Venta (POS) y Mostrador de Dispensación
* **Catálogo Interactivo de Alta Velocidad:** Búsqueda instantánea por código de barras (EAN-13), nombre comercial, principio activo o laboratorio, con filtros rápidos por categoría terapéutica (*Analgésicos, Antibióticos, Cardiovascular, Gastrointestinal, Venta Libre y Bajo Receta*).
* **Simulador de Escáner de Código de Barras:** Lectura directa mediante tecla `Enter` o asistente de escaneo EAN con retroalimentación sonora sintetizada (*Web Audio API*).
* **Coberturas y Obras Sociales:** Selección de condición del paciente (*Particular, PAMI, OSDE, Swiss Medical, IOMA*) y aplicación de descuentos porcentuales automáticos (`10%`, `20%`, `40%`, `50%`) con desglose de IVA (21%).
* **Múltiples Medios de Cobro y Calculadora de Vuelto:** Soporte para cobros en **Efectivo** (con cálculo automático de cambio o faltante en vivo), **Mercado Pago / QR** y **Tarjetas de Débito/Crédito**.

### 💊 Gestión de Inventario y Vademécum Farmacéutico
* **Altas y Consultas de Medicamentos:** Registro completo de fórmulas farmacéuticas incluyendo nombre comercial, droga genérica / principio activo, código EAN, presentación, laboratorio, precio unitario y categoría.
* **Clasificación Sanitaria de Venta:** Diferenciación visual mediante etiquetas de seguridad para productos de **Venta Libre (OTC)**, **Bajo Receta Médica** y **Bajo Receta Archivada (Psicofármacos / Controlados)**.
* **Filtros Combinados de Stock:** Localización inmediata de productos en estado **Normal (> 5 un.)**, **Stock Crítico (≤ 5 un.)** o **Agotados (0 un.)**, con envío directo al mostrador POS o carga rápida de lote desde la misma fila.

### 📅 Control de Lotes y Vencimientos (Normativa FEFO)
* **Algoritmo FEFO Automatizado (*First Expired, First Out*):** Al confirmar cada venta, el sistema descuenta automáticamente las unidades comenzando por el lote con fecha de vencimiento más próxima, garantizando la rotación sanitaria correcta.
* **Semáforo de Vigencia y Días Restantes:** Cálculo automático de días hasta la expiración, clasificando el inventario en lotes **Óptimos (> 30 días)**, **Próximos a Vencer (≤ 30 días)** y **Vencidos (Bloqueados)**.
* **Trazabilidad de Droguerías y Baja por Descarte:** Registro de ingresos vinculados a proveedor (*Droguería del Sud, Monroe Americana, Suizo Argentina, COFALOZA*) y función de descarte de lotes vencidos con ajuste automático sobre el stock general.

### 📊 Panel de Control (Dashboard) en Tiempo Real
* **Indicadores Clave de Rendimiento (KPIs):** Tarjetas interactivas con el total de medicamentos en vademécum, alertas de lotes próximos a vencer, productos agotados/críticos para reposición y facturación acumulada del día.
* **Monitor de Seguridad Farmacéutica:** Banner preventivo de rotación prioritaria y listado en vivo de las últimas operaciones emitidas por la caja activa.
* **Distribución de Facturación:** Visualización porcentual del rendimiento de ventas por familia terapéutica.

### 🧾 Ticket Térmico Fiscal, Reportes y Cierre de Caja X
* **Vista Previa e Impresión Térmica:** Generación de comprobantes con formato de impresora térmica (`@media print`), código de barras simulado, detalle de ítems, descuentos de Obra Social y datos del Director Técnico.
* **Auditoría de Jornada y Reimpresión:** Historial completo de tickets emitidos en el turno con visor integrado para consultar o reimprimir cualquier comprobante pasado.
* **Arqueo y Acta de Cierre X:** Resumen contable desglosado por canal de cobro (*Efectivo en Caja, Mercado Pago/Transferencia y Posnet Tarjetas*) junto con el fondo fijo inicial del turno.

### ⚙️ Configuración Fiscal y Operativa
* **Personalización de Cabecera de Ticket:** Edición en vivo de *Razón Social / Nombre de Fantasía*, *CUIT*, *Dirección de la Sucursal* y *Farmacéutico Director Técnico (M.P.)*.
* **Atajos de Teclado de Mostrador:** Flujo optimizado sin uso de mouse mediante teclas rápidas para búsqueda en mostrador (`F2`), limpieza de ticket (`F4`), cobro inmediato (`F9`) y cierre de ventanas (`Esc`).

---

## 📁 Estructura del Proyecto

```text
Sistema-de-control-farmacia/
├── index.html               # Vista principal y estructura de pestañas/modales
├── css/
│   └── styles.css           # Estilos personalizados, animaciones y formato térmico (@media print)
├── js/
│   ├── tailwind-config.js   # Configuración de paleta clínica y tipografías de Tailwind
│   ├── data.js              # Base de datos inicial (vademécum, lotes FEFO e historial de caja)
│   ├── audio.js             # Sintetizador de audio POS mediante Web Audio API
│   └── app.js               # Motor principal (POS, carrito, inventario, lotes, reportes y atajos)
├── README.md                # Presentación general del sistema
└── MANUAL_DE_USO.md         # Manual de usuario detallado paso a paso
```

---

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5 Semántico, CSS3 y JavaScript Vanilla (ES6+).
* **Diseño y UI:** [Tailwind CSS](https://tailwindcss.com/) (Tema oscuro clínico de alto contraste con paleta *Teal & Emerald*).
* **Iconografía y Tipografía:** [Lucide Icons](https://lucide.dev/), tipografía *Inter* para interfaz y *JetBrains Mono* para importes tabulares y tickets térmicos.
* **Audio POS:** Síntesis de sonido en tiempo real mediante **Web Audio API** nativa del navegador.

---

## 📚 Documentación Adicional

Para conocer el paso a paso de cada pantalla, botón, filtro y ventana modal, consulta el **[Manual de Uso Completo](MANUAL_DE_USO.md)**.
# Sistema-de-control-farmacia
