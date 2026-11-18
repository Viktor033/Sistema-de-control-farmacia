/* ====================================================================
   3. NAVIGATION & VIEW SWITCHING
   ==================================================================== */
function switchView(viewName) {
  const views = ['dashboard', 'pos', 'medicamentos', 'lotes', 'reportes', 'configuracion'];
  
  views.forEach(v => {
    const viewEl = document.getElementById(`view-${v}`);
    const navEl = document.getElementById(`nav-${v}`);
    if (!viewEl || !navEl) return;

    if (v === viewName) {
      viewEl.classList.remove('hidden');
      navEl.classList.add('bg-teal-500/10', 'text-teal-400', 'border', 'border-teal-500/20');
      navEl.classList.remove('text-slate-400', 'hover:bg-slate-800/60');
    } else {
      viewEl.classList.add('hidden');
      navEl.classList.remove('bg-teal-500/10', 'text-teal-400', 'border', 'border-teal-500/20');
      navEl.classList.add('text-slate-400', 'hover:bg-slate-800/60');
    }
  });

  // Special action per view
  if (viewName === 'pos') {
    renderPosCatalog();
    setTimeout(() => {
      const inp = document.getElementById('pos-search-input');
      if (inp) inp.focus();
    }, 100);
  } else if (viewName === 'medicamentos') {
    renderInventoryTable();
  } else if (viewName === 'lotes') {
    renderBatchesTable();
  } else if (viewName === 'reportes') {
    renderReports();
  } else if (viewName === 'dashboard') {
    updateDashboardMetrics();
  }
  
  lucide.createIcons();
}


/* ====================================================================
   4. DASHBOARD METRICS & CALCULATIONS
   ==================================================================== */
function getDaysRemaining(expDateString) {
  const expDate = new Date(expDateString + "T00:00:00");
  const diffTime = expDate - SYSTEM_DATE;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getBatchStatus(expDateString) {
  const days = getDaysRemaining(expDateString);
  if (days < 0) return { status: 'Vencido', color: 'rose', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
  if (days <= 30) return { status: 'Próximo a Vencer', color: 'amber', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
  return { status: 'OK', color: 'emerald', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
}

function updateDashboardMetrics() {
  // Total medicines
  document.getElementById('metric-total-drugs').textContent = medicines.length;

  // Expiring batches in < 30 days
  const expiringCount = batches.filter(b => {
    const days = getDaysRemaining(b.expDate);
    return days >= 0 && days <= 30;
  }).length;
  document.getElementById('metric-expiring-soon').textContent = expiringCount;
  document.getElementById('sidebar-badge-expiring').textContent = expiringCount;

  // Out of stock or critical (<= 2 units)
  const lowStockCount = medicines.filter(m => m.stock <= 2).length;
  document.getElementById('metric-out-of-stock').textContent = lowStockCount;

  // Revenue today
  const todayTotal = salesHistory.reduce((acc, s) => acc + s.total, 0);
  document.getElementById('metric-total-revenue').textContent = formatARS(todayTotal);
  document.getElementById('metric-sales-count').textContent = `${salesHistory.length} operaciones emitidas`;

  // Render recent sales
  const container = document.getElementById('recent-sales-list');
  if (container) {
    container.innerHTML = salesHistory.slice(0, 5).map(sale => `
      <div class="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:bg-slate-800/80 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-mono font-bold text-xs">
            ${sale.time}
          </div>
          <div>
            <p class="text-xs font-semibold text-slate-200">${sale.itemsDesc}</p>
            <p class="text-[10px] text-slate-400 flex items-center gap-1.5">
              <span class="font-mono text-teal-300">${sale.id}</span>
              <span>·</span>
              <span>${sale.payment}</span>
              <span>·</span>
              <span class="text-slate-400">${sale.clientType}</span>
            </p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-mono font-bold text-emerald-400">${formatARS(sale.total)}</span>
          <p class="text-[9px] text-slate-400">Comprobante OK</p>
        </div>
      </div>
    `).join('');
  }
}


/* ====================================================================
   5. POS (POINT OF SALE) ENGINE
   ==================================================================== */
function setPosCategoryFilter(cat) {
  currentPosCategoryFilter = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    if (btn.dataset.cat === cat) {
      btn.className = "cat-pill px-3 py-1 rounded-lg font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30 whitespace-nowrap";
    } else {
      btn.className = "cat-pill px-3 py-1 rounded-lg font-medium text-slate-400 hover:text-slate-200 bg-slate-800/80 border border-slate-700 whitespace-nowrap";
    }
  });
  renderPosCatalog();
}

function filterCatalog(query) {
  renderPosCatalog(query);
}

function handlePosInputEnter(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    const value = event.target.value.trim().toLowerCase();
    if (!value) return;

    // Try exact match by barcode or name
    const match = medicines.find(m => 
      m.barcode === value || 
      m.name.toLowerCase() === value || 
      m.generic.toLowerCase().includes(value)
    );

    if (match) {
      addItemToCart(match.id);
      event.target.value = '';
      renderPosCatalog('');
    } else {
      showToast('warning', `No se encontró medicamento para: "${value}"`);
      playBeep('error');
    }
  }
}

function renderPosCatalog(searchQuery = '') {
  const grid = document.getElementById('pos-drug-grid');
  if (!grid) return;

  const q = searchQuery.toLowerCase().trim();
  let filtered = medicines.filter(m => {
    const matchesQuery = !q || 
      m.name.toLowerCase().includes(q) || 
      m.generic.toLowerCase().includes(q) || 
      m.barcode.includes(q) ||
      m.lab.toLowerCase().includes(q);

    let matchesCat = true;
    if (currentPosCategoryFilter === 'Venta Libre') matchesCat = m.condition === 'libre';
    else if (currentPosCategoryFilter === 'Bajo Receta') matchesCat = m.condition === 'receta' || m.condition === 'archivada';
    else if (currentPosCategoryFilter !== 'all') matchesCat = m.category === currentPosCategoryFilter;

    return matchesQuery && matchesCat;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500">
        <i data-lucide="package-search" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
        <p class="text-xs">No se encontraron medicamentos para el criterio de búsqueda.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  grid.innerHTML = filtered.map(med => {
    const isOutOfStock = med.stock <= 0;
    const isLowStock = med.stock > 0 && med.stock <= 3;
    
    let conditionBadge = '';
    if (med.condition === 'libre') {
      conditionBadge = '<span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">Venta Libre</span>';
    } else if (med.condition === 'receta') {
      conditionBadge = '<span class="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-semibold">Bajo Receta</span>';
    } else {
      conditionBadge = '<span class="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">Receta Archivada</span>';
    }

    return `
      <div 
        onclick="${isOutOfStock ? `showToast('error', 'Sin stock disponible de ${med.name}')` : `addItemToCart('${med.id}')`}" 
        class="group p-3 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/60 transition-all flex flex-col justify-between cursor-pointer select-none relative overflow-hidden ${isOutOfStock ? 'opacity-40 grayscale cursor-not-allowed' : ''}"
      >
        <div>
          <div class="flex items-start justify-between gap-1.5 mb-1">
            <span class="text-[10px] font-mono text-slate-400">${med.barcode}</span>
            ${conditionBadge}
          </div>
          <h4 class="text-xs font-bold text-slate-100 group-hover:text-teal-300 transition-colors line-clamp-1">${med.name}</h4>
          <p class="text-[11px] text-teal-400 font-medium truncate">${med.generic}</p>
          <p class="text-[10px] text-slate-400 truncate mt-0.5">${med.presentation} · ${med.lab}</p>
        </div>

        <div class="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span class="text-xs font-extrabold font-mono text-emerald-400">${formatARS(med.price)}</span>
          </div>
          <div>
            ${isOutOfStock 
              ? `<span class="text-[10px] font-bold text-rose-400">Sin Stock</span>` 
              : `<span class="text-[10px] ${isLowStock ? 'text-amber-400 font-bold animate-pulse' : 'text-slate-400'}">Stock: ${med.stock} un.</span>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function addItemToCart(drugId) {
  const drug = medicines.find(m => m.id === drugId);
  if (!drug) return;

  if (drug.stock <= 0) {
    showToast('error', `Medicamento agotado: ${drug.name}`);
    playBeep('error');
    return;
  }

  const existingIndex = cart.findIndex(item => item.id === drugId);
  if (existingIndex >= 0) {
    if (cart[existingIndex].qty + 1 > drug.stock) {
      showToast('warning', `Stock insuficiente. Solo quedan ${drug.stock} unidades de ${drug.name}`);
      playBeep('error');
      return;
    }
    cart[existingIndex].qty += 1;
  } else {
    cart.push({
      id: drug.id,
      name: drug.name,
      generic: drug.generic,
      price: drug.price,
      qty: 1,
      maxStock: drug.stock,
      condition: drug.condition
    });
  }

  playBeep('scan');
  showToast('success', `+1 ${drug.name} agregado`);
  renderCart();
}

function updateCartQty(drugId, delta) {
  const index = cart.findIndex(i => i.id === drugId);
  if (index === -1) return;

  const newQty = cart[index].qty + delta;
  if (newQty <= 0) {
    cart.splice(index, 1);
    playBeep('scan');
  } else if (newQty > cart[index].maxStock) {
    showToast('warning', `No se pueden agregar más de ${cart[index].maxStock} unidades`);
    playBeep('error');
    return;
  } else {
    cart[index].qty = newQty;
    playBeep('scan');
  }
  renderCart();
}

function removeCartItem(drugId) {
  cart = cart.filter(i => i.id !== drugId);
  playBeep('scan');
  renderCart();
}

function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  showToast('info', 'Ticket de venta vaciado');
  playBeep('scan');
  renderCart();
}

function renderCart() {
  const container = document.getElementById('pos-cart-items');
  const badge = document.getElementById('cart-items-count-badge');
  const finalizeBtn = document.getElementById('btn-finalize-sale');
  
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  badge.textContent = `${totalItems} ${totalItems === 1 ? 'ítem' : 'ítems'}`;

  if (cart.length === 0) {
    container.innerHTML = `
      <div id="cart-empty-state" class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
        <div class="w-12 h-12 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-center mb-3">
          <i data-lucide="shopping-bag" class="w-6 h-6 text-slate-400"></i>
        </div>
        <p class="text-sm font-medium text-slate-300">El ticket de venta está vacío</p>
        <p class="text-xs text-slate-400 max-w-xs mt-1">Escanee un código de barra o haga clic en cualquier medicamento para agregarlo.</p>
      </div>
    `;
    finalizeBtn.disabled = true;
    calculateCartTotals();
    lucide.createIcons();
    return;
  }

  finalizeBtn.disabled = false;

  container.innerHTML = cart.map(item => `
    <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 gap-2">
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-1.5">
          <h5 class="text-xs font-bold text-slate-200 truncate">${item.name}</h5>
          ${item.condition === 'archivada' ? '<span class="text-[8px] bg-purple-500/20 text-purple-300 px-1 rounded font-bold">Psicofármaco</span>' : ''}
        </div>
        <p class="text-[10px] text-teal-400 truncate">${item.generic}</p>
        <p class="text-[10px] text-slate-400 font-mono">${formatARS(item.price)} c/u</p>
      </div>

      <!-- Quantity Stepper -->
      <div class="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg p-0.5">
        <button onclick="updateCartQty('${item.id}', -1)" class="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800">
          <i data-lucide="minus" class="w-3 h-3"></i>
        </button>
        <span class="w-6 text-center text-xs font-mono font-bold text-slate-100">${item.qty}</span>
        <button onclick="updateCartQty('${item.id}', 1)" class="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800">
          <i data-lucide="plus" class="w-3 h-3"></i>
        </button>
      </div>

      <!-- Line item total -->
      <div class="text-right w-20">
        <span class="text-xs font-mono font-bold text-slate-100">${formatARS(item.price * item.qty)}</span>
        <button onclick="removeCartItem('${item.id}')" class="block ml-auto text-[10px] text-rose-400 hover:text-rose-300 mt-0.5">Quitar</button>
      </div>
    </div>
  `).join('');

  calculateCartTotals();
  lucide.createIcons();
}

function calculateCartTotals() {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountSelect = document.getElementById('cart-discount-select');
  const discountPercent = discountSelect ? (parseFloat(discountSelect.value) || 0) : 0;
  const discountAmount = subtotal * (discountPercent / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount);
  const ivaAmount = grandTotal * 0.21; // Tax component

  const subEl = document.getElementById('cart-subtotal');
  const discEl = document.getElementById('cart-discount-amount');
  const ivaEl = document.getElementById('cart-iva');
  const totalEl = document.getElementById('cart-grand-total');

  if (subEl) subEl.textContent = formatARS(subtotal);
  if (discEl) discEl.textContent = `- ${formatARS(discountAmount)}`;
  if (ivaEl) ivaEl.textContent = formatARS(ivaAmount);
  if (totalEl) totalEl.textContent = formatARS(grandTotal);

  updateCashChangeDisplay(grandTotal);
  return { subtotal, discountAmount, grandTotal, ivaAmount };
}

function setPaymentMethod(method) {
  selectedPaymentMethod = method;
  const cashBtn = document.getElementById('pay-btn-cash');
  const qrBtn = document.getElementById('pay-btn-qr');
  const cardBtn = document.getElementById('pay-btn-card');
  const cashBox = document.getElementById('cash-calculator-box');

  const activeClass = "pay-method-btn flex flex-col items-center justify-center p-2 rounded-xl border border-teal-500/50 bg-teal-500/10 text-teal-300 font-medium transition-all";
  const inactiveClass = "pay-method-btn flex flex-col items-center justify-center p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 font-medium hover:text-slate-200 transition-all";

  if (cashBtn) cashBtn.className = method === 'cash' ? activeClass : inactiveClass;
  if (qrBtn) qrBtn.className = method === 'qr' ? activeClass : inactiveClass;
  if (cardBtn) cardBtn.className = method === 'card' ? activeClass : inactiveClass;

  if (cashBox) {
    if (method === 'cash') {
      cashBox.classList.remove('hidden');
    } else {
      cashBox.classList.add('hidden');
    }
  }
  playBeep('scan');
}

function updateCashChangeDisplay(grandTotal) {
  const cashInput = document.getElementById('cash-received-input');
  const inputVal = cashInput ? (parseFloat(cashInput.value) || 0) : 0;
  const changeDisplay = document.getElementById('cash-change-display');
  if (!changeDisplay) return;

  if (inputVal > 0) {
    const change = inputVal - grandTotal;
    if (change >= 0) {
      changeDisplay.textContent = formatARS(change);
      changeDisplay.className = "font-mono text-emerald-400 font-bold tabular-nums text-sm";
    } else {
      changeDisplay.textContent = `Falta: ${formatARS(Math.abs(change))}`;
      changeDisplay.className = "font-mono text-rose-400 font-bold tabular-nums text-xs";
    }
  } else {
    changeDisplay.textContent = "$ 0,00";
    changeDisplay.className = "font-mono text-slate-400 tabular-nums text-sm";
  }
}

function calculateCashChange() {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountSelect = document.getElementById('cart-discount-select');
  const discountPercent = discountSelect ? (parseFloat(discountSelect.value) || 0) : 0;
  const grandTotal = Math.max(0, subtotal - (subtotal * (discountPercent / 100)));
  updateCashChangeDisplay(grandTotal);
}


/* ====================================================================
   6. THERMAL TICKET & CHECKOUT MODAL
   ==================================================================== */
let currentSaleDetails = null;

function openCheckoutModal() {
  if (cart.length === 0) return;
  const { subtotal, discountAmount, grandTotal, ivaAmount } = calculateCartTotals();
  
  const clientTypeSelect = document.getElementById('pos-client-type');
  const clientTypeText = clientTypeSelect.options[clientTypeSelect.selectedIndex].text;
  const cashInput = parseFloat(document.getElementById('cash-received-input').value) || grandTotal;
  const cashChange = Math.max(0, cashInput - grandTotal);

  // Save for confirmation
  currentSaleDetails = {
    subtotal,
    discountAmount,
    grandTotal,
    ivaAmount,
    clientType: clientTypeText,
    paymentMethod: selectedPaymentMethod === 'cash' ? 'Efectivo' : (selectedPaymentMethod === 'qr' ? 'Mercado Pago' : 'Tarjeta D/C'),
    cashInput,
    cashChange,
    items: [...cart]
  };

  // Populate Thermal Ticket
  const ticketNum = `#0001-${String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}`;
  document.getElementById('ticket-number').textContent = ticketNum;
  
  const now = new Date();
  const dateStr = `15/10/2026 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  document.getElementById('ticket-datetime').textContent = dateStr;
  document.getElementById('ticket-client-cond').textContent = clientTypeText.toUpperCase();

  // Line items
  const ticketItemsContainer = document.getElementById('ticket-items-list');
  ticketItemsContainer.innerHTML = cart.map(item => `
    <div class="flex justify-between items-start">
      <div class="pr-2">
        <span class="font-bold">${item.name}</span>
        <div class="text-[9px] text-slate-600">${item.qty} un x ${formatARS(item.price)}</div>
      </div>
      <span class="font-mono font-bold whitespace-nowrap">${formatARS(item.price * item.qty)}</span>
    </div>
  `).join('');

  document.getElementById('ticket-subtotal').textContent = formatARS(subtotal);
  document.getElementById('ticket-discount').textContent = `- ${formatARS(discountAmount)}`;
  document.getElementById('ticket-iva').textContent = formatARS(ivaAmount);
  document.getElementById('ticket-grand-total').textContent = formatARS(grandTotal);

  document.getElementById('ticket-pay-method').textContent = currentSaleDetails.paymentMethod.toUpperCase();
  
  const cashRow = document.getElementById('ticket-cash-row');
  const changeRow = document.getElementById('ticket-change-row');
  if (selectedPaymentMethod === 'cash') {
    cashRow.classList.remove('hidden');
    changeRow.classList.remove('hidden');
    document.getElementById('ticket-cash-received').textContent = formatARS(cashInput);
    document.getElementById('ticket-cash-change').textContent = formatARS(cashChange);
  } else {
    cashRow.classList.add('hidden');
    changeRow.classList.add('hidden');
  }

  // Show modal with animation
  const modal = document.getElementById('modal-checkout');
  const card = document.getElementById('modal-checkout-card');
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
  }, 10);

  playBeep('success');
  lucide.createIcons();
}

function closeCheckoutModal() {
  const modal = document.getElementById('modal-checkout');
  const card = document.getElementById('modal-checkout-card');
  modal.classList.add('opacity-0');
  card.classList.remove('scale-100');
  card.classList.add('scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
}

function printTicket() {
  window.print();
}

function confirmAndFinishSale() {
  if (!currentSaleDetails) return;

  // 1. Decrement Stock from Medicine and FEFO Batches
  currentSaleDetails.items.forEach(cartItem => {
    const med = medicines.find(m => m.id === cartItem.id);
    if (med) {
      med.stock = Math.max(0, med.stock - cartItem.qty);
    }

    // Decrement from batches
    let needed = cartItem.qty;
    // Sort batches by expiry ascending (FEFO)
    const medBatches = batches
      .filter(b => b.drugId === cartItem.id && b.units > 0)
      .sort((a, b) => new Date(a.expDate) - new Date(b.expDate));

    for (const b of medBatches) {
      if (needed <= 0) break;
      if (b.units >= needed) {
        b.units -= needed;
        needed = 0;
      } else {
        needed -= b.units;
        b.units = 0;
      }
    }
  });

  // 2. Add to Sales History
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const itemsSummary = currentSaleDetails.items.map(i => `${i.name} x ${i.qty}`).join(', ');

  salesHistory.unshift({
    id: document.getElementById('ticket-number').textContent,
    time: timeStr,
    itemsDesc: itemsSummary,
    payment: currentSaleDetails.paymentMethod,
    clientType: currentSaleDetails.clientType,
    subtotal: currentSaleDetails.subtotal,
    discount: currentSaleDetails.discountAmount,
    total: currentSaleDetails.grandTotal,
  });

  // 3. Reset Cart
  cart = [];
  document.getElementById('cash-received-input').value = '';
  renderCart();
  renderPosCatalog();
  updateDashboardMetrics();

  closeCheckoutModal();
  showToast('success', '¡Venta finalizada con éxito! Stock actualizado en tiempo real.');
  playBeep('success');
}


/* ====================================================================
   7. MEDICAMENTOS (INVENTARIO) TABLE & ACTIONS
   ==================================================================== */
function renderInventoryTable() {
  const tbody = document.getElementById('inventory-table-body');
  if (!tbody) return;

  const q = (document.getElementById('inventory-search-input')?.value || '').toLowerCase().trim();
  const presFilter = document.getElementById('inventory-filter-prescription')?.value || 'all';
  const stockFilter = document.getElementById('inventory-filter-stock')?.value || 'all';

  const filtered = medicines.filter(m => {
    const matchesQ = !q || 
      m.name.toLowerCase().includes(q) || 
      m.generic.toLowerCase().includes(q) || 
      m.barcode.includes(q) || 
      m.lab.toLowerCase().includes(q);

    let matchesPres = true;
    if (presFilter === 'libre') matchesPres = m.condition === 'libre';
    else if (presFilter === 'receta') matchesPres = m.condition === 'receta';
    else if (presFilter === 'archivada') matchesPres = m.condition === 'archivada';

    let matchesStock = true;
    if (stockFilter === 'zero') matchesStock = m.stock === 0;
    else if (stockFilter === 'low') matchesStock = m.stock > 0 && m.stock <= 5;
    else if (stockFilter === 'ok') matchesStock = m.stock > 5;

    return matchesQ && matchesPres && matchesStock;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-8 text-slate-500">
          No se encontraron registros de medicamentos que coincidan.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(m => {
    let conditionBadge = '';
    if (m.condition === 'libre') {
      conditionBadge = '<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">Venta Libre</span>';
    } else if (m.condition === 'receta') {
      conditionBadge = '<span class="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">Bajo Receta</span>';
    } else {
      conditionBadge = '<span class="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">Receta Archivada</span>';
    }

    let stockBadge = '';
    if (m.stock === 0) {
      stockBadge = '<span class="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">0 un. (Agotado)</span>';
    } else if (m.stock <= 3) {
      stockBadge = `<span class="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">${m.stock} un. (Crítico)</span>`;
    } else {
      stockBadge = `<span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-mono">${m.stock} un.</span>`;
    }

    return `
      <tr class="hover:bg-slate-800/40 transition-colors">
        <td class="py-3 px-4 font-mono text-slate-400 font-semibold">${m.barcode}</td>
        <td class="py-3 px-4">
          <span class="font-bold text-slate-100">${m.name}</span>
          <p class="text-[10px] text-slate-400">${m.presentation}</p>
        </td>
        <td class="py-3 px-4 text-teal-400 font-medium">${m.generic}</td>
        <td class="py-3 px-4 text-slate-300">${m.lab}</td>
        <td class="py-3 px-4">${conditionBadge}</td>
        <td class="py-3 px-4 text-right font-mono font-bold text-emerald-400">${formatARS(m.price)}</td>
        <td class="py-3 px-4 text-center">${stockBadge}</td>
        <td class="py-3 px-4 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button onclick="quickAddBatchFor('${m.id}')" class="p-1.5 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 rounded-lg transition-colors" title="Ingresar Lote">
              <i data-lucide="plus-square" class="w-4 h-4"></i>
            </button>
            <button onclick="quickAddPos('${m.id}')" class="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Enviar al Mostrador POS">
              <i data-lucide="shopping-cart" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

function quickAddPos(drugId) {
  switchView('pos');
  addItemToCart(drugId);
}

function quickAddBatchFor(drugId) {
  openNewBatchModal();
  const select = document.getElementById('batch-form-drug');
  if (select) select.value = drugId;
}


/* ====================================================================
   8. LOTES Y VENCIMIENTOS TABLE & MODAL
   ==================================================================== */
function setBatchFilter(status) {
  currentBatchFilter = status;
  document.querySelectorAll('.batch-filter-btn').forEach(btn => {
    if (btn.dataset.status === status) {
      btn.className = "batch-filter-btn px-3 py-1.5 rounded-xl font-medium bg-teal-500/20 text-teal-300 border border-teal-500/30 whitespace-nowrap";
    } else {
      btn.className = "batch-filter-btn px-3 py-1.5 rounded-xl font-medium text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 whitespace-nowrap";
    }
  });
  renderBatchesTable();
}

function renderBatchesTable() {
  const tbody = document.getElementById('batches-table-body');
  if (!tbody) return;

  const q = (document.getElementById('lotes-search-input')?.value || '').toLowerCase().trim();

  // Counts
  let expiredCount = 0;
  let soonCount = 0;
  let okCount = 0;

  batches.forEach(b => {
    const days = getDaysRemaining(b.expDate);
    if (days < 0) expiredCount++;
    else if (days <= 30) soonCount++;
    else okCount++;
  });

  document.getElementById('lotes-count-expired').textContent = expiredCount;
  document.getElementById('lotes-count-soon').textContent = soonCount;
  document.getElementById('lotes-count-ok').textContent = okCount;

  const filtered = batches.filter(b => {
    const matchesQ = !q || 
      b.batchCode.toLowerCase().includes(q) || 
      b.drugName.toLowerCase().includes(q) ||
      b.supplier.toLowerCase().includes(q);

    const days = getDaysRemaining(b.expDate);
    let matchesStatus = true;
    if (currentBatchFilter === 'expired') matchesStatus = days < 0;
    else if (currentBatchFilter === 'soon') matchesStatus = days >= 0 && days <= 30;
    else if (currentBatchFilter === 'ok') matchesStatus = days > 30;

    return matchesQ && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-8 text-slate-500">
          No se encontraron lotes que coincidan con el filtro aplicado.
        </td>
      </tr>
    `;
    return;
  }

  // Sort by expiry date ascending (FEFO first)
  filtered.sort((a, b) => new Date(a.expDate) - new Date(b.expDate));

  tbody.innerHTML = filtered.map(b => {
    const med = medicines.find(m => m.id === b.drugId);
    const days = getDaysRemaining(b.expDate);
    const st = getBatchStatus(b.expDate);

    // Date formatting: DD/MM/YYYY
    const parts = b.expDate.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

    let daysText = '';
    if (days < 0) {
      daysText = `<span class="text-rose-400 font-bold font-mono">Vencido hace ${Math.abs(days)} días</span>`;
    } else if (days === 0) {
      daysText = `<span class="text-amber-300 font-bold font-mono">¡Vence Hoy!</span>`;
    } else if (days <= 30) {
      daysText = `<span class="text-amber-400 font-bold font-mono">${days} días restantes</span>`;
    } else {
      daysText = `<span class="text-slate-300 font-mono">${days} días</span>`;
    }

    return `
      <tr class="hover:bg-slate-800/40 transition-colors ${days < 0 ? 'bg-rose-950/10' : (days <= 30 ? 'bg-amber-950/10' : '')}">
        <td class="py-3 px-4 font-mono text-slate-400">${med ? med.barcode : 'N/A'}</td>
        <td class="py-3 px-4">
          <span class="font-bold text-slate-100">${b.drugName}</span>
          <p class="text-[10px] text-slate-400">Prov: ${b.supplier}</p>
        </td>
        <td class="py-3 px-4 font-mono font-bold text-teal-400">${b.batchCode}</td>
        <td class="py-3 px-4 font-mono text-slate-200">${formattedDate}</td>
        <td class="py-3 px-4">${daysText}</td>
        <td class="py-3 px-4 text-center font-mono font-bold text-slate-200">
          ${b.units} <span class="text-slate-500 font-normal">/ ${b.initialUnits}</span>
        </td>
        <td class="py-3 px-4 text-center">
          <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ${st.badge}">
            ${st.status}
          </span>
        </td>
        <td class="py-3 px-4 text-center">
          <button onclick="discardBatch('${b.id}')" class="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Dar de baja / Descarte">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

function discardBatch(batchId) {
  const idx = batches.findIndex(b => b.id === batchId);
  if (idx === -1) return;
  const b = batches[idx];

  if (confirm(`¿Confirma dar de baja el lote ${b.batchCode} (${b.units} unidades)?`)) {
    // Adjust medicine stock
    const med = medicines.find(m => m.id === b.drugId);
    if (med) {
      med.stock = Math.max(0, med.stock - b.units);
    }
    batches.splice(idx, 1);
    showToast('info', `Lote ${b.batchCode} dado de baja`);
    renderBatchesTable();
    updateDashboardMetrics();
  }
}

function openNewBatchModal() {
  // Populate drug select
  const select = document.getElementById('batch-form-drug');
  select.innerHTML = medicines.map(m => `
    <option value="${m.id}">${m.name} (${m.generic}) - Stock actual: ${m.stock}</option>
  `).join('');

  // Set default expiration date to 1 year ahead
  const nextYear = new Date(SYSTEM_DATE);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  document.getElementById('batch-form-date').value = nextYear.toISOString().split('T')[0];

  // Random lot code suggestion
  document.getElementById('batch-form-code').value = `LOT-${Math.floor(1000 + Math.random() * 9000)}`;

  const modal = document.getElementById('modal-new-batch');
  const card = document.getElementById('modal-new-batch-card');
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
  }, 10);
  lucide.createIcons();
}

function closeNewBatchModal() {
  const modal = document.getElementById('modal-new-batch');
  const card = document.getElementById('modal-new-batch-card');
  modal.classList.add('opacity-0');
  card.classList.remove('scale-100');
  card.classList.add('scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
}

function handleNewBatchSubmit(event) {
  event.preventDefault();
  const drugId = document.getElementById('batch-form-drug').value;
  const batchCode = document.getElementById('batch-form-code').value.trim();
  const expDate = document.getElementById('batch-form-date').value;
  const qty = parseInt(document.getElementById('batch-form-qty').value, 10);
  const supplier = document.getElementById('batch-form-supplier').value;

  const med = medicines.find(m => m.id === drugId);
  if (!med) return;

  const newBatch = {
    id: `LOT-${Date.now().toString().slice(-4)}`,
    drugId,
    drugName: med.name,
    batchCode,
    expDate,
    units: qty,
    initialUnits: qty,
    supplier
  };

  batches.push(newBatch);
  med.stock += qty;

  closeNewBatchModal();
  showToast('success', `Lote ${batchCode} registrado exitosamente (+${qty} un. a ${med.name})`);
  playBeep('success');
  
  renderBatchesTable();
  renderInventoryTable();
  updateDashboardMetrics();
}


/* ====================================================================
   9. MEDICAMENTOS (ALTA NUEVO FARMACO) MODAL
   ==================================================================== */
function openNewDrugModal() {
  // Suggest random barcode
  document.getElementById('drug-form-barcode').value = `779${Math.floor(100000000 + Math.random() * 900000000)}`;
  
  const modal = document.getElementById('modal-new-drug');
  const card = document.getElementById('modal-new-drug-card');
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
  }, 10);
  lucide.createIcons();
}

function closeNewDrugModal() {
  const modal = document.getElementById('modal-new-drug');
  const card = document.getElementById('modal-new-drug-card');
  modal.classList.add('opacity-0');
  card.classList.remove('scale-100');
  card.classList.add('scale-95');
  setTimeout(() => {
    modal.classList.add('hidden');
  }, 200);
}

function handleNewDrugSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('drug-form-name').value.trim();
  const generic = document.getElementById('drug-form-generic').value.trim();
  const barcode = document.getElementById('drug-form-barcode').value.trim();
  const presentation = document.getElementById('drug-form-pres').value.trim();
  const lab = document.getElementById('drug-form-lab').value.trim();
  const category = document.getElementById('drug-form-category').value;
  const price = parseFloat(document.getElementById('drug-form-price').value);
  const condition = document.getElementById('drug-form-condition').value;

  const newId = `MED-${String(medicines.length + 1).padStart(2, '0')}`;
  medicines.push({
    id: newId,
    name,
    generic,
    barcode,
    lab,
    presentation,
    price,
    category,
    condition,
    stock: 0
  });

  closeNewDrugModal();
  showToast('success', `Medicamento "${name}" registrado en vademécum. Ingrese un lote para asignarle stock.`);
  playBeep('success');

  renderInventoryTable();
  updateDashboardMetrics();
}


/* ====================================================================
   10. REPORTES & CIERRE DE CAJA
   ==================================================================== */
function renderReports() {
  const cashTotal = salesHistory.filter(s => s.payment === 'Efectivo').reduce((a, b) => a + b.total, 0);
  const qrTotal = salesHistory.filter(s => s.payment === 'Mercado Pago').reduce((a, b) => a + b.total, 0);
  const cardTotal = salesHistory.filter(s => s.payment === 'Tarjeta D/C').reduce((a, b) => a + b.total, 0);

  document.getElementById('rep-cash-total').textContent = formatARS(cashTotal);
  document.getElementById('rep-qr-total').textContent = formatARS(qrTotal);
  document.getElementById('rep-card-total').textContent = formatARS(cardTotal);

  const tbody = document.getElementById('reports-sales-body');
  tbody.innerHTML = salesHistory.map(s => `
    <tr class="hover:bg-slate-800/40 transition-colors">
      <td class="py-2.5 px-3 font-mono font-bold text-teal-400">${s.id}</td>
      <td class="py-2.5 px-3 font-mono text-slate-300">${s.time} hs</td>
      <td class="py-2.5 px-3 font-medium text-slate-100">${s.itemsDesc}</td>
      <td class="py-2.5 px-3">
        <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
          ${s.payment}
        </span>
      </td>
      <td class="py-2.5 px-3 text-slate-400">${s.clientType}</td>
      <td class="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">${formatARS(s.total)}</td>
      <td class="py-2.5 px-3 text-center">
        <button onclick="reprintPastSale('${s.id}')" class="text-slate-400 hover:text-teal-400" title="Ver Comprobante">
          <i data-lucide="eye" class="w-4 h-4"></i>
        </button>
      </td>
    </tr>
  `).join('');

  lucide.createIcons();
}

function reprintPastSale(saleId) {
  const sale = salesHistory.find(s => s.id === saleId);
  if (!sale) return;
  showToast('info', `Visualizando comprobante ${sale.id}`);
  // Open thermal preview with this sale data
  document.getElementById('ticket-number').textContent = sale.id;
  document.getElementById('ticket-datetime').textContent = `15/10/2026 ${sale.time}`;
  document.getElementById('ticket-client-cond').textContent = sale.clientType.toUpperCase();
  document.getElementById('ticket-items-list').innerHTML = `
    <div class="flex justify-between items-start py-1">
      <div><span class="font-bold">${sale.itemsDesc}</span></div>
      <span class="font-mono font-bold">${formatARS(sale.subtotal)}</span>
    </div>
  `;
  document.getElementById('ticket-subtotal').textContent = formatARS(sale.subtotal);
  document.getElementById('ticket-discount').textContent = `- ${formatARS(sale.discount)}`;
  document.getElementById('ticket-iva').textContent = formatARS(sale.total * 0.21);
  document.getElementById('ticket-grand-total').textContent = formatARS(sale.total);
  document.getElementById('ticket-pay-method').textContent = sale.payment.toUpperCase();
  document.getElementById('ticket-cash-row').classList.add('hidden');
  document.getElementById('ticket-change-row').classList.add('hidden');

  const modal = document.getElementById('modal-checkout');
  const card = document.getElementById('modal-checkout-card');
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    card.classList.remove('scale-95');
    card.classList.add('scale-100');
  }, 10);
}

function openCashCloseModal() {
  const cashTotal = salesHistory.filter(s => s.payment === 'Efectivo').reduce((a, b) => a + b.total, 0);
  const qrTotal = salesHistory.filter(s => s.payment === 'Mercado Pago').reduce((a, b) => a + b.total, 0);
  const cardTotal = salesHistory.filter(s => s.payment === 'Tarjeta D/C').reduce((a, b) => a + b.total, 0);
  const grand = cashTotal + qrTotal + cardTotal;

  document.getElementById('close-modal-cash').textContent = formatARS(cashTotal);
  document.getElementById('close-modal-qr').textContent = formatARS(qrTotal);
  document.getElementById('close-modal-card').textContent = formatARS(cardTotal);
  document.getElementById('close-modal-total').textContent = formatARS(grand);

  const modal = document.getElementById('modal-cash-close');
  modal.classList.remove('hidden');
  setTimeout(() => modal.classList.remove('opacity-0'), 10);
  lucide.createIcons();
}

function closeCashCloseModal() {
  const modal = document.getElementById('modal-cash-close');
  modal.classList.add('opacity-0');
  setTimeout(() => modal.classList.add('hidden'), 200);
}

function confirmCashClosure() {
  closeCashCloseModal();
  showToast('success', 'Acta de Cierre X generada e impresa en papel térmico.');
  playBeep('success');
}


/* ====================================================================
   11. CONFIGURACIÓN
   ==================================================================== */
function saveConfiguration() {
  const name = document.getElementById('cfg-pharmacy-name').value;
  const cuit = document.getElementById('cfg-pharmacy-cuit').value;
  const addr = document.getElementById('cfg-pharmacy-address').value;
  const dt = document.getElementById('cfg-pharmacy-dt').value;

  document.getElementById('ticket-pharma-name').textContent = name;
  document.getElementById('ticket-pharma-cuit').textContent = `CUIT: ${cuit} · IVA Resp. Inscripto`;
  document.getElementById('ticket-pharma-address').textContent = addr;
  document.getElementById('ticket-pharma-dt').textContent = `D.T.: ${dt}`;

  showToast('success', 'Configuración guardada correctamente.');
  playBeep('success');
}


/* ====================================================================
   12. GLOBAL SHORTCUTS & SEARCH
   ==================================================================== */
function handleGlobalSearch(e) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (!val) return;
    switchView('pos');
    const posInput = document.getElementById('pos-search-input');
    if (posInput) {
      posInput.value = val;
      filterCatalog(val);
    }
  }
}

function triggerBarcodePrompt() {
  const sampleCodes = medicines.map(m => `${m.barcode} (${m.name})`).join('\n');
  const input = prompt(
    `[SIMULADOR DE LECTOR DE CÓDIGO DE BARRA / SCANNER]\n\nEscanee un código o seleccione uno de los siguientes:\n\n${sampleCodes}\n\nIngrese el código EAN:`,
    "779123456001"
  );
  if (input) {
    switchView('pos');
    const med = medicines.find(m => m.barcode === input.trim());
    if (med) {
      addItemToCart(med.id);
    } else {
      showToast('warning', `Código no registrado: ${input}`);
      playBeep('error');
    }
  }
}

// Central Keydown Hotkeys Handler
window.addEventListener('keydown', (e) => {
  // F2: Focus Search / POS
  if (e.key === 'F2') {
    e.preventDefault();
    switchView('pos');
    setTimeout(() => {
      const inp = document.getElementById('pos-search-input');
      if (inp) {
        inp.focus();
        inp.select();
      }
    }, 50);
  }
  // F4: Clear cart
  if (e.key === 'F4') {
    e.preventDefault();
    clearCart();
  }
  // F9: Open Checkout
  if (e.key === 'F9') {
    e.preventDefault();
    if (cart.length > 0) {
      openCheckoutModal();
    } else {
      showToast('warning', 'Agregue al menos un medicamento para cobrar.');
      playBeep('error');
    }
  }
  // Esc: Close any open modal
  if (e.key === 'Escape') {
    closeCheckoutModal();
    closeNewBatchModal();
    closeNewDrugModal();
    closeCashCloseModal();
  }
});


/* ====================================================================
   13. REAL-TIME CLOCK & TOAST NOTIFICATION SYSTEM
   ==================================================================== */
function updateSystemClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('system-clock').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateSystemClock, 1000);
updateSystemClock();

function showToast(type = 'info', message = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-medium border transform transition-all duration-300 translate-y-2 opacity-0";

  let icon = 'info';
  if (type === 'success') {
    toast.classList.add('bg-slate-900', 'text-emerald-300', 'border-emerald-500/40', 'glow-teal');
    icon = 'check-circle';
  } else if (type === 'warning') {
    toast.classList.add('bg-slate-900', 'text-amber-300', 'border-amber-500/40', 'glow-amber');
    icon = 'alert-triangle';
  } else if (type === 'error') {
    toast.classList.add('bg-slate-900', 'text-rose-300', 'border-rose-500/40', 'glow-rose');
    icon = 'alert-octagon';
  } else {
    toast.classList.add('bg-slate-900', 'text-teal-300', 'border-teal-500/40');
    icon = 'info';
  }

  toast.innerHTML = `
    <i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });

  // Auto dismiss after 3.5s
  setTimeout(() => {
    toast.classList.add('opacity-0', '-translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


/* ====================================================================
   14. INITIALIZATION
   ==================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  updateDashboardMetrics();
  renderPosCatalog();
  renderInventoryTable();
  renderBatchesTable();
});
