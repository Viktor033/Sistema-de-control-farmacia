# Manual de Uso Completo — FarmaciaControl (Sistema de Gestión Farmacéutica & POS)

Bienvenido al manual de usuario y referencia funcional de **FarmaciaControl**, un sistema integral de **Punto de Venta (POS), Gestión de Inventario (Vademécum), Control de Lotes bajo normativa FEFO y Auditoría de Caja** diseñado para farmacias.

El proyecto se encuentra íntegramente contenido en el archivo [index.html](file:///c:/PROYECTOS/Farmacia/index.html), funcionando como una aplicación web interactiva (*Single-Page Application*) sin requerir servidores externos ni instalación de bases de datos para su ejecución.

---

## Índice

1. [Resumen General y Características del Sistema](#1-resumen-general-y-características-del-sistema)
2. [Estructura de la Interfaz Principal](#2-estructura-de-la-interfaz-principal)
   - [2.1 Barra Lateral Izquierda (Sidebar)](#21-barra-lateral-izquierda-sidebar)
   - [2.2 Barra Superior (Header)](#22-barra-superior-header)
3. [Atajos Rápidos de Teclado](#3-atajos-rápidos-de-teclado)
4. [Guía Detallada por Pestañas (Módulos del Sistema)](#4-guía-detallada-por-pestañas-módulos-del-sistema)
   - [4.1 Pestaña 1: Inicio (Dashboard)](#41-pestaña-1-inicio-dashboard)
   - [4.2 Pestaña 2: Ventas (POS / Mostrador)](#42-pestaña-2-ventas-pos--mostrador)
   - [4.3 Pestaña 3: Medicamentos (Inventario General)](#43-pestaña-3-medicamentos-inventario-general)
   - [4.4 Pestaña 4: Lotes y Vencimientos (Normativa FEFO)](#44-pestaña-4-lotes-y-vencimientos-normativa-fefo)
   - [4.5 Pestaña 5: Reportes & Cierre](#45-pestaña-5-reportes--cierre)
   - [4.6 Pestaña 6: Configuración](#46-pestaña-6-configuración)
5. [Ventanas Modales y Herramientas Especiales](#5-ventanas-modales-y-herramientas-especiales)
   - [5.1 Modal: Comprobante de Venta Fiscal (Ticket Térmico)](#51-modal-comprobante-de-venta-fiscal-ticket-térmico)
   - [5.2 Modal: Registrar Ingreso de Lote](#52-modal-registrar-ingreso-de-lote)
   - [5.3 Modal: Alta de Medicamento](#53-modal-alta-de-medicamento)
   - [5.4 Modal: Resumen de Cierre de Caja X](#54-modal-resumen-de-cierre-de-caja-x)
   - [5.5 Simulador de Lector de Código de Barras (Scanner EAN)](#55-simulador-de-lector-de-código-de-barras-scanner-ean)
6. [Catálogo Inicial de Prueba (Datos Precargados)](#6-catálogo-inicial-de-prueba-datos-precargados)
7. [Notas Técnicas y Detalles de Funcionamiento Interno](#7-notas-técnicas-y-detalles-de-funcionamiento-interno)

---

## 1. Resumen General y Características del Sistema

**FarmaciaControl** simula la operatoria completa de un mostrador farmacéutico moderno cumpliendo con criterios de trazabilidad sanitaria (ANMAT / FEFO):

- **Rotación FEFO (*First Expired, First Out*):** Cuando se confirma una venta, el sistema descuenta automáticamente las unidades comenzando por el lote cuya fecha de vencimiento esté más próxima.
- **Retroalimentación Sonora Sintetizada (Web Audio API):** El sistema genera sonidos reales de mostrador sin depender de archivos de audio externos:
  - **Bip agudo de escáner (`1760 Hz`):** Al escanear, agregar/modificar ítems del carrito o cambiar el método de pago.
  - **Doble tono de éxito (`880 Hz -> 1320 Hz`):** Al abrir el ticket fiscal, confirmar una venta, dar de alta un medicamento/lote, cerrar caja o guardar la configuración.
  - **Tono grave de advertencia/error (`220 Hz`):** Cuando se busca un código inexistente, se intenta vender un producto agotado o se supera el stock disponible.
- **Sistema de Notificaciones Flotantes (*Toasts*):** En la esquina superior derecha aparecen avisos contextuales de 4 tipos (`Éxito` en verde, `Advertencia` en ámbar, `Error` en rojo e `Información` en turquesa) que desaparecen automáticamente a los 3,5 segundos.
- **Impresión Térmica Optimizada (`@media print`):** Incluye hojas de estilo específicas para impresoras térmicas de tickets (oculta toda la interfaz y formatea únicamente el comprobante `#printable-ticket` en blanco y negro al invocar la impresión).

---

## 2. Estructura de la Interfaz Principal

La pantalla se divide en tres áreas fijas: **Barra Lateral Izquierda**, **Barra Superior** y **Contenedor Principal de Vistas**.

### 2.1 Barra Lateral Izquierda (Sidebar)

Ubicada a la izquierda de forma permanente ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L123-L206)), contiene:

1. **Identidad de la Sucursal:** Muestra el logotipo de **FarmaciaControl** y el subtítulo `Sucursal Belgrano · Turno Activo`.
2. **Menú Principal (6 Pestañas):**
   - **Inicio (Dashboard):** Vista general de métricas, alertas y actividad reciente.
   - **Ventas (POS):** Mostrador de facturación y carrito de compras (incluye indicador del atajo `F2`).
   - **Medicamentos:** Maestro de productos farmacéuticos (vademécum) y control de stock.
   - **Lotes y Vencimientos:** Seguimiento por lote con un **contador numérico en color ámbar** (`#sidebar-badge-expiring`) que muestra en tiempo real cuántos lotes vencen en 30 días o menos.
   - **Reportes & Cierre:** Arqueo contable por medio de pago e historial completo de operaciones del día.
   - **Configuración:** Ajuste de datos fiscales de la farmacia y umbral de alerta de vencimientos.
3. **Sección "Acciones Rápidas":**
   - **Botón `Ingresar Nuevo Lote`:** Abre directamente la ventana modal de carga de lotes desde cualquier pestaña en la que te encuentres.
   - **Botón `Simular Lector Código`:** Abre el asistente interactivo para simular el disparo de un lector de código de barras EAN-13.
4. **Tarjeta del Profesional / Cajero (Pie de Barra Lateral):**
   - Muestra los datos del farmacéutico en turno: **Lic. Germán Méndez** (`Farmacéutico Reg. 8421`) con indicador luminoso verde de sesión activa.
   - **Botón de Información (`i`):** Al hacer clic, despliega una notificación informando: *"Turno iniciado hoy a las 08:00 hs. Caja #01 en regla."*

### 2.2 Barra Superior (Header)

Ubicada en la parte superior ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L212-L249)), ofrece herramientas globales accesibles desde cualquier pantalla:

1. **Buscador Global Rápido (`#global-search-input`):**
   - Permite escribir el nombre de un medicamento, código de barras (EAN) o principio activo desde cualquier pestaña.
   - **Cómo funciona:** Al presionar la tecla `Enter`, el sistema cambia automáticamente a la pestaña **Ventas (POS)**, traslada el texto buscado al buscador del mostrador y filtra el catálogo al instante.
2. **Botón de Control de Audio (`#btn-sound-toggle`):**
   - Representado por un ícono de altavoz. Permite **activar o silenciar** los efectos de sonido (bips de escáner y alertas) en cualquier momento.
3. **Insignia de Estado de Caja:**
   - Muestra el estado `Caja Abierta #01` con un punto verde pulsante.
4. **Reloj y Fecha del Sistema:**
   - **Reloj en tiempo real (`#system-clock`):** Se actualiza cada segundo con la hora local actual (`HH:MM:SS`).
   - **Fecha operativa (`#system-date`):** Muestra la fecha de referencia del sistema (`15 oct 2026`), utilizada para calcular los días restantes de vencimiento de todos los lotes.

---

## 3. Atajos Rápidos de Teclado

El sistema cuenta con un escuchador global de teclado ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L2852-L2887)) que funciona en cualquier momento:

| Tecla | Función | Descripción detallada |
| :--- | :--- | :--- |
| `F2` | **Ir a Buscar en POS** | Cambia inmediatamente a la pestaña **Ventas (POS)**, posiciona el cursor en el cuadro de búsqueda de medicamentos y selecciona el texto existente para escanear o escribir de inmediato. |
| `F4` | **Vaciar Carrito** | Limpia todos los productos cargados en el ticket de venta actual y reinicia los totales a `$ 0,00`. |
| `F9` | **Cobrar / Emitir Ticket** | Si hay al menos un producto en el carrito, abre la ventana modal del **Comprobante de Venta Fiscal**. Si el carrito está vacío, emite una alerta visual y sonora. |
| `Esc` | **Cerrar Ventanas** | Cierra cualquier ventana modal que se encuentre abierta (`Comprobante Fiscal`, `Nuevo Lote`, `Nuevo Medicamento` o `Cierre de Caja X`). |
| `Enter` | **Ejecutar Búsqueda / Escaneo** | En el buscador global lleva al POS; en el buscador del POS agrega directamente al carrito el primer medicamento que coincida por código EAN, nombre exacto o principio activo. |

---

## 4. Guía Detallada por Pestañas (Módulos del Sistema)

---

### 4.1 Pestaña 1: Inicio (Dashboard)

Es el centro de mando principal de la farmacia ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L255-L449)). Se actualiza dinámicamente cada vez que se realiza una venta, se da de alta un fármaco o se modifica un lote.

#### A. Botones de Acción Superior
- **`Abrir Mostrador (POS)`:** Lleva directamente a la pantalla de facturación.
- **`Nuevo Lote`:** Abre el formulario modal para registrar el ingreso de mercadería de droguería.

#### B. Las 4 Tarjetas de Indicadores Clave (KPIs)
1. **Total Medicamentos:** Muestra la cantidad total de productos registrados en el vademécum (inicia en `12` al cargar los datos reales en memoria).
2. **Próximos a Vencer (Interactiva):** Muestra cuántos lotes vencen dentro de los próximos 30 días (sin contar los ya vencidos). **Al hacer clic sobre esta tarjeta**, el sistema te lleva directamente a la pestaña **Lotes y Vencimientos**.
3. **Agotados / Críticos (Interactiva):** Cuenta cuántos medicamentos tienen un stock total menor o igual a 2 unidades (`stock <= 2`). **Al hacer clic sobre esta tarjeta**, el sistema te redirige a la pestaña **Medicamentos**.
4. **Total Facturado Hoy:** Suma el dinero total recaudado en la jornada a través de todos los medios de pago y detalla debajo el número total de operaciones emitidas.

#### C. Barra de Alerta de Seguridad Farmacéutica (Sistema FEFO)
- Banner destacado en tonos ámbar/rojo que advierte sobre lotes próximos a expirar y cuenta con el botón **`Auditar Lotes`**, el cual redirige a la vista de Lotes y Vencimientos.

#### D. Paneles Inferiores
- **Últimas Ventas Emitidas (Caja 01):** Lista las últimas **5 ventas** registradas en el día (mostrando hora, descripción de medicamentos y cantidades, número de ticket `TCK-XXXXXX`, medio de pago, obra social y monto total). Cada nueva venta realizada en el POS aparece inmediatamente en el primer lugar de esta lista.
- **Distribución de Facturación:** Gráfico de barras de progreso por familia terapéutica (*Analgésicos y Antiinflamatorios 42%*, *Antibióticos & Respiratorios 28%*, *Cardiovascular & Crónicos 18%*, *Venta Libre & Cuidados 12%*).
- **Cuadro "Arqueo de Turno Actual":** Incluye el botón **`Cierre X / Resumen`**, que abre el modal de arqueo de caja en tiempo real.

---

### 4.2 Pestaña 2: Ventas (POS / Mostrador)

Es el módulo operativo de atención al público y dispensación ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L453-L656)). Se divide en una barra superior de control y dos columnas de trabajo.

#### A. Barra Superior del Mostrador
- **Indicador de Atajos:** Recordatorio visual de las teclas rápidas (`F2 Buscar`, `F9 Cobrar`, `F4 Limpiar`).
- **Selector de Cliente / Cobertura (`#pos-client-type`):** Permite clasificar la condición del paciente que se imprimirá en el encabezado del ticket fiscal:
  - `Particular / Sin Obra Social`
  - `PAMI (Descuento 40%)`
  - `OSDE (Plan 210/310)`
  - `Swiss Medical`
  - `IOMA`
  > **Nota importante:** Este selector define la leyenda de condición del cliente en el ticket y en los reportes. Para aplicar el porcentaje matemático de descuento sobre el total, debe seleccionarse el porcentaje correspondiente en el selector **`Descuento / Obra Social`** dentro del panel derecho del Ticket de Venta.

#### B. Columna Izquierda: Buscador y Catálogo de Medicamentos (7 columnas)
1. **Campo de Búsqueda y Escaneo (`#pos-search-input`):**
   - **Filtrado en vivo (`oninput`):** A medida que escribes cualquier texto, filtra las tarjetas de medicamentos buscando coincidencias en:
     - Nombre comercial (ej. `Ibupirac`)
     - Principio activo (ej. `Ibuprofeno` o `Clonazepam`)
     - Código de barras EAN (ej. `779123456001`)
     - Laboratorio (ej. `Roemmers`)
   - **Disparo rápido con `Enter`:** Si escribes o escaneas un código EAN, el nombre exacto o parte del principio activo y presionas `Enter`, el sistema **agrega automáticamente 1 unidad al carrito**, limpia el buscador y emite el bip de lectura.
   - **Botón `Escanear`:** Ubicado dentro del extremo derecho del buscador; abre el simulador de lector de código de barras.
2. **Barra de Píldoras de Categorías (Filtros Rápidos):**
   Permite filtrar el catálogo con un solo clic:
   - `Todos`: Muestra todo el vademécum.
   - `Analgésicos`: Filtra los de categoría *Analgésico*.
   - `Antibióticos`: Filtra los de categoría *Antibiótico*.
   - `Cardio`: Filtra los de categoría *Cardiovascular*.
   - `Gastro`: Filtra los de categoría *Gastrointestinal*.
   - `Venta Libre`: Filtra todos los medicamentos cuya condición sea `libre`.
   - `Bajo Receta`: Filtra todos los medicamentos cuya condición sea `receta` o `archivada` (incluye psicotrópicos y respiratorios bajo receta).
3. **Grilla de Tarjetas de Medicamentos (`#pos-drug-grid`):**
   Cada tarjeta muestra:
   - Código EAN y **Etiqueta de Condición de Venta** (`Venta Libre` en verde, `Bajo Receta` en turquesa, `Receta Archivada` en púrpura).
   - Nombre comercial, principio activo, presentación y laboratorio.
   - Precio unitario en Pesos Argentinos (`$ ARS`) y estado de stock:
     - **Stock normal:** Texto gris (`Stock: X un.`).
     - **Stock bajo (1 a 3 unidades):** Texto ámbar parpadeante.
     - **Agotado (0 unidades):** Tarjeta atenuada en escala de grises con leyenda `Sin Stock`.
   - **Acción al hacer clic:** Hacer clic en cualquier tarjeta con stock disponible suma `+1` unidad al Ticket de Venta. Si está agotado, muestra un aviso de error y emite el sonido de alerta.

#### C. Columna Derecha: Constructor del Ticket de Venta y Cobro (5 columnas)
1. **Cabecera del Carrito:**
   - **Contador de ítems (`#cart-items-count-badge`):** Muestra la suma total de unidades cargadas en el ticket.
   - **Botón `Vaciar`:** Elimina todos los productos del ticket actual (equivalente a `F4`).
2. **Lista de Ítems Cargados (`#pos-cart-items`):**
   Por cada medicamento agregado se visualiza:
   - Nombre comercial (con insignia púrpura `Psicofármaco` si es de *Receta Archivada*), principio activo y precio unitario.
   - **Control de Cantidad (`-` / `+`):**
     - El botón `+` incrementa la cantidad validando que nunca supere el stock total disponible de ese medicamento.
     - El botón `-` reduce la cantidad; si llega a `0`, elimina automáticamente el renglón del carrito.
   - **Subtotal de línea** (`Precio x Cantidad`) y botón **`Quitar`** para eliminar todas las unidades de ese producto de una sola vez.
3. **Desglose de Cálculo e Impuestos:**
   - **Subtotal Bruto:** Suma de todos los ítems sin descuento.
   - **Selector `Descuento / Obra Social` (`#cart-discount-select`):** Desplegable para aplicar descuentos directos sobre el subtotal:
     - `0%` (Sin descuento)
     - `10% Efectivo`
     - `20% Obra Soc.`
     - `40% PAMI / Esp.`
     - `50% Prepaga`
     Al cambiar esta opción, se recalcula instantáneamente el monto descontado en color verde (`- $ X,XX`) y el total a cobrar.
   - **IVA Incluido (21%):** Muestra el cálculo informativo del 21% sobre el total neto (`Total a Cobrar * 0.21`).
   - **Total a Cobrar (`#cart-grand-total`):** Importe final neto destacado en tipografía grande.
4. **Selector de Método de Pago:**
   Tres botones excluyentes:
   - **`Efectivo`** (seleccionado por defecto; habilita la calculadora de vuelto).
   - **`Mercado Pago`** (QR / Transferencia; oculta la calculadora de vuelto).
   - **`Tarjeta D/C`** (Débito / Crédito; oculta la calculadora de vuelto).
5. **Calculadora de Vuelto (`Paga con:` / `Vuelto / Cambio:`):**
   - Visible únicamente cuando el método de pago es **`Efectivo`**.
   - Al ingresar el monto entregado por el cliente en el campo **`Paga con: $`**:
     - Si el monto alcanza o supera el total, muestra en verde el **vuelto exacto** a entregar.
     - Si el monto es menor al total a cobrar, muestra en color rojo la alerta **`Falta: $ X,XX`**.
6. **Botón `Finalizar Venta & Emitir Ticket (F9)`:**
   - Permanece deshabilitado cuando el carrito está vacío y se activa automáticamente al agregar el primer producto.
   - Al pulsarlo, abre la ventana modal de vista previa del **Comprobante de Venta Fiscal**.

---

### 4.3 Pestaña 3: Medicamentos (Inventario General)

Módulo de administración del catálogo maestro o vademécum de la farmacia ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L660-L726)).

#### A. Cabecera y Alta
- **Botón `+ Nuevo Medicamento`:** Abre el formulario modal para incorporar un nuevo producto al catálogo de la farmacia.

#### B. Barra de Búsqueda y Filtros Combinables
Los tres controles funcionan en conjunto y filtran la tabla de inventario en tiempo real:
1. **Buscador de Texto (`#inventory-search-input`):** Filtra por nombre comercial, principio activo, código EAN o laboratorio.
2. **Filtro por Condición de Venta (`#inventory-filter-prescription`):**
   - `Todas las condiciones`
   - `Venta Libre`
   - `Bajo Receta`
   - `Receta Archivada / Controlado`
3. **Filtro por Nivel de Stock (`#inventory-filter-stock`):**
   - `Todo el stock`
   - `Stock Crítico (≤ 5 un.)`: Muestra productos con entre 1 y 5 unidades.
   - `Sin Stock (0 un.)`: Muestra únicamente los productos agotados.
   - `Stock Normal (> 5 un.)`: Muestra productos con más de 5 unidades.

#### C. Tabla Maestra de Inventario y Acciones por Fila
Muestra 8 columnas: **Código / EAN**, **Medicamento / Presentación**, **Principio Activo**, **Laboratorio**, **Condición**, **Precio Unitario**, **Stock Total** (con alerta visual si es `0 un. (Agotado)` o `≤ 3 un. (Crítico)`) y **Acciones**:
- **Botón `+` (`Ingresar Lote`):** Abre el modal de registro de nuevo lote y **deja preseleccionado automáticamente ese medicamento** en el desplegable para cargar su stock de inmediato.
- **Botón Carrito (`Enviar al Mostrador POS`):** Cambia automáticamente a la pestaña **Ventas (POS)** y agrega 1 unidad de ese medicamento al ticket de venta actual.

---

### 4.4 Pestaña 4: Lotes y Vencimientos (Normativa FEFO)

Módulo dedicado a la trazabilidad sanitaria por lote, control de fechas de expiración y depuración de mercadería vencida ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L730-L832)).

#### A. Cabecera y Tarjetas de Resumen
- **Botón `Registrar Nuevo Lote`:** Abre el modal de carga de lotes.
- **3 Tarjetas de Estado Sanitario:**
  1. **Lotes Vencidos (Rojo):** Cantidad de lotes cuya fecha de vencimiento ya pasó respecto a la fecha del sistema (`días restantes < 0`).
  2. **Próximos a Vencer `< 30 días` (Ámbar):** Cantidad de lotes vigentes que expiran dentro de los próximos 30 días (`0 a 30 días restantes`).
  3. **Lotes en Estado Óptimo (Verde):** Cantidad de lotes con una vigencia superior a 30 días (`> 30 días restantes`).

#### B. Barra de Búsqueda y Píldoras de Filtro
1. **Buscador de Lotes (`#lotes-search-input`):** Filtra en vivo por **código de lote** (ej. `LOT-IBU-9402`), **nombre del medicamento** o **droguería proveedora** (ej. `Monroe`, `Sud`, `Suizo`, `COFALOZA`).
2. **4 Píldoras de Filtro por Estado:**
   - `Todos los Lotes`
   - `Próximos a Vencer` (entre 0 y 30 días)
   - `Vencidos` (< 0 días)
   - `Óptimos (OK)` (> 30 días)

#### C. Tabla de Lotes (Ordenamiento FEFO Automático)
- La tabla ordena automáticamente todos los lotes **por fecha de vencimiento ascendente** (primero los vencidos o más próximos a vencer).
- **Columnas:**
  - **Código / EAN:** Código de barras del medicamento vinculado.
  - **Medicamento:** Nombre comercial y droguería proveedora (`Prov: ...`).
  - **N° de Lote:** Código identificador del lote.
  - **Vencimiento:** Fecha formateada como `DD/MM/AAAA`.
  - **Días Restantes:** Cálculo exacto (`Vencido hace X días`, `¡Vence Hoy!`, `X días restantes` en ámbar, o `X días` en gris).
  - **Stock del Lote:** Muestra `Unidades actuales / Unidades iniciales` (ej. `20 / 50`). Cuando se realizan ventas en el POS, verás cómo disminuyen las unidades actuales del lote más próximo a vencer.
  - **Estado:** Etiqueta visual (`Vencido`, `Próximo a Vencer` u `OK`).
  - **Acciones — Botón Papelera (`Dar de baja / Descarte`):**
    - Al pulsarlo, solicita confirmación mediante un cuadro de diálogo: *`¿Confirma dar de baja el lote [Código] ([X] unidades)?`*.
    - Si se confirma, **elimina el lote de la lista y descuenta automáticamente esas unidades del stock general del medicamento**, actualizando todas las métricas del sistema.

---

### 4.5 Pestaña 5: Reportes & Cierre

Módulo de auditoría contable de la jornada y consulta histórica de comprobantes ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L836-L902)).

#### A. Cabecera y Arqueo por Medio de Pago
- **Botón `Imprimir Reporte`:** Invoca el diálogo de impresión del navegador (`window.print()`).
- **3 Tarjetas de Recaudación en Vivo:**
  1. **Efectivo en Caja:** Suma total de ventas cobradas en `Efectivo` durante el día (con nota informativa de `Fondo inicial: $ 20.000,00`).
  2. **Mercado Pago / Transferencia:** Suma total de ventas cobradas por `Mercado Pago` (QR).
  3. **Tarjetas Débito / Crédito:** Suma total de ventas cobradas con `Tarjeta D/C`.

#### B. Tabla "Registro Completo de Tickets de la Jornada"
Lista todas las transacciones del día desde la más reciente hasta la más antigua, detallando:
- **N° Ticket** (`TCK-XXXXXX` o `#0001-XXXXXX`)
- **Hora** de emisión
- **Medicamentos** dispensados y sus cantidades
- **Medio de Pago**
- **Obra Social / Tipo de Cliente**
- **Monto Total** cobrado
- **Columna Ticket — Botón Ojo (`Ver Comprobante`):**
  - Al hacer clic en el ícono del ojo de cualquier venta pasada, se abre el **Modal de Comprobante Fiscal** reconstruyendo el ticket térmico de esa operación histórica para visualizarlo o reimprimirlo.

---

### 4.6 Pestaña 6: Configuración

Permite personalizar los datos institucionales y fiscales de la farmacia ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L906-L954)).

1. **Datos de la Farmacia (Encabezado de Ticket):**
   - **Razón Social / Nombre de Fantasía** (Por defecto: `Farmacia San Cayetano - Red FarmaciaControl`).
   - **CUIT / N° de Registro** (Por defecto: `30-71489234-9`).
   - **Dirección y Localidad** (Por defecto: `Av. Cabildo 2450, CABA, Argentina`).
   - **Farmacéutico Director Técnico** (Por defecto: `Lic. Germán Méndez - M.P. 8421`).
2. **Umbrales de Alerta de Lotes:**
   - **Días para alerta de vencimiento:** Campo numérico configurable entre `5` y `90` días (por defecto `30`).
3. **Botón `Guardar Cambios`:**
   - Actualiza de inmediato el encabezado del **Ticket Térmico Fiscal** con la nueva Razón Social, CUIT, Dirección y Director Técnico, confirmando la operación con una notificación y sonido de éxito.

---

## 5. Ventanas Modales y Herramientas Especiales

### 5.1 Modal: Comprobante de Venta Fiscal (Ticket Térmico)

Se abre al pulsar **`Finalizar Venta & Emitir Ticket (F9)`** en el POS ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L962-L1102)):
- Muestra una simulación realista de **ticket térmico en papel blanco** con:
  - Cabecera fiscal configurada (Nombre de farmacia, sucursal, dirección, CUIT, condición frente al IVA y Director Técnico).
  - Número de ticket autogenerado (`#0001-XXXXXX`), fecha, hora exacta, número de caja (`#01`) y condición del cliente/Obra Social.
  - Detalle renglón por renglón (`Nombre`, `Cantidad x Precio Unitario` y `Subtotal`).
  - Subtotal, Descuento de Obra Social, IVA Incluido (21%), **Total a Pagar**, Forma de Pago y, si es en efectivo, monto **Recibido** y **Su Vuelto**.
  - Código de barras gráfico simulado y pie de página.
- **3 Botones Inferiores:**
  1. **`Volver al Mostrador` (o botón `X` / tecla `Esc`):** Cierra la vista previa sin descontar stock ni registrar la venta, permitiendo seguir editando el carrito.
  2. **`Imprimir Térmica`:** Abre la ventana de impresión del sistema configurada para imprimir únicamente el ticket térmico.
  3. **`Confirmar y Descontar Stock`:**
     - Descuenta las unidades vendidas del stock general del medicamento.
     - Busca los lotes asociados a cada medicamento vendido y **descuenta las unidades siguiendo estricto orden FEFO** (primero del lote que vence antes).
     - Registra la operación en el historial de ventas del día (`salesHistory`), actualiza el Dashboard y los Reportes, y limpia el carrito para atender al siguiente cliente.

### 5.2 Modal: Registrar Ingreso de Lote

Se abre desde la barra lateral, el Dashboard, la tabla de Medicamentos (ícono `+`) o la pestaña de Lotes ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L1106-L1173)):
- **Medicamento Asociado (`*`):** Lista desplegable con todos los medicamentos del vademécum y su stock actual.
- **Código de Lote (`*`):** Sugiere automáticamente un código aleatorio (`LOT-XXXX`) que puede editarse libremente.
- **Fecha de Vencimiento (`*`):** Sugiere por defecto exactamente **1 año hacia adelante** respecto a la fecha del sistema (`2027-10-15`), editable mediante selector de calendario.
- **Cantidad de Cajas / Unidades (`*`):** Número entre `1` y `1000` (por defecto `20`).
- **Droguería Proveedora:** Selección entre:
  - `Droguería del Sud`
  - `Droguería Monroe Americana`
  - `Suizo Argentina`
  - `COFALOZA`
- **Al pulsar `Guardar Lote`:** Crea el nuevo lote, **suma automáticamente las unidades al stock general del medicamento seleccionado** y reordena la tabla de lotes bajo criterio FEFO.

### 5.3 Modal: Alta de Medicamento

Se abre desde el botón **`+ Nuevo Medicamento`** en la pestaña **Medicamentos** ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L1177-L1258)):
- **Campos requeridos:**
  - **Nombre Comercial** (ej. `Clonagin 0.5`)
  - **Principio Activo** (ej. `Clonazepam 0.5 mg`)
  - **Código de Barras (EAN):** Se autocompleta con un código argentino sugerido (`779XXXXXXXXX`) editable.
  - **Presentación / Formato** (ej. `Caja x 30 comprimidos`)
  - **Laboratorio** (ej. `Baliarda`)
  - **Categoría:** `Analgésico`, `Antibiótico`, `Cardiovascular`, `Gastrointestinal`, `Psicotrópico` o `Venta Libre`.
  - **Precio ($ ARS):** Monto numérico (mínimo `100`, pasos de `50`).
  - **Condición de Venta:** `Venta Libre (OTC)`, `Bajo Receta Médica` o `Bajo Receta Archivada (Psicofármaco)`.
- **Al pulsar `Dar de Alta`:** El medicamento se incorpora al vademécum con **stock inicial `0`**. Para asignarle unidades disponibles para la venta, solo debes hacer clic en el botón **`+` (`Ingresar Lote`)** de ese nuevo medicamento en la tabla de inventario.

### 5.4 Modal: Resumen de Cierre de Caja X

Se abre desde el botón **`Cierre X / Resumen`** en la esquina inferior derecha del **Dashboard** ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L1262-L1315)):
- Muestra los datos fijos de apertura (`Operador: Lic. Germán Méndez`, `Hora de Apertura: 08:00 hs`, `Fondo Fijo Inicial: $ 20.000,00`).
- Calcula en vivo la recaudación acumulada por canal:
  - **Total Cobrado en Efectivo**
  - **Total Mercado Pago / QR**
  - **Total Tarjetas**
  - **RECAUDACIÓN TOTAL**
- **Botón `Imprimir Acta de Cierre`:** Cierra el modal y emite una confirmación visual y sonora indicando que el Acta de Cierre X fue generada e impresa.

### 5.5 Simulador de Lector de Código de Barras (Scanner EAN)

Accesible desde el botón **`Simular Lector Código`** en la barra lateral o el botón **`Escanear`** dentro del buscador del POS ([index.html](file:///c:/PROYECTOS/Farmacia/index.html#L2833-L2849)):
- Despliega un cuadro interactivo con la lista completa de todos los códigos EAN registrados y sus nombres comerciales (proponiendo por defecto `779123456001`).
- Al aceptar o escribir un código válido, el sistema salta automáticamente a la vista **Ventas (POS)** y agrega 1 unidad del producto al carrito con sonido de escáner.

---

## 6. Catálogo Inicial de Prueba (Datos Precargados)

Para facilitar las pruebas inmediatas, el sistema inicia con **12 medicamentos**, **12 lotes** y **5 ventas históricas**:

| ID | Código EAN | Medicamento | Principio Activo | Categoría | Condición | Precio | Stock Inicial |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `MED-01` | `779123456001` | **Ibupirac 600 mg** | Ibuprofeno 600 mg | Analgésico | Venta Libre | $ 4.850 | 32 un. (2 lotes) |
| `MED-02` | `779123456002` | **Amoxidal 500 mg** | Amoxicilina 500 mg | Antibiótico | Bajo Receta | $ 7.200 | 8 un. (Próximo a vencer) |
| `MED-03` | `779123456003` | **Paracetamol Raffo 1g** | Paracetamol 1000 mg | Analgésico | Venta Libre | $ 5.400 | 45 un. (1 lote vencido + 1 lote OK) |
| `MED-04` | `779123456004` | **Lotrial 10 mg** | Enalapril 10 mg | Cardiovascular | Bajo Receta | $ 6.100 | 19 un. (Próximo a vencer) |
| `MED-05` | `779123456005` | **Losacor 50 mg** | Losartán Potásico 50 mg | Cardiovascular | Bajo Receta | $ 7.950 | 14 un. |
| `MED-06` | `779123456006` | **Rivotril 0.5 mg** | Clonazepam 0.5 mg | Psicotrópico | Receta Archivada | $ 6.800 | 11 un. |
| `MED-07` | `779123456007` | **Gaster 20 mg** | Omeprazol 20 mg | Gastrointestinal | Venta Libre | $ 5.200 | 2 un. (**Stock Crítico**) |
| `MED-08` | `779123456008` | **Ventolin Inhalador** | Salbutamol 100 mcg | Respiratorio | Bajo Receta | $ 11.300 | 0 un. (**Agotado**) |
| `MED-09` | `779123456009` | **Actron 400 Rápida Acción** | Ibuprofeno 400 mg cáp. blanda | Analgésico | Venta Libre | $ 3.600 | 50 un. |
| `MED-10` | `779123456010` | **Optamox Dúo 1g** | Amoxicilina + Ác. Clavulánico | Antibiótico | Bajo Receta | $ 14.800 | 12 un. |
| `MED-11` | `779123456011` | **Sertal Compuesto** | Propinoxato + Clonixinato | Analgésico | Venta Libre | $ 4.900 | 26 un. |
| `MED-12` | `779123456012` | **Taural Plus** | Ranitidina + Magaldrato | Gastrointestinal | Venta Libre | $ 6.300 | 1 un. (**Stock Crítico**) |

---

## 7. Notas Técnicas y Detalles de Funcionamiento Interno

Tras auditar el código fuente en [index.html](file:///c:/PROYECTOS/Farmacia/index.html), ten en cuenta los siguientes comportamientos técnicos:

1. **Persistencia en Memoria (Sesión Actual):**
   - Todos los cambios realizados (ventas, nuevos medicamentos, alta/baja de lotes y cambios de configuración) se almacenan en variables de memoria JavaScript durante la sesión activa. **Si recargas la página del navegador (`F5`), los datos volverán a su estado inicial de demostración.**
2. **Independencia entre "Cliente" y "Porcentaje de Descuento" en el POS:**
   - Seleccionar una obra social en el desplegable superior **`Cliente:`** (por ejemplo, `PAMI (Descuento 40%)`) define el nombre de la cobertura en el ticket y en los reportes, pero **no cambia automáticamente** el desplegable **`Descuento / Obra Social:`** ubicado debajo del subtotal del carrito. Recuerda seleccionar también el porcentaje deseado (`10%`, `20%`, `40%` o `50%`) en el panel de cobro.
3. **Comportamiento del Botón "Confirmar y Descontar Stock" al Ver Tickets Históricos:**
   - Cuando abres un comprobante antiguo desde la pestaña **Reportes & Cierre** usando el ícono del ojo (`reprintPastSale`), se reutiliza el mismo modal del ticket térmico. Si solo deseas consultar o reimprimir un ticket pasado, ciérralo con **`Volver al Mostrador`**, el botón **`X`** o la tecla **`Esc`** (evita pulsar `Confirmar y Descontar Stock` al visualizar un ticket histórico si previamente ya habías confirmado otra venta en la sesión, para no duplicar el último registro).
4. **Descuento de Lotes FEFO y Lotes Vencidos:**
   - Al confirmar una venta, el algoritmo FEFO ordena todos los lotes del medicamento con `units > 0` por fecha de vencimiento ascendente. Por ello, si existe un lote vencido que aún figura en la tabla (como el lote `LOT-PAR-5541` de *Paracetamol Raffo 1g* vencido el `15/09/2026`), se recomienda **darlo de baja primero** desde la pestaña **Lotes y Vencimientos** (botón papelera) antes de dispensar ese producto en el mostrador.
5. **Umbral de Días de Vencimiento en Configuración:**
   - El campo `Días para alerta de vencimiento` en la pestaña **Configuración** es actualmente visual; las funciones internas `getBatchStatus()` y `updateDashboardMetrics()` evalúan un umbral fijo de `30` días respecto a la constante `SYSTEM_DATE = 2026-10-15`.
